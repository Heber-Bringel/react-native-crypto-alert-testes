# Crypto Alert - Suíte de Testes Automatizados 🚀

> Atividade Prática de **Programação Web 2**  
> **Instituto Federal do Piauí (IFPI) - Campus Piripiri**  
> Aplicação base: [React Native Crypto Alert (Rocketseat)](https://github.com/rocketseat-education/react-native-crypto-alert)

---

## 📋 Sumário
- [Sobre o Projeto](#-sobre-o-projeto)
- [Instalação das Dependências](#-instalação-das-dependências)
- [Configuração de Variáveis de Ambiente](#-configuração-de-variáveis-de-ambiente)
- [Comandos para Executar os Testes](#-comandos-para-executar-os-testes)
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

> **Nota:** Durante a execução dos testes automatizados, nenhuma chamada real à API é realizada, respeitando as regras de testes isolados.

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

Resultado obtido via comando `npm run test:coverage -- --runInBand`:

```text
Test Suites: 8 passed, 8 total
Tests:       41 passed, 41 total
Snapshots:   0 total

All files                             |   75.52 |    66.25 |   80.00 |   77.20
 components/AlertCard                 |  100.00 |   100.00 |  100.00 |  100.00
 components/ConditionOptionRow        |  100.00 |   100.00 |  100.00 |  100.00
 components/CryptoCard                |   93.75 |    90.47 |  100.00 |  100.00
 components/PrimaryButton             |  100.00 |    76.92 |  100.00 |  100.00
 context/AlertProvider                |   97.22 |    80.00 |   93.33 |   96.77
 screens/CreateAlertScreen            |   96.96 |    85.00 |  100.00 |  100.00
 screens/CryptoListScreen             |  100.00 |   100.00 |  100.00 |  100.00
 screens/PriceAlertsScreen            |  100.00 |   100.00 |  100.00 |  100.00
 utils/index.ts                       |  100.00 |   100.00 |  100.00 |  100.00
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
