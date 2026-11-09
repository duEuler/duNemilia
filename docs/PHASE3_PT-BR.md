# duNemilia — Etapa 3: hardening da localização e matriz de WebMCP
Data: 2026-11-09. Branch criada diretamente da main (sha 4e6dac7). Contém novamente as mudanças da etapa 2, pois a PR #2 foi integrada na branch da PR #1 e **não diretamente na main**.

## Correções
- NEM-006: tradução de navegação com `startsWith` podia alterar textos compostos (ex.: Dashboard Statistics). Agora exige igualdade exata e preserva prefixo/sufixo de espaços.
- NEM-007: observação de mutações disparava renderização síncrona em cada evento. Agora agrupa chamadas por microtask e evita duplicação do seletor.
- NEM-008: elemento de seleção de idioma passou de `label` genérico para `div` contendo `label htmlFor` e `select id` acessíveis.
- NEM-009: traduções com espaçamento anormal preservam espaços externos e permitem ida/volta EN↔PT-BR.
- NEM-010: laboratório WebMCP acrescenta ferramenta **sem hints**, para testar tratamento de classificação conservadora; a ferramenta só altera contador em memória.

## Evidência e escopo
- GitHub CI: Python, sintaxe JS, build HTML, contrato de hooks e testes de comportamento Node; verificar runs da PR 3.
- Testes reais de consentimento da extensão em Chrome ≥149, recuperação 2.2→2.3 e observação de tráfego **ainda pendentes**.
- Sem publicação de código privado ou artefatos RC 2.3. Aplicativo 2.2 e ZIP original preservados.

## Laboratório recomendado
1. Servir `labs/webmcp-fixture.html` em localhost HTTP com perfil Chrome descartável e flag WebMCP.
2. Conferir quatro ferramentas: leitura, incremento consequencial, atraso e sem hints.
3. Negar incremento e verificar zero mutações; aprovar uma vez e contar uma mutação.
4. Ferramenta sem hints deve solicitar autorização ou ser bloqueada, nunca executar silenciosamente.
5. Alterar aba, recarregar e suspender durante chamada em andamento; verificar identidade do contexto e evitar execução no destino incorreto.
6. Salvar evidências redigidas: versão, build, URL, argumentos, diálogo, resultado, estado final e logs.

## Sugestões
- Substituir a tradução DOM por chaves i18n no código-fonte quando a árvore original for disponibilizada; evitar tradução de conteúdo dinâmico.
- Usar Playwright em E2E de Chrome com extensão MV3 e matriz de versões.
- Melhorar idempotência e detecção de navegação para ferramentas com efeitos.
- Benchmark crítico com modelos locais, LibreChat, Open WebUI, Langflow/Flowise e n8n antes de adotar componentes ou licenças.
