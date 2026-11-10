# Reflexão sobre o Artigo: GenIA-E2ETest e Automação de Testes E2E com IA Generativa

> **Artigo base:** *GenIA-E2ETest: A Generative AI-Based Approach for End-to-End Test Automation*  
> **Autores:** Elvis Júnior (UFF), Alan Valejo (UFSCar), Jorge Valverde-Rebaza (Tecnologico de Monterrey) e Vânia de Oliveira Neves (UFF) — *SBES '25*  
> **Link:** [https://arxiv.org/abs/2510.01024](https://arxiv.org/abs/2510.01024)

---

## 1. Qual problema a abordagem GenIA-E2ETest procura resolver?

Os testes End-to-End (E2E) são fundamentais para validar fluxos completos sob a perspectiva real da pessoa usuária, integrando interface gráfica, regras de negócio e serviços externos. Contudo, na prática da engenharia de software, existe um grande gargalo:
- Executar esses testes **manualmente** é repetitivo, lento, custoso e sujeito a falhas humanas, especialmente em ciclos de regressão;
- **Automatizar** cenários escritos em linguagem natural (como histórias de usuário, casos de teste manuais ou cenários BDD) exige alto esforço técnico para inspecionar a árvore de interface (DOM/componentes), mapear seletores (XPaths, IDs, atributos) e manter scripts em frameworks como Robot Framework, Selenium, Playwright ou Maestro;
- As pesquisas recentes com Grandes Modelos de Linguagem (LLMs) concentraram-se majoritariamente na geração de **testes unitários**, enquanto ferramentas comerciais de E2E com IA (como *Testim*, *Functionize* e *testRigor*) costumam ser proprietárias, caras, restritas ao idioma inglês ou focadas apenas em *record-and-playback*.

A abordagem **GenIA-E2ETest** procura resolver justamente essa lacuna entre a **especificação funcional em linguagem natural** e a **implementação de scripts E2E executáveis**, propondo uma solução aberta (*open-source*), modular e independente de framework capaz de traduzir cenários textuais livres (ou em Gherkin/BDD) diretamente em scripts automatizados de ponta a ponta, reduzindo o esforço manual e democratizando o acesso à automação de testes.

---

## 2. Como a IA generativa pode ajudar na criação de testes E2E?

A IA generativa atua como um acelerador cognitivo e operacional ao longo de todo o ciclo de concepção e codificação dos testes E2E. No artigo, isso é demonstrado por meio de uma arquitetura em **três níveis de prompts encadeados (*Multi-Level Prompting* inspirado em *AI Chains*)**, mas seus benefícios estendem-se também ao fluxo prático de engenharia de testes:

1. **Levantamento e estruturação de cenários (Modularização — Nível 1):** A IA consegue interpretar descrições em linguagem natural livre ou semiestruturada e decompô-las em módulos lógicos por tela/página, extraindo uma sequência cronológica de ações do usuário (clicar, preencher, navegar) e resultados esperados (asserções). No estudo, o modelo alcançou **104% de completude média de passos** justamente por decompor instruções compostas (ex.: separar "inserir e-mail e senha" em duas interações atômicas) e adicionar verificações intermediárias úteis.
2. **Mapeamento e refinamento semântico de elementos de interface (Nível 2):** Combinada à inspeção da interface, a IA ajuda a associar cada passo do fluxo ao componente visual correspondente, filtrando seletores duplicados ou irrelevantes em uma etapa de refinamento antes de gerar o código.
3. **Geração de rascunhos de scripts executáveis (Nível 3):** A IA traduz a especificação estruturada para a sintaxe exata da ferramenta de automação alvo (como Robot Framework + Selenium no artigo, ou fluxos YAML do Maestro em aplicações mobile), poupando o trabalho braçal de escrever código repetitivo (*boilerplate*) do zero.

---

## 3. Quais limitações ou riscos existem ao usar testes gerados por IA?

O estudo empírico do GenIA-E2ETest (avaliado em 12 casos de teste e 36 execuções) evidencia limitações técnicas e riscos importantes ao depender de testes gerados por IA:

- **Perda de contexto em fluxos dependentes de estado (*Context-Dependent Navigation*):** Foi o principal ponto crítico identificado no artigo (especialmente no caso *WebApp1-TC5*, onde a precisão de identificação caiu para **12%** e a execução para **24%**). Quando uma tela exige ações prévias para ser acessada (como preencher nome e e-mail na página anterior antes de carregar o formulário de cadastro), a IA — sem manter o estado da sessão — analisa a página redirecionada incorreta e acaba inferindo ou "alucinando" elementos inexistentes.
- **Elementos injetados dinamicamente:** Mensagens de erro de validação, *modals*, *toasts* ou listas carregadas de forma assíncrona após interações do usuário muitas vezes não estão presentes na captura estática inicial da tela, gerando lacunas nos passos gerados pela IA.
- **Ambiguidade semântica entre descrição e implementação real:** Termos em linguagem natural como *"clicar no botão Login"* ou *"selecionar moeda"* podem induzir a IA a buscar uma tag `<button>` ou um componente nativo de *picker*, quando na implementação real o elemento é uma tag `<a>` estilizada ou um `Pressable` que abre um `Modal` customizado.
- **Fragilidade de seletores dinâmicos:** Em frameworks modernos (React, React Native, Angular), IDs gerados automaticamente ou árvores de elementos profundas tornam XPaths ou seletores estruturais frágeis entre execuções.
- **Interferência de elementos externos e sincronização:** Pop-ups, animações, teclados virtuais sobrepondo botões ou falta de comandos de espera (*waits* / sincronização) podem interceptar cliques e quebrar o fluxo em tempo de execução.

---

## 4. Por que um teste gerado por IA ainda precisa de revisão humana?

Mesmo em cenários bem estruturados e com temperatura igual a zero (`temperature = 0`), um teste gerado por IA **não é garantia de validação correta sem supervisão humana**, pelos seguintes motivos:

1. **Ajustes técnicos para executabilidade:** No experimento do artigo, os scripts gerados exigiram uma **taxa média de modificação manual de 10%** (mediana de 6%, chegando a 49% no caso mais complexo) para corrigir localizadores incorretos, ajustar nomes de comandos (como substituir um comando inexistente `LAUNCH BROWSER` por `OPEN BROWSER`) e inserir comandos de sincronização.
2. **Alucinação de seletores e textos da UI:** Quando a IA gera fluxos apenas a partir de uma descrição funcional do produto, ela frequentemente inventa `testID`s, assume que a interface está em português quando os rótulos reais estão em inglês (ou vice-versa), ou pressupõe botões de confirmação que não existem (por exemplo, imaginar um botão *"Converter"* em uma tela cujo cálculo ocorre de forma reativa ao digitar).
3. **Validação do oráculo de teste (intenção de negócio):** Um script pode executar sem erros sintáticos, mas validar a coisa errada ou omitir a asserção principal do negócio. Cabe à pessoa testadora revisar se o teste realmente comprova o comportamento esperado no aplicativo real e não apenas executa cliques cegos.

---

## 5. Como o Maestro pode ser usado para validar, na prática, um fluxo sugerido por uma IA?

No desenvolvimento mobile com **React Native**, o **Maestro** funciona como a ponte prática ideal para colocar à prova, depurar e consolidar os fluxos sugeridos pela IA generativa:

1. **Sintaxe declarativa próxima da linguagem natural (YAML):** Como o Maestro utiliza comandos legíveis (`launchApp`, `tapOn`, `inputText`, `assertVisible`, `scrollUntilVisible`), é muito simples confrontar o rascunho gerado pela IA com o comportamento real de cada tela do aplicativo.
2. **Inspeção real da árvore de elementos (`maestro studio` / `maestro hierarchy`):** Antes ou durante a validação do rascunho da IA, o desenvolvedor pode inspecionar a hierarquia real renderizada no emulador Android ou simulador iOS, verificando os textos exatos, `accessibilityLabel` e `testID`s disponíveis nos componentes React Native (como `SelectField`, `ConditionOptionRow`, `AlertCard` e `CryptoCard`).
3. **Feedback imediato em execução real no dispositivo (`maestro test`):** Ao executar o fluxo YAML diretamente contra a build nativa instalada no emulador/simulador, o Maestro revela imediatamente onde a sugestão da IA falha na prática — seja por um seletor inexistente, um modal que precisa ser aberto antes da seleção, um teclado numérico que precisa ser fechado ou uma transição assíncrona — permitindo que o testador refine iterativamente o script até obter uma suíte E2E determinística e confiável.
