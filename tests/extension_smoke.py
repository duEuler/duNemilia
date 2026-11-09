#!/usr/bin/env python3
"""Real Chromium MV3 launch smoke. No external credentials, permissions or network calls.
Only checks that the extension's service worker and popup load.
"""
import argparse
import asyncio
import json
from pathlib import Path
import tempfile
import zipfile
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout

def unpack(zipped: Path, dest: Path):
    with zipfile.ZipFile(zipped) as archive:
        bad=archive.testzip()
        if bad: raise ValueError("Corrupt ZIP entry: " + bad)
        for info in archive.infolist():
            path=Path(info.filename)
            if path.is_absolute() or '..' in path.parts:
                raise ValueError("Unsafe ZIP path: "+info.filename)
        archive.extractall(dest)
    manifests=list(dest.rglob("manifest.json"))
    if len(manifests)!=1: raise ValueError("Expected exactly one manifest.json")
    manifest=json.loads(manifests[0].read_text(encoding="utf-8"))
    if manifest.get("manifest_version")!=3: raise ValueError("Manifest V3 required")
    if not isinstance(manifest.get("background",{}).get("service_worker"),str):
        raise ValueError("MV3 service worker not defined")
    return manifests[0].parent,manifest

async def check(zip_path, output):
    results={"schema":"duNemilia/extension-smoke/v1","file":zip_path.name,"tests":[]}
    with tempfile.TemporaryDirectory() as tmp:
        root=Path(tmp)
        extension,manifest=unpack(zip_path,root/"extension")
        results["extension_version"]=manifest.get("version")
        results["tests"].append({"name":"zip_manifest_mv3","result":"PASS"})
        async with async_playwright() as p:
            context=await p.chromium.launch_persistent_context(
                str(root/"profile"),channel="chromium",headless=True,
                args=[f"--disable-extensions-except={extension}",f"--load-extension={extension}","--no-sandbox"])
            try:
                try:
                    sw=context.service_workers[0] if context.service_workers else await context.wait_for_event("serviceworker",timeout=20000)
                except PlaywrightTimeout:
                    raise RuntimeError("MV3 worker not started: browser policy or extension startup failure")
                extension_id=sw.url.split("/")[2]
                data=await sw.evaluate("() => ({id:chrome.runtime.id, version:chrome.runtime.getManifest().version})")
                if data["id"]!=extension_id or data["version"]!=manifest["version"]:
                    raise AssertionError("Worker identity/version mismatch")
                results["tests"].append({"name":"service_worker_identity","result":"PASS","version":data["version"]})
                if manifest.get("action",{}).get("default_popup"):
                    page=await context.new_page()
                    await page.goto("chrome-extension://"+extension_id+"/"+manifest["action"]["default_popup"],wait_until="domcontentloaded")
                    if not await page.locator("body").count():
                        raise AssertionError("Popup body missing")
                    results["tests"].append({"name":"popup_dom_load","result":"PASS"})
                    await page.close()
            finally:
                await context.close()
    results["passed"]=len(results["tests"])
    results["total"]=3 if manifest.get("action",{}).get("default_popup") else 2
    output.parent.mkdir(parents=True,exist_ok=True)
    output.write_text(json.dumps(results,indent=2,ensure_ascii=False),encoding="utf-8")
    print(json.dumps(results,indent=2,ensure_ascii=False))

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--zip",type=Path,required=True)
    parser.add_argument("--output",type=Path,required=True)
    args=parser.parse_args()
    asyncio.run(check(args.zip,args.output))
