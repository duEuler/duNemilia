# duNemilia — Etapa 5: política WebMCP fail-closed (auditoria experimental)

Data: 2026-11-09. Base pública: `main` no SHA `db5c21dd14e4ba0ff7b24009ed90da831be7359e`.
O teste usa exclusivamente uma cópia de **extensão Nemilia 2.3.0 disponibilizada pelo autor ao grupo** e não publica nem copia o código dessa candidata no GitHub.

## Achado P5-SEC-001 — possibilidade de reexecução
**Evidência em código da candidata local:** em `NEM_WEBMCP_PROBE`, uma ferramenta não marcada como consequencial pode entrar no fallback de forma de argumentos após uma exceção com o texto exato `Failed to parse input arguments`. O cliente não comprova que a operação foi rejeitada antes de executar efeitos.

**Reprodução controlada:** ferramenta sintética incrementou um contador e lançou essa mensagem no primeiro retorno. Com versão original, foram observadas duas execuções e dois efeitos nas simulações de Chrome 154/155/156. A implementação corrigida local reduziu para uma execução e um efeito nos casos que exigem autorização (ver evidência JSON entregue separadamente).

**Limitação:** demonstra comportamento do método isolado sob condições artificiais. Não é prova de duplicação explorável numa página WebMCP real, nem de que o diálogo de aprovação seja bypassado.

## Correção recomendada
Política conservadora: qualquer ferramenta sem `readOnlyHint === true`, ou explicitamente `consequentialHint === true`, requer autorização. Não repetir automaticamente uma ação potencialmente mutável quando o resultado anterior for ambíguo. Se houver retries para ferramentas mutáveis, exigir IDs de idempotência implementados pelo destino; o cliente sozinho não garante exactly-once.

O fork contém **código de referência independente** em `security/webmcp-policy.js`, testes unitários e `tools/validate_webmcp_probe.cjs`, que usa um `background.js` privado fornecido localmente. **Essa política não foi aplicada à extensão pública 2.2 nem à candidata privada distribuída pelo autor.**

## Executar no Windows
```powershell
node --test tests/webmcp-policy.test.cjs
node tools/validate_webmcp_probe.cjs "C:\\Nemilia-RC\\background.js" "C:\\Nemilia-RC-Patch\\background.js"
```
O segundo comando imprime JSON com resultados observados de ambas as versões. Não o executar com acesso a dados reais.

## Homologação pendente
Chrome >=149 com flag WebMCP e extensão unpacked, consentimento Allow/Deny, chamadas concorrentes, mudança de origem, suspensão, reload, recuperação de sessão, arquivos locais, CSP e APIs de fornecedores.
