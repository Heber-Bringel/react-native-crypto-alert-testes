# Planejamento de Testes E2E com Apoio de IA Generativa

Este documento registra o processo de utilização de Inteligência Artificial Generativa como ferramenta de apoio para levantar cenários de teste End-to-End (E2E), elaborar rascunhos iniciais para o **Maestro** e realizar a revisão crítica humana frente à implementação real do aplicativo **React Native Crypto Alert**.

---

## 1. Prompt Utilizado

Seguindo as recomendações de engenharia de prompt discutidas no artigo *GenIA-E2ETest* (definição de persona, contexto funcional do sistema e formato de saída esperado), foi utilizado o seguinte prompt inicial:

```text
Atue como um Engenheiro de Automação de Testes Mobile Sênior especialista em React Native, Expo e Maestro.

Estou testando o aplicativo mobile "Crypto Alert" (React Native + Expo Router).
O aplicativo possui três abas principais na barra de navegação inferior:
1. Aba de listagem de criptomoedas: exibe cotações de criptomoedas (como Bitcoin, Ethereum, Cardano, Solana), preço atual em dólar, variação percentual em 24h e indicadores de alertas cadastrados.
2. Aba de conversão de criptomoedas: permite informar uma quantidade, escolher a criptomoeda de origem e a moeda fiduciária de destino (USD, BRL, EUR, GBP, JPY) para visualizar o valor convertido.
3. Aba de alertas de preço: lista os alertas configurados pelo usuário, permite criar novos alertas escolhendo a criptomoeda, o preço-alvo em USD e a condição (acima ou abaixo do preço-alvo), além de permitir excluir alertas existentes.

Com base nessa descrição funcional:
1. Proponha 6 cenários de testes E2E cobrindo os fluxos principais e casos de borda do aplicativo.
2. Elabore rascunhos de scripts YAML para o Maestro correspondentes aos principais fluxos propostos.
```

---

## 2. Resposta Original da IA

Abaixo está a resposta bruta gerada pela IA a partir da descrição funcional (antes da inspeção detalhada dos componentes do código-fonte):

> ### Cenários de Teste E2E Sugeridos pela IA
>
> **Cenário 1: Listagem e Busca de Criptomoedas na Tela Inicial**
> - **Objetivo:** Verificar se a lista de criptomoedas carrega corretamente e se o usuário consegue filtrar uma moeda pelo nome na barra de busca.
> - **Passos:** Abrir o app -> Verificar título "Cryptocurrencies" -> Digitar "Bitcoin" no campo "Search cryptocurrency" -> Validar que apenas "Bitcoin (BTC)" aparece na lista.
>
> **Cenário 2: Conversão de Criptomoeda para Moeda Fiduciária (BRL)**
> - **Objetivo:** Validar o cálculo de conversão entre uma criptomoeda e o Real Brasileiro.
> - **Passos:** Navegar para a aba "Convert" -> Digitar "2" no campo de quantidade -> Selecionar "Ethereum" no seletor de criptomoeda -> Selecionar "BRL" no seletor de moeda fiduciária -> Clicar no botão "Convert" -> Validar o resultado exibido.
>
> **Cenário 3: Criação de Alerta de Preço com Sucesso**
> - **Objetivo:** Garantir que o usuário consiga cadastrar um novo alerta de preço para uma criptomoeda.
> - **Passos:** Ir para a aba "Alerts" -> Clicar em "New Alert" -> Selecionar "Bitcoin" -> Digitar "75000" no preço-alvo -> Selecionar a condição "Above" -> Clicar em "Save Alert" -> Verificar se o alerta para "Bitcoin" aparece na lista de alertas.
>
> **Cenário 4: Validação de Campos Obrigatórios ao Criar Alerta Vazio**
> - **Objetivo:** Verificar se o formulário impede o cadastro sem preencher criptomoeda e preço-alvo, exibindo mensagens de erro ao clicar em salvar.
> - **Passos:** Ir para "Alerts" -> Clicar em "New Alert" -> Clicar diretamente no botão "Save Alert" sem preencher os campos -> Verificar se as mensagens "Please select a cryptocurrency" e "Please enter a target price" aparecem na tela.
>
> **Cenário 5: Exclusão de um Alerta de Preço Existente**
> - **Objetivo:** Validar que o usuário pode remover um alerta previamente cadastrado.
> - **Passos:** Na aba "Alerts" com um alerta salvo -> Clicar no botão "Delete" do alerta -> Confirmar a exclusão clicando em "Confirm" no modal -> Verificar que a mensagem "No alerts yet" é exibida.
>
> **Cenário 6: Recebimento de Notificação Push quando o Preço Atinge o Alvo**
> - **Objetivo:** Validar se o sistema dispara uma notificação nativa no dispositivo quando a cotação da API cruza o valor configurado no alerta.
> - **Passos:** Criar alerta para Bitcoin -> Minimizar aplicativo -> Simular variação de preço -> Verificar notificação na bandeja do sistema operacional.
>
> ### Rascunhos YAML Gerados Originalmente pela IA
>
> ```yaml
> # Rascunho IA 1 - Busca e Listagem
> appId: com.cryptoalert
> ---
> - launchApp
> - assertVisible: "Cryptocurrencies"
> - tapOn: "Search cryptocurrency"
> - inputText: "Bitcoin"
> - assertVisible: "Bitcoin"
> - assertNotVisible: "Ethereum"
> ```
>
> ```yaml
> # Rascunho IA 2 - Conversão
> appId: com.cryptoalert
> ---
> - launchApp
> - tapOn: "Convert"
> - tapOn:
>     id: "amount-input"
> - inputText: "1"
> - tapOn: "Select cryptocurrency"
> - tapOn: "Ethereum"
> - tapOn: "Select fiat currency"
> - tapOn: "BRL"
> - tapOn: "Convert"
> - assertVisible: "R$"
> ```
>
> ```yaml
> # Rascunho IA 3 - Criação e Exclusão de Alerta
> appId: com.cryptoalert
> ---
> - launchApp
> - tapOn: "Alerts"
> - tapOn: "New Alert"
> - tapOn: "Select cryptocurrency"
> - tapOn: "Bitcoin"
> - tapOn:
>     id: "price-input"
> - inputText: "75000"
> - tapOn: "Above"
> - tapOn: "Save Alert"
> - assertVisible: "Bitcoin"
> - tapOn: "Delete"
> - tapOn: "Confirm"
> - assertVisible: "No alerts yet"
> ```

---

## 3. Cenários Selecionados (Após Revisão e Validação no App)

Após confrontar as sugestões da IA com o código-fonte e a interface real do aplicativo (`CryptoListScreen`, `ConversionScreen`, `PriceAlertsScreen`, `CreateAlertScreen`, `SelectField`, `AlertCard` e `CryptoCard`), foram selecionados e refinados **quatro fluxos E2E completos**:

1. **Fluxo 1 (`01-list-and-navigation.yaml`) — Visualização da Lista de Criptomoedas e Navegação entre Abas:**
   - Valida a inicialização limpa do app (`clearState: true`), a exibição do título `"Cryptocurrencies"`, a presença das criptomoedas na listagem (`"Bitcoin"`, `"BTC"`, `"Ethereum"`, `"ETH"`), a rolagem vertical da lista e a navegação completa pelas abas `"Convert"`, `"Alerts"` (verificando o estado vazio `"No alerts yet"`) e retorno para `"List"`.
2. **Fluxo 2 (`02-convert-crypto.yaml`) — Conversão Reativa de Criptomoedas e Validação de Entradas:**
   - Valida a tela `"Convert Crypto"`, o estado inicial do resultado (`"Enter an amount"`), o tratamento de valor inválido ao digitar `"0"` (`"Invalid amount"`), a conversão reativa de `"1"` `"Bitcoin (BTC)"` para `"USD ($)"`, e a troca de moedas através dos modais do componente `SelectField` (alterando de `"Bitcoin (BTC)"` para `"Ethereum"` e de `"USD ($)"` para `"BRL"`), validando a formatação do resultado em Reais (`R$`).
3. **Fluxo 3 (`03-create-price-alert.yaml`) — Criação Completa de Alerta de Preço e Exibição da Badge na Lista:**
   - Valida a navegação até `"Create Alert"` (e o botão `"Go back"`), verifica que o preenchimento seleciona `"Bitcoin"` no modal `"Select cryptocurrency"`, insere o preço-alvo `"75000"` no campo `"0.00"`, alterna a condição para `"Below target price"`, salva em `"Save Alert"`, confirma a exibição do card na tela `"Price Alerts"` (`"Bitcoin"`, `"Alert when price goes below"`, `"$75,000.00"`) e navega de volta à aba `"List"` para clicar na badge `"1 alert"` (`accessibilityLabel="Toggle alerts for this cryptocurrency"`) do card do Bitcoin e validar os detalhes expandidos (`"Below target"`, `"$75,000.00"`).
4. **Fluxo 4 (`04-delete-price-alert.yaml`) — Exclusão de Alerta de Preço e Retorno ao Estado Vazio:**
   - Garante a independência do teste criando um alerta de preço para `"Ethereum"` (`"Above target price"`, `"$4,500.00"`), valida sua presença na tela `"Price Alerts"`, aciona a remoção pelo botão de ícone com rótulo de acessibilidade `"Delete alert"`, verifica que o alerta foi removido da tela e que o estado vazio `"No alerts yet"` (com o botão `"Create Alert"`) volta a ser exibido.

---

## 4. Análise Crítica: O que foi Aproveitado, Corrigido ou Descartado e Por Quê

A experiência prática confirma diretamente as conclusões do artigo **GenIA-E2ETest**: a IA generativa é excelente para estruturar rapidamente a jornada do usuário e cobrir os principais fluxos funcionais, mas sofre de **ambiguidade semântica** e **alucinação de elementos de interface** quando não conhece a implementação exata dos componentes.

| Item sugerido pela IA | Decisão | Justificativa Técnica (Inspeção no App Real) |
| :--- | :--- | :--- |
| **Jornada macro de criação, listagem, conversão e remoção de alertas** | **Aproveitado** | A decomposição dos fluxos principais nas três abas (`List`, `Convert`, `Alerts`) refletiu bem as funcionalidades centrais do aplicativo e serviu como base estrutural para os 4 arquivos YAML. |
| **Busca de criptomoedas na tela inicial (Cenário 1 da IA)** | **Descartado** | A IA "alucinou" a existência de um campo `"Search cryptocurrency"`. Inspecionando `CryptoListScreen.tsx`, a tela possui apenas o título `"Cryptocurrencies"` e a `FlatList` de `CryptoCard`s (o ícone de lupa só aparece no componente `EmptyState` caso a lista venha vazia). |
| **Notificação Push em background (Cenário 6 da IA)** | **Descartado** | O app não possui integração com `expo-notifications` nem serviço em background; os alertas são gerenciados localmente pelo `AlertProvider` com persistência em `AsyncStorage` e exibidos na aba `"Alerts"` e nos badges dos `CryptoCard`s. |
| **Clique em `"Save Alert"` vazio para ver mensagens de erro (Cenário 4 da IA)** | **Corrigido / Adaptado** | Em `CreateAlertScreen.tsx` (linha 92), o botão `PrimaryButton` recebe `disabled={!isFormValid}`. Portanto, quando os campos estão vazios, o botão `"Save Alert"` fica desabilitado e não dispara `handleSave`. Em vez disso, validamos no E2E a entrada de valor inválido (`"0"`) na tela de conversão (`"Invalid amount"`) e o fluxo real de habilitação do botão após preencher os campos. |
| **Botão `"Convert"` e seletores da tela de Conversão (Rascunho 2 da IA)** | **Corrigido** | A IA assumiu que havia um botão `"Convert"` para submeter o formulário e placeholders `"Select cryptocurrency"` / `"Select fiat currency"`. Na realidade, em `useConversionScreen.ts`, a conversão é **100% reativa** (`useEffect` recalcula ao digitar no `TextInput` de placeholder `"0.00"`), e os campos `SelectField` já iniciam pré-selecionados com `"Bitcoin (BTC)"` e `"USD ($)"`. Para abrir o modal no Maestro, o seletor correto é clicar em `"Bitcoin (BTC)"` e `"USD ($)"`. |
| **Seletores do formulário de criação de alerta (Rascunho 3 da IA)** | **Corrigido** | A IA inventou `id: "price-input"` e texto `"Above"`. Na interface real (`CreateAlertScreen.tsx` e `ConditionOptionRow.tsx`), o campo de preço tem placeholder `"0.00"` e as opções de condição exibem os títulos `"Above target price"` e `"Below target price"`. |
| **Ação de exclusão de alerta e modal de confirmação (Rascunho 3 da IA)** | **Corrigido** | A IA sugeriu clicar no texto `"Delete"` e depois em `"Confirm"`. Na implementação real (`AlertCard.tsx`, linhas 45–52), o botão de exclusão contém apenas um ícone de lixeira (`trash-outline`) sem texto visível, identificado por `accessibilityLabel="Delete alert"`, e a exclusão ocorre imediatamente sem modal de confirmação. |
| **Integração entre Alerta Criado e Badge no `CryptoCard`** | **Adicionado na Revisão Humana** | A IA não percebeu que criar um alerta impacta também a tela `"List"`, onde o componente `CryptoCard.tsx` passa a exibir uma badge clicável (`"1 alert"` / `"Toggle alerts for this cryptocurrency"`) que expande os detalhes do alerta na própria listagem de criptomoedas. Esse comportamento cruzado entre telas foi incluído no Fluxo 3. |
