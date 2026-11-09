# duNemilia — Etapa 6 / Teste real da extensão no Chromium

## Objetivo
Executar a extensão **MV3 verdadeira**, não apenas um mock do método WebMCP. O smoke test abre o service worker e a janela popup no Playwright/Chromium. Executa em GitHub Actions usando a extensão **pública 2.2**, `nemilia-extension.zip`, e produz resultado JSON.

## Limites
O smoke NÃO comprova execução WebMCP, concessão de permissões, consentimento, segurança nem compatibilidade com a candidata 2.3. O runner usa Chromium do Playwright, cuja versão é registrada no log. A candidata 2.3 permanece exclusivamente local, sem ser enviada ao repositório público.

## Execução no Windows com o ZIP 2.3.0 do autor
```powershell
py -m pip install playwright==1.58.0
py -m playwright install chromium
py tests/extension_smoke.py --zip "C:\\Downloads\\nemilia-extension-v2_3_0.zip" --output "artifacts\\nemilia-23-mv3-smoke.json"
```
O script é intencionalmente limitado ao carregamento real do MV3 e popup. Para E2E WebMCP, usar Chrome 149+ com flag ativada, perfil descartável e sem acesso a dados comerciais.

## Evidências e bloqueios
- Ambiente isolado anterior: Chromium 144 com extensão 2.3; service worker não foi observado em headless e tentativa headed não concluiu. **Não é defeito confirmado do Nemilia.**
- GitHub Actions é o validador independente para inicialização real da versão pública.
- Rodadas e relatórios só devem ser declarados PASS quando o workflow concluir.
