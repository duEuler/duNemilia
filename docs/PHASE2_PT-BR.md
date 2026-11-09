# duNemilia — Etapa 2: internacionalização e laboratório WebMCP
Data: 2026-11-09. Base pública: Nemilia 2.2. Alterações isoladas da `main`.

## Implementação
- `i18n/runtime.js`: 105 traduções estáticas de botões, labels, opções e placeholders, além dos itens de navegação. A escolha EN/PT-BR é persistida localmente.
- `labs/webmcp-fixture.html`: ferramentas descartáveis `lab_read`, `lab_increment` (consequencial) e `lab_delayed` (timeout).
- `tests/test_i18n_security_contract.py`: valida presença do catálogo, escopo restrito e ausência de rede no laboratório.
- A versão original 2.2 e a extensão não foram modificadas. Nenhum código da RC 2.3 foi publicado.

## Evidências
- Protótipo local da tradução em Chromium 144, sobre DOM extraído do arquivo RC 2.3: 15/15 verificações passaram. **Não constitui E2E da aplicação nem garante paridade binária do runtime publicado.**
- Laboratório mock de `document.modelContext` no Chromium: 5/5 verificações passaram. **Não constitui aprovação real de WebMCP.**
- O ambiente local impediu a abertura `file://` do aplicativo completo (ERR_BLOCKED_BY_ADMINISTRATOR), sem evidência de defeito do Nemilia.
- GitHub Actions deve confirmar testes de sintaxe, build e integridade em Windows/Linux.

## Ensaios manuais
1. Usar perfil Chrome descartável e arquivos sem dados reais.
2. Servir `labs/webmcp-fixture.html` via HTTP localhost, habilitar WebMCP no Chrome compatível.
3. Verificar descoberta das três ferramentas; `lab_read` não deve alterar o contador.
4. Negar `lab_increment` e conferir contador inalterado; aprovar amount=1 e conferir exatamente um incremento.
5. Durante `lab_delayed` ms=5000, recarregar, mudar de aba e navegar; recusar qualquer execução no contexto errado.
6. Repetir com Chrome >=155 e ferramentas sem hints; recomendar fail-closed em alterações de estado.
7. Registrar build, Chrome, OS, passos, argumentos, decisões, resultados, logs e screenshots (sem segredos).

## Pendências
A tradução **não é completa**. Notificações e erros emitidos dinamicamente por código precisam de chaves de i18n na camada emissora. Chats, instruções, modelos e conteúdo de usuário não devem ser traduzidos automaticamente. Fluxos WebMCP reais e migração 2.2→2.3 não foram homologados.

## Ideias a pesquisar
Catálogo versionado por IDs, snapshot visual, a11y, testes de confiança por origem, idempotência. Estudar Flowise/Langflow (fluxos), n8n (logs/automação), Open WebUI/LibreChat (provedores) e Browser Use (automação). Pesquisa comparativa e licenças ainda pendentes.