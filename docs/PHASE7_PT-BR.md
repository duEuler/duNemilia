# duNemilia — Etapa 7: teste automatizado real de isolamento MV3

**Base verificada**: `main` = `0aaed9eb3f75ebd28375700b7a0107ae71afb3b7` (PR #6 mesclada).

## Objetivo
Usar a extensão pública Nemilia 2.2 e o Chromium real do Playwright para testar service worker, duas abas HTTP locais com identificadores distintos, `chrome.scripting.executeScript`, separação de estado entre abas e substituição do documento após navegação.

## Execução local (Windows PowerShell)
```powershell
py -m pip install playwright==1.58.0
py -m playwright install chromium
py tests/extension_tabs_smoke.py --zip nemilia-extension.zip --output artifacts/extension-tabs.json
```
A versão RC 2.3 pode ser analisada **localmente** substituindo `--zip` pelo arquivo disponibilizado ao grupo. **Não enviar RC privado ao GitHub público.**

## Regras de interpretação
- Testes de extensão reais: usam o service worker, a API de tabs e o script injector de uma extensão carregada.
- O código injetado é uma função **sintética e independente**; não utiliza os métodos WebMCP próprios do Nemilia.
- Verificar origem/tab ID/navegação e autorização de ferramentas WebMCP requer Chrome compatível e testes adicionais com a RC 2.3.
- O teste não usa contas, tokens, sites de terceiros nem ações externas.
- CI Windows/Linux de outras suítes não substitui teste real da extensão 2.3.

## Próximos laboratórios
1. Usar Chrome 149+ com WebMCP ativado e a RC 2.3 num perfil descartável.
2. Validar `consequentialHint`, ferramentas sem hints e consentimento Allow/Deny.
3. Recarregar aba durante chamadas, iniciar ações simultâneas e conferir IDs de chamada e logs.
4. Documentar testes de idempotência, cancelamento, falhas ambíguas e origem errada.

## Resultado do laboratório automatizado
- Run GitHub Actions `42705123950`: **6/6 PASS** em Chromium com a extensão pública 2.2.0.
- O teste incluiu `chrome.scripting.executeScript` real em abas locais e descarte do documento após navegação.
- Teste local da candidata 2.3.0: bloqueado pela ausência de service worker observável no Chromium 144; não é evidência de defeito de produto.
