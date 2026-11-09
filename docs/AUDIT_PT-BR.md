# duNemilia — Auditoria inicial, riscos e roteiro de testes

Data: 2026-11-09. Base pública: `cd3218ca1b0f14b5e997636e3d94a7d56c4fa963` (Nemilia 2.2). A candidata 2.3 fornecida por Luis via Google Drive **não está na main pública**. Não combinar a extensão 2.3.0 com o aplicativo 2.2 sem matriz de compatibilidade.

## Achados rastreáveis
| ID | Evidência | Tratamento |
|---|---|---|
| NEM-001 | Fork e upstream no mesmo SHA inicial, build público 2.2 | Branch isolada, main preservada |
| NEM-002 | Consequential hint de WebMCP 2.3 exige validação | Simular readOnly, consequential e hints ausentes em Chrome |
| NEM-003 | Interface majoritariamente inglesa | Seletor PT-BR/EN **piloto somente na navegação** |
| NEM-004 | Single-file file:// e políticas CSP | Runtime inline sem CDN e build reversível |
| NEM-005 | Sintaxe JS não comprova uso real | Exigir E2E com evidência e versões registradas |

## Implantação controlada
```powershell
python -m unittest discover -s tests -v
node --check i18n/runtime.js
python tools/build_i18n.py --input Nemilia-v2_2.html --output dist/Nemilia-v2_2-i18n-pilot.html
```
O arquivo original é preservado. **Não é tradução completa:** diálogos, erros, mensagens, prompts, conteúdos de usuário e agentes continuam inalterados. Antes de lançar, verificar IDs do menu v2.2 e o seletor no Chrome.

## Cenários de laboratório prioritários
1. Chrome Windows 149/154/155+: ferramentas WebMCP de consulta, mutação e sem hints; consentimento uma vez e negação.
2. Execução exatamente uma vez após Allow; mudança de aba, navegação, suspensão, reload e timeouts.
3. Migração 2.2→2.3, senhas, recuperação, backup e exportação cifrada.
4. Capturas de imagem, arquivos locais, concorrência e cancelamento de streams.
5. Idioma persistido após reiniciar, leitura por leitor de tela, preservação de nomes e dados de usuário.
6. Medir desempenho de busca e indexação com bibliotecas grandes (dados sintéticos).

## Referências a estudar (não testadas aqui)
Open WebUI: operação local/provedores; LibreChat: interface multiprovedor; Flowise/Langflow: construção visual de workflows; n8n: automações e logs; Browser Use: interação com navegador. Comparar recursos e licenças antes de absorver código.

## Situação
**Implementado e testável:** infraestrutura de tradução parcial e gerador offline. **Não executado:** E2E Chrome WebMCP, homologação de segurança, tradução integral e integração de serviços. Conclusões devem distinguir evidência local de hipótese.
