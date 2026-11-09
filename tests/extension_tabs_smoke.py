#!/usr/bin/env python3
"""MV3 runtime integration lab: real extension service worker and chrome.scripting.
Tests only synthetic localhost tabs; it DOES NOT test Nemilia WebMCP consent.
"""
import argparse
import asyncio
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import tempfile
import threading
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout
from extension_smoke import unpack

class PageHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        page = self.path.strip("/").split("?")[0]
        if page not in {"alpha", "beta", "gamma"}:
            self.send_error(404)
            return
        body = (f'<!doctype html><html><head><meta charset="utf-8">'
                f'<title>duNemilia {page}</title></head><body>'
                f'<main id="fixture" data-fixture="{page}">{page}</main></body></html>').encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
    def log_message(self,*args):
        pass

async def run(zip_path: Path, output: Path):
    evidence={"schema":"duNemilia/mv3-tabs/v1","archive":zip_path.name,"tests":[]}
    def record(name, ok, **extra):
        evidence["tests"].append({"name":name,"result":"PASS" if ok else "FAIL",**extra})
        if not ok: raise AssertionError(name)
    server=ThreadingHTTPServer(("127.0.0.1",0),PageHandler)
    threading.Thread(target=server.serve_forever,daemon=True).start()
    origin=f"http://127.0.0.1:{server.server_port}"
    try:
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            ext,manifest=unpack(zip_path,root/"extension")
            record("manifest_permissions",all(k in manifest.get("permissions",[]) for k in ("scripting","tabs")))
            async with async_playwright() as p:
                ctx=await p.chromium.launch_persistent_context(
                    str(root/"profile"),channel="chromium",headless=True,
                    args=[f"--disable-extensions-except={ext}",
                          f"--load-extension={ext}","--no-sandbox"])
                try:
                    worker=ctx.service_workers[0] if ctx.service_workers else await ctx.wait_for_event("serviceworker",timeout=20000)
                    record("service_worker_active",worker.url.startswith("chrome-extension://"))
                    alpha=await ctx.new_page()
                    beta=await ctx.new_page()
                    await alpha.goto(origin+"/alpha",wait_until="domcontentloaded")
                    await beta.goto(origin+"/beta",wait_until="domcontentloaded")
                    # Page IDs come from the extension's own chrome.tabs API.
                    tabs=await worker.evaluate("""async (base) => {
                        return (await chrome.tabs.query({})).filter(t=>t.url?.startsWith(base))
                          .map(t=>({id:t.id,url:t.url}));
                    }""",origin)
                    by_path={t["url"].split("/")[-1]:t for t in tabs}
                    record("two_distinct_local_tabs",all(k in by_path for k in ("alpha","beta")) and by_path["alpha"]["id"]!=by_path["beta"]["id"])
                    async def probe(tab_id):
                        return await worker.evaluate("""async (id) => {
                            const out=await chrome.scripting.executeScript({
                              target:{tabId:id},world:"ISOLATED",
                              func:() => ({
                                fixture:document.getElementById("fixture")?.dataset.fixture,
                                url:location.href,
                                marker:window.__duNemiliaSyntheticMarker??0
                              })
                            });
                            return out[0].result;
                        }""",tab_id)
                    a=await probe(by_path["alpha"]["id"])
                    b=await probe(by_path["beta"]["id"])
                    record("injection_targets_correct_tabs",a["fixture"]=="alpha" and b["fixture"]=="beta")
                    await worker.evaluate("""async (id) => chrome.scripting.executeScript({
                        target:{tabId:id},world:"MAIN",
                        func:()=>{ window.__duNemiliaSyntheticMarker=101; }
                    })""",by_path["alpha"]["id"])
                    # Read page MAIN world values without extension injection leakage.
                    a_value=await alpha.evaluate("window.__duNemiliaSyntheticMarker")
                    b_value=await beta.evaluate("window.__duNemiliaSyntheticMarker ?? 0")
                    record("page_state_isolated",a_value==101 and b_value==0)
                    await alpha.goto(origin+"/gamma",wait_until="domcontentloaded")
                    # Tab remains the same tab ID but its document and state changed.
                    after=await probe(by_path["alpha"]["id"])
                    flag=await alpha.evaluate("window.__duNemiliaSyntheticMarker ?? 0")
                    record("navigation_replaces_document",after["fixture"]=="gamma" and flag==0)
                    await alpha.close()
                    await beta.close()
                finally:
                    await ctx.close()
        evidence["passed"]=len(evidence["tests"])
        evidence["total"]=len(evidence["tests"])
        evidence["status"]="PASS"
    finally:
        server.shutdown()
        output.parent.mkdir(parents=True,exist_ok=True)
        output.write_text(json.dumps(evidence,indent=2,ensure_ascii=False),encoding="utf-8")
        print(json.dumps(evidence,indent=2,ensure_ascii=False))

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--zip",type=Path,required=True)
    parser.add_argument("--output",type=Path,required=True)
    args=parser.parse_args()
    try:
        asyncio.run(run(args.zip,args.output))
    except Exception as exc:
        # Preserve the reason even if browser startup failed before tests ran.
        if not args.output.exists():
            args.output.parent.mkdir(parents=True,exist_ok=True)
            args.output.write_text(json.dumps({"schema":"duNemilia/mv3-tabs/v1",
                "archive":args.zip.name,"status":"FAIL",
                "error_type":type(exc).__name__,"error":str(exc)},indent=2),encoding="utf-8")
        raise
