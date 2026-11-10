# Crypto Alert - Suíte de Testes Automatizados 🚀

> Atividade Prática de **Engenharia de Software 3**  
> **Instituto Federal do Piauí (IFPI) - Campus Piripiri**  
> Aplicação base: [React Native Crypto Alert (Rocketseat)](https://github.com/rocketseat-education/react-native-crypto-alert)

---

## 📋 Sumário
- [Sobre o Projeto](#-sobre-o-projeto)
- [Instalação das Dependências](#-instalação-das-dependências)
- [Configuração de Variáveis de Ambiente](#-configuração-de-variáveis-de-ambiente)
- [Testes End-to-End (E2E) com Maestro e IA Generativa](#-testes-end-to-end-e2e-com-maestro-e-ia-generativa)
  - [Entregáveis da Atividade E2E](#entregáveis-da-atividade-e2e)
  - [Como Abrir o Emulador ou Simulador e Instalar a Build Nativa](#1-como-abrir-o-emulador-ou-simulador-e-instalar-a-build-nativa)
  - [Como Instalar e Configurar o Maestro](#2-como-instalar-e-configurar-o-maestro)
  - [Como Executar os Testes E2E](#3-como-executar-os-testes-e2e)
  - [Fluxos E2E Implementados (`.maestro/`)](#4-fluxos-e2e-implementados-maestro)
- [Comandos para Executar os Testes Unitários e de Integração](#-comandos-para-executar-os-testes)
- [Comando para Gerar a Cobertura](#-comando-para-gerar-a-cobertura)
- [Explicação dos Testes Criados](#-explicação-dos-testes-criados)
  - [1. Funções Puras e Formatadores (Item 1)](#1-funções-puras-e-formatadores-item-1)
  - [2. Componentes Visuais (Item 2)](#2-componentes-visuais-item-2)
  - [3. Hook Customizado com Efeitos Assíncronos (Item 3)](#3-hook-customizado-com-efeitos-assíncronos-item-3)
  - [4. Fluxo Completo de Integração (Item 4)](#4-fluxo-completo-de-integração-item-4)
  - [5. Estratégia de Mocks de Limites Externos (Item 5)](#5-estratégia-de-mocks-de-limites-externos-item-5)
- [Resumo do Relatório de Cobertura (Item 6)](#-resumo-do-relatório-de-cobertura-item-6)
- [Boas Práticas e Regras Atendidas](#-boas-práticas-e-regras-atendidas)

---

## 📌 Sobre o Projeto

O **Crypto Alert** é um aplicativo mobile desenvolvido com **React Native**, **Expo** e **TypeScript** para monitoramento de cotações de criptomoedas e gerenciamento de alertas de preço.

O objetivo desta atividade é implementar uma **suíte robusta de testes automatizados** com **Jest** e **React Native Testing Library (RNTL)**, validando o funcionamento isolado (unidade) e integrado de componentes, hooks, regras de negócio e fluxos de usuário.

---

## 📦 Instalação das Dependências

Para instalar todas as dependências necessárias do projeto e do ambiente de testes:

```bash
npm install
```

Caso queira uma instalação reprodutível a partir do lockfile:

```bash
npm ci
```

---

## ⚙️ Configuração de Variáveis de Ambiente

O aplicativo consome a API pública da CoinGecko. Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

No arquivo `.env`, preencha sua chave de API (obtida em [CoinGecko](https://www.coingecko.com/)):

```env
EXPO_PUBLIC_COINGECKO_API_KEY=sua_chave_aqui
```

> **Nota:** Durante a execução dos testes automatizados unitários/integração, nenhuma chamada real à API é realizada, respeitando as regras de testes isolados.

---

## 📱 Testes End-to-End (E2E) com Maestro e IA Generativa

Além dos testes unitários e de integração com Jest/RNTL, o projeto conta com uma suíte completa de **testes End-to-End (E2E)** utilizando o **Maestro**, elaborada com apoio de Inteligência Artificial Generativa e validada criticamente com base no artigo [*GenIA-E2ETest: A Generative AI-Based Approach for End-to-End Test Automation*](https://arxiv.org/abs/2510.01024).

### Entregáveis da Atividade E2E
- 📄 **[`reflexao.md`](reflexao.md)**: Respostas às questões conceituais e técnicas sobre o artigo *GenIA-E2ETest*, limitações de LLMs em testes E2E e validação prática com Maestro.
- 🤖 **[`ia/planejamento.md`](ia/planejamento.md)**: Registro do prompt utilizado, resposta original da IA, cenários selecionados e análise crítica detalhada (o que foi aproveitado, corrigido e descartado após inspeção da interface real).
- 📂 **[`.maestro/`](.maestro/)**: Pasta na raiz contendo a configuração e os 4 fluxos E2E executáveis no Maestro.

---

### 1. Como Abrir o Emulador ou Simulador e Instalar a Build Nativa

> **Importante:** O aplicativo (`appId: com.cryptoalert`) deve estar compilado e instalado no emulador Android ou simulador iOS antes da execução dos testes E2E com o Maestro.

#### Opção A: Emulador Android (Windows / Linux / macOS)
1. Abra o **Android Studio** -> **Virtual Device Manager** e inicie um emulador (ou execute via terminal):
   ```bash
   emulator -avd <NOME_DO_SEU_AVD>
   ```
2. Verifique se o dispositivo está conectado via ADB:
   ```bash
   adb devices
   ```
3. Gere a pasta nativa e instale o aplicativo no emulador Android:
   ```bash
   npx expo run:android
   ```

#### Opção B: Simulador iOS (macOS)
1. Abra o simulador iOS pelo Xcode:
   ```bash
   open -a Simulator
   ```
2. Compile e instale a versão nativa no simulador:
   ```bash
   npx expo run:ios
   ```

---

### 2. Como Instalar e Configurar o Maestro

1. Certifique-se de possuir o **Java (JDK 17 ou superior)** instalado:
   ```bash
   java -version
   ```
2. Instale o **Maestro CLI**:
   - **macOS / Linux / WSL:**
     ```bash
     curl -Ls "https://get.maestro.mobile.dev" | bash
     ```
   - **Windows (via PowerShell / instalador oficial ou WSL2):**
     Baixe a release do Maestro ou execute via WSL conectado ao ADB do host, garantindo que o binário `maestro` esteja no `PATH`.
3. Confirme a instalação:
   ```bash
   maestro --version
   ```

---

### 3. Como Executar os Testes E2E

Com o emulador/simulador aberto e o aplicativo **Crypto Alert** instalado (`com.cryptoalert`):

- **Executar todos os 4 fluxos E2E em sequência:**
  ```bash
  maestro test .maestro/
  ```

- **Executar um fluxo específico:**
  ```bash
  maestro test .maestro/01-list-and-navigation.yaml
  maestro test .maestro/02-convert-crypto.yaml
  maestro test .maestro/03-create-price-alert.yaml
  maestro test .maestro/04-delete-price-alert.yaml
  ```

- **Gravar vídeo curto da execução de um fluxo (evidência em vídeo):**
  ```bash
  maestro record .maestro/02-convert-crypto.yaml docs/e2e-convert-crypto.mp4
  maestro record .maestro/03-create-price-alert.yaml docs/e2e-create-alert.mp4
  ```
  *(Nota: Os próprios arquivos `.yaml` já incluem o comando `takeScreenshot` nos pontos-chave para gerar automaticamente as capturas de tela `01-crypto-list.png`, `02-convert-crypto-brl.png`, `03-created-alert.png`, `03-list-alert-badge-expanded.png` e `04-deleted-alert-empty-state.png`).*

---

### 4. Fluxos E2E Implementados (`.maestro/`)

| Arquivo | Nome do Fluxo | O que é validado na interface real |
| :--- | :--- | :--- |
| [`.maestro/01-list-and-navigation.yaml`](.maestro/01-list-and-navigation.yaml) | **01 - Listagem e Navegação entre Abas** | Inicialização limpa (`clearState: true`), carregamento da tela `"Cryptocurrencies"` com `"Bitcoin"` (`"BTC"`) e `"Ethereum"` (`"ETH"`), e navegação pelas abas `"Convert"`, `"Alerts"` (`"No alerts yet"`) e `"List"`. |
| [`.maestro/02-convert-crypto.yaml`](.maestro/02-convert-crypto.yaml) | **02 - Conversão Reativa de Criptomoedas** | Estado inicial (`"Enter an amount"`), validação de valor inválido (`"0"` -> `"Invalid amount"`), conversão reativa em dólar (`USD ($)`), abertura dos modais do componente `SelectField` para selecionar `"Ethereum"` e `"BRL"` e validação do valor formatado em Reais (`R$`). |
| [`.maestro/03-create-price-alert.yaml`](.maestro/03-create-price-alert.yaml) | **03 - Criação de Alerta e Badge na Lista** | Navegação até `"Create Alert"` (testando o retorno `"Go back"` e abertura via `"New Alert"`), seleção de `"Bitcoin"` no modal `"Select cryptocurrency"`, digitação do preço-alvo `"75000"`, escolha da condição `"Below target price"`, salvamento em `"Save Alert"`, validação na tela `"Price Alerts"` (`"$75,000.00"`) e expansão da badge `"1 alert"` no card do Bitcoin na aba `"List"`. |
| [`.maestro/04-delete-price-alert.yaml`](.maestro/04-delete-price-alert.yaml) | **04 - Exclusão de Alerta de Preço** | Criação de alerta para `"Ethereum"` (`"Above target price"`, `"$4,500.00"`), verificação na listagem `"Price Alerts"`, exclusão pelo botão de lixeira (`accessibilityLabel="Delete alert"`) e confirmação do retorno ao estado vazio `"No alerts yet"`. |

---

## 🧪 Comandos para Executar os Testes

Execute todos os testes da suíte com:

```bash
npm test
```

Para rodar os testes em modo interativo de monitoramento contínuo:

```bash
npm run test:watch
```

Para executar um arquivo de teste específico:

```bash
npm test -- src/utils/__tests__/index.test.ts
```

---

## 📊 Comando para Gerar a Cobertura

Para rodar todos os testes e gerar o relatório completo de cobertura de código:

```bash
npm run test:coverage
```

O relatório em formato HTML detalhado é gerado no diretório `coverage/lcov-report/index.html`.

---

## 🔍 Explicação dos Testes Criados

A suíte conta com **41 testes automatizados** distribuídos em **8 arquivos** organizados de forma modular e progressiva:

### 1. Funções Puras e Formatadores (Item 1)
- **Arquivo**: `src/utils/__tests__/index.test.ts`
- **Alvo**: Funções `formatPrice(price, decimals)` e `formatChange(change)` em `src/utils/index.ts`.
- **Cenários Cobertos**:
  - `formatPrice`:
    - Formatação de valores numéricos com separador de milhar americano (`en-US`) e 2 casas decimais padrão.
    - Formatação a partir de números inteiros (`1000` -> `"1,000.00"`).
    - Precisão customizada de casas decimais para altcoins (`0.00004512, 6` -> `"0.000045"`).
    - Valor zero (`0` -> `"0.00"`).
    - Valores negativos (`-1250.75` -> `"-1,250.75"`).
    - Casos limite de arredondamento matemático.
    - Entradas inválidas (`NaN`, `Infinity`, `-Infinity`, `null` e `undefined`) retornando `"0.00"` sem quebrar a renderização.
  - `formatChange`:
    - Variação positiva com adição obrigatória do sinal `+` e sufixo `%` (`+2.45%`).
    - Variação negativa com preservação do sinal `-` (`-1.23%`).
    - Variação nula com formato padronizado (`+0.00%`).
    - Arredondamento com duas casas decimais.
    - Entradas inválidas (`NaN`, `Infinity`, `-Infinity`, `null` e `undefined`) retornando `"+0.00%"`.
- **Regras de validação do formulário**: `src/screens/CreateAlertScreen/__tests__/useCreateAlertScreen.test.tsx`
  - Formulário vazio deve apresentar os erros `"Please select a cryptocurrency"` e `"Please enter a target price"`.
  - Preço não numérico, zero ou negativo deve apresentar `"Please enter a valid price"`.
  - Formulário válido deve salvar o alerta e redirecionar para `/alerts`.

### 2. Componentes Visuais (Item 2)
- **Componente 1: `PrimaryButton`** (`src/components/PrimaryButton/__tests__/PrimaryButton.test.tsx`)
  - Valida renderização correta do texto da propriedade `label`.
  - Garante acessibilidade semântica via `getByRole("button", { name: "..." })`.
  - Simula interação da pessoa usuária (`fireEvent.press`) e verifica disparo da prop `onPress`.
  - Garante que quando `disabled={true}`, o botão reflete o estado no `accessibilityState` e não dispara `onPress`.
  - Verifica renderização de ícones complementares via `leftIcon`.
- **Componente 2: `CryptoCard`** (`src/components/CryptoCard/__tests__/CryptoCard.test.tsx`)
  - Renderiza nome, símbolo, preço formatado com `$`, variação percentual positiva e negativa.
  - Testa renderização fallback da inicial do símbolo quando a moeda não possui URL de imagem.
  - Valida que o botão de badge de alertas NÃO é renderizado quando não existem alertas cadastrados.
  - Valida pluralização da badge ("1 alert" vs "2 alerts") via `getByRole("button")`.
  - Testa interação de expansão e recolhimento da lista detalhada de alertas cadastrados (preço alvo e condição "Above/Below") usando `waitFor`.
  - Utiliza o `AlertProvider` real, semeando apenas o `AsyncStorage` mockado como fronteira externa.
- **Telas com estados visuais**:
  - `CryptoListScreen` (`src/screens/CryptoListScreen/__tests__/CryptoListScreen.test.tsx`): loading, sucesso com preços formatados, vazio e erro com retry.
  - `PriceAlertsScreen` (`src/screens/PriceAlertsScreen/__tests__/PriceAlertsScreen.test.tsx`): estado vazio, navegação para criação, listagem de alerta salvo e remoção.

### 3. Hook Customizado com Efeitos Assíncronos (Item 3)
- **Arquivo**: `src/screens/CryptoListScreen/__tests__/useCryptoListScreen.test.ts`
- **Alvo**: Hook `useCryptoListScreen` em `src/screens/CryptoListScreen/useCryptoListScreen.ts`.
- **Cenários Cobertos**:
  - Estado inicial assertado antes da resolução da promise: `loadingState: "loading"` e lista de fallback estática.
  - Resolução assíncrona com sucesso da API CoinGecko: transição para `loadingState: "idle"` e preenchimento reativo do array de criptomoedas.
  - Resposta de array vazio da API: transição correta para `loadingState: "empty"`.
  - Tratamento de falhas de rede / erro da API: transição para `loadingState: "error"` e ativação segura da lista estática de fallback.
  - Função de recuperação `handleRetry`: simulação de nova tentativa da pessoa usuária que recupera o estado da aplicação.

### 4. Fluxo Completo de Integração (Item 4)
- **Arquivo**: `src/screens/CreateAlertScreen/__tests__/CreateAlertScreen.integration.test.tsx`
- **Alvo**: Tela real `CreateAlertScreen` integrada com o `AlertProvider`, `SelectField`, `ConditionOptionRow`, `PrimaryButton`, `ScreenHeader` e, ao final, `PriceAlertsScreen` com `AlertCard`.
- **Jornada do Usuário Testada**:
  1. Renderização inicial com campos vazios e validação de que o botão "Save Alert" inicia desabilitado.
  2. O usuário clica no seletor semântico "Select cryptocurrency", abrindo o modal com a lista de moedas.
  3. O usuário seleciona "Bitcoin", o modal fecha e o campo exibe "Bitcoin (BTC)".
  4. O usuário digita o preço-alvo ("75000") no campo de texto de moeda.
  5. O usuário seleciona a condição de disparo "Below target price".
  6. O formulário valida as entradas reativamente e habilita o botão "Save Alert".
  7. O usuário clica em "Save Alert": o alerta é registrado no contexto, gravado no armazenamento local (`AsyncStorage`) e o app redireciona para `/alerts`.
  8. A tela `PriceAlertsScreen` é renderizada com o mesmo `AlertProvider`: o alerta salvo aparece visivelmente com "Bitcoin", condição "below" e preço alvo "$75,000.00".
  9. O usuário clica no botão semântico de voltar ("Go back") no cabeçalho e o app invoca `router.back()`.

### 5. Estratégia de Mocks de Limites Externos (Item 5)
Conforme as regras da atividade, os mocks foram aplicados estritamente nas fronteiras externas do sistema:
- **Rede / API (`fetchCryptocurrenciesFromApi`)**: mock de chamadas HTTP para isolar testes de oscilações da CoinGecko.
- **Armazenamento (`AsyncStorage`)**: mock em memória através de `@react-native-async-storage/async-storage/jest/async-storage-mock`.
- **Navegação (`expo-router`)**: mock das funções `router.push`, `router.replace` e `router.back`.
- **Biblioteca nativa (`expo-image`)**: substituída por uma `View` no ambiente de teste.
- Todos os componentes, hooks de negócio e regras de contexto permanecem reais. O `AlertProvider` real é usado nos testes de `CryptoCard`, `CryptoListScreen`, `PriceAlertsScreen` e no fluxo de integração; o `AsyncStorage` é apenas semeado como fronteira externa.

---

## 📈 Resumo do Relatório de Cobertura (Item 6)

Resultado completo obtido via comando `npm run test:coverage -- --runInBand` (inclui todos os arquivos, inclusive os que ainda não possuem testes):

```text
Test Suites: 8 passed, 8 total
Tests:       41 passed, 41 total
Snapshots:   0 total

-------------------------------|---------|----------|---------|---------|-------------------
File                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------------------|---------|----------|---------|---------|-------------------
All files                      |   75.52 |    66.25 |      80 |    77.2 |                   
 components/AlertCard          |     100 |      100 |     100 |     100 |                   
  AlertCard.tsx                |     100 |      100 |     100 |     100 |                   
  useAlertCard.ts              |     100 |      100 |     100 |     100 |                   
 components/ConditionOptionRow |     100 |      100 |     100 |     100 |                   
  ConditionOptionRow.tsx       |     100 |      100 |     100 |     100 |                   
  useConditionOptionRow.ts     |     100 |      100 |     100 |     100 |                   
 components/CryptoCard         |   93.75 |    90.47 |     100 |     100 |                   
  CryptoCard.tsx               |     100 |      100 |     100 |     100 |                   
  useCryptoCard.ts             |    92.3 |       50 |     100 |     100 | 12-21             
 components/EmptyState         |     100 |       75 |     100 |     100 |                   
  EmptyState.tsx               |     100 |       75 |     100 |     100 | 26                
  useEmptyState.ts             |     100 |      100 |     100 |     100 |                   
 components/ErrorState         |     100 |       25 |     100 |     100 |                   
  ErrorState.tsx               |     100 |       25 |     100 |     100 | 14-27             
  useErrorState.ts             |     100 |      100 |     100 |     100 |                   
 components/LoadingState       |     100 |       50 |     100 |     100 |                   
  LoadingState.tsx             |     100 |      100 |     100 |     100 |                   
  useLoadingState.ts           |     100 |       50 |     100 |     100 | 6                 
 components/PrimaryButton      |     100 |    76.92 |     100 |     100 |                   
  PrimaryButton.tsx            |     100 |    81.81 |     100 |     100 | 33                
  usePrimaryButton.ts          |     100 |       50 |     100 |     100 | 10                
 components/ScreenContainer    |       0 |      100 |       0 |       0 |                   
  ScreenContainer.tsx          |       0 |      100 |       0 |       0 | 11                
 components/ScreenHeader       |     100 |       50 |     100 |     100 |                   
  ScreenHeader.tsx             |     100 |       50 |     100 |     100 | 17                
  useScreenHeader.ts           |     100 |      100 |     100 |     100 |                   
 components/SelectField        |   94.44 |    69.23 |      90 |     100 |                   
  SelectField.tsx              |     100 |    66.66 |     100 |     100 | 24,78-84          
  useSelectField.ts            |    92.3 |       75 |   83.33 |     100 | 27                
 constants                     |       0 |        0 |     100 |       0 |                   
  theme.ts                     |       0 |        0 |     100 |       0 | 9-60              
 context/AlertProvider         |   97.22 |       80 |   93.33 |   96.77 |                   
  AlertProvider.tsx            |     100 |      100 |     100 |     100 |                   
  useAlertProvider.ts          |   97.05 |       80 |   92.85 |   96.55 | 84                
 data                          |      20 |        0 |       0 |   21.42 |                   
  cryptoData.ts                |      20 |        0 |       0 |   21.42 | 88-132            
 screens/ConversionScreen      |       0 |        0 |       0 |       0 |                   
  ConversionScreen.tsx         |       0 |        0 |       0 |       0 | 21-23             
  useConversionScreen.ts       |       0 |        0 |       0 |       0 | 11-76             
 screens/CreateAlertScreen     |   96.96 |       85 |     100 |     100 |                   
  CreateAlertScreen.tsx        |     100 |       50 |     100 |     100 | 42-62             
  useCreateAlertScreen.ts      |   96.77 |    93.75 |     100 |     100 | 37                
 screens/CryptoListScreen      |     100 |      100 |     100 |     100 |                   
  CryptoListScreen.tsx         |     100 |      100 |     100 |     100 |                   
  useCryptoListScreen.ts       |     100 |      100 |     100 |     100 |                   
 screens/PriceAlertsScreen     |     100 |      100 |     100 |     100 |                   
  PriceAlertsScreen.tsx        |     100 |      100 |     100 |     100 |                   
  usePriceAlertsScreen.ts      |     100 |      100 |     100 |     100 |                   
 theme                         |     100 |      100 |     100 |     100 |                   
  colors.ts                    |     100 |      100 |     100 |     100 |                   
 utils                         |     100 |      100 |     100 |     100 |                   
  index.ts                     |     100 |      100 |     100 |     100 |                   
-------------------------------|---------|----------|---------|---------|-------------------
```

O arquivo completo com o resumo da execução está em [`docs/coverage-summary.txt`](docs/coverage-summary.txt). O relatório HTML detalhado é gerado em `coverage/lcov-report/index.html` após rodar o comando.

> **Destaques de Cobertura nos Itens Testados:**
> - `utils/index.ts`: **100%** de statements, branches, funções e linhas, incluindo entradas inválidas.
> - `useCryptoListScreen.ts` e `useCreateAlertScreen.ts`: **100% de linhas**.
> - `CryptoListScreen`, `PriceAlertsScreen` e `AlertCard`: **100% de linhas**.
> - `CreateAlertScreen` e `AlertProvider`: **acima de 96% de linhas**.
> - O fluxo de integração valida o alerta na tela final, não apenas o redirecionamento e o armazenamento.

---

## ✅ Boas Práticas e Regras Atendidas

- [x] **Nomes descritivos e finalidade clara** em cada bloco `describe` e `it`.
- [x] **Consultas semânticas da React Native Testing Library prioritárias** (`getByRole`, `getByLabelText`, `getByText`, `getByPlaceholderText`) antes de qualquer `testID`.
- [x] **Sem uso de `setTimeout`**: sincronização assíncrona realizada exclusivamente com `waitFor` e `act`.
- [x] **Sem chamadas reais a APIs ou disco**: isolamento garantido por mocks nas fronteiras de rede e storage.
- [x] **Histórico de Commits Progressivos**: alterações divididas e versionadas logicamente:
  1. `chore: configure testing environment with jest and react-native-testing-library`
  2. `build: install @testing-library/react-native and configure jest aliases`
  3. `test(utils): add unit tests for formatPrice and formatChange functions`
  4. `test(components): add visual component tests for PrimaryButton and CryptoCard`
  5. `test(hooks): add unit and async tests for useCryptoListScreen hook`
  6. `test(integration): add full user flow test for CreateAlertScreen`
  7. `docs: update README with test suite documentation and coverage report`
  8. `fix(utils): handle invalid inputs in price and change formatters`
  9. `test(hooks): assert initial loading and validate alert form rules`
  10. `test(components): use real alert provider and cover screen states`
  11. `test(integration): validate saved alert in PriceAlertsScreen`
  12. `docs: update coverage report and test documentation`
  13. `docs: adiciona reflexao sobre o artigo GenIA-E2ETest (Parte 1)`
  14. `chore: configura identificadores nativos e estrutura inicial do Maestro (Parte 2)`
  15. `docs(ia): adiciona planejamento de testes E2E e analise critica (Parte 3)`
  16. `test(e2e): implementa fluxos Maestro de listagem, navegacao e conversao de criptomoedas`
  17. `test(e2e): implementa fluxos Maestro de criacao e exclusao de alertas de preco`
  18. `docs: atualiza README com instrucoes de emulador, build nativa e execucao do Maestro`
