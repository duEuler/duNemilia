# duNemilia — Fase 4: regressão automatizada do laboratório

Data: 2026-11-09. Base: `main` em `2473a33baf3da2d39637ecafb7ac057cb6a8cc63`.

## Escopo e resultados esperados
- Testar o HTML de laboratório sem chamadas externas, usando `node:vm` e `node:test`.
- Validar registro de ferramentas, fallback para `navigator.modelContext`, ambiente sem API, leitura sem mutação, incremento único ao chamar uma vez, rejeição de parâmetros inválidos, atraso, reset e detecção de ferramenta sem hints.
- Executar testes de localização existentes, testes Python e build reversível nos runners Windows e Linux.
- Nenhuma alteração ao aplicativo `Nemilia-v2_2.html`, à extensão original ou ao licenciamento upstream.

## Risco confirmado pelo desenho do teste
O teste de 'execução única' avalia apenas **uma invocação direta** da função da ferramenta. Não comprova que a ponte Nemilia/Chrome assegura exactly-once durante retry, reconexão e concorrência. A política conservadora para ausência de hints é uma asserção do laboratório, **não** uma mudança aplicada na extensão 2.3.

## Execução local Windows
```powershell
python -m unittest discover -s tests -v
node --check i18n/runtime.js
node --test tests/*.test.cjs
python tools/build_i18n.py --input Nemilia-v2_2.html --output dist/Nemilia-v2_2-i18n-pilot.html
```

## Pendências antes de aprovar para produção
1. Chrome com WebMCP e extensão RC 2.3.0; registrar versão, build, solicitação e consentimento.
2. Retry, cancelamento, navegação, restauração de abas e chamada em curso; provar ausência de execução duplicada ou em aba errada.
3. Teste funcional da versão 2.3 com perfis descartáveis: backup, migração, armazenamento e chaves.
4. Inspeção de rede, CSP e proteção contra prompt injection.
5. Cobertura de tradução de mensagens dinâmicas baseada em chaves i18n, sem traduzir conteúdo do usuário.
6. Comparar n8n, Flowise, Langflow, LibreChat e Open WebUI quanto a execução, idempotência, auditoria e licenças. Não há benchmark executado aqui.

## Classificação das evidências
CI automatizado = verificações isoladas de regressão. Teste em Chrome real = **não realizado**. Auditoria de segurança integral = **não realizada**.
