import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react-native";
import { CreateAlertScreen } from "../CreateAlertScreen";
import { AlertProvider } from "@context/AlertProvider/AlertProvider";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

describe("Teste de Integração - Fluxo Completo de Criação de Alerta", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("deve renderizar a tela com valores iniciais e botão desabilitado para formulário incompleto", async () => {
    await render(
      <AlertProvider>
        <CreateAlertScreen />
      </AlertProvider>
    );

    // Valida títulos e textos visíveis da tela
    expect(screen.getByText("Create Alert")).toBeTruthy();
    expect(screen.getByText("Select cryptocurrency")).toBeTruthy();
    expect(screen.getByPlaceholderText("0.00")).toBeTruthy();
    expect(screen.getByText("Above target price")).toBeTruthy();
    expect(screen.getByText("Below target price")).toBeTruthy();

    // Botão Save Alert deve estar inicialmente desabilitado
    const saveButton = screen.getByRole("button", { name: "Save Alert" });
    expect(saveButton.props.accessibilityState.disabled).toBe(true);
  });

  it("deve executar o fluxo completo: selecionar moeda, preencher preço, alterar condição e salvar alerta", async () => {
    await render(
      <AlertProvider>
        <CreateAlertScreen />
      </AlertProvider>
    );

    // Aguarda hidratação inicial do armazenamento
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });

    // 1. Abre o seletor de criptomoedas
    const selectTrigger = screen.getByText("Select cryptocurrency");
    fireEvent.press(selectTrigger);

    // 2. Aguarda a abertura do modal e seleciona a criptomoeda Bitcoin
    await waitFor(() => {
      expect(screen.getByText("Bitcoin")).toBeTruthy();
    });

    const bitcoinOption = screen.getByText("Bitcoin");
    fireEvent.press(bitcoinOption);

    // Valida que o seletor atualizou para a moeda selecionada
    await waitFor(() => {
      expect(screen.getByText("Bitcoin (BTC)")).toBeTruthy();
    });

    // 3. Preenche o valor do preço-alvo
    const priceInput = screen.getByPlaceholderText("0.00");
    fireEvent.changeText(priceInput, "75000");

    await waitFor(() => {
      expect(screen.getByDisplayValue("75000")).toBeTruthy();
    });

    // 4. Seleciona a condição "Below target price"
    const belowOption = screen.getByText("Below target price");
    fireEvent.press(belowOption);

    // 5. Verifica se o botão "Save Alert" foi habilitado com os campos preenchidos
    await waitFor(() => {
      const saveButton = screen.getByRole("button", { name: "Save Alert" });
      expect(saveButton.props.accessibilityState.disabled).toBe(false);
    });

    // 6. Submete o formulário clicando em Save Alert
    const activeSaveButton = screen.getByRole("button", { name: "Save Alert" });
    fireEvent.press(activeSaveButton);

    // 7. Valida que o alerta foi salvo no armazenamento local e redirecionado para a listagem
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/alerts");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "cryptoAlerts",
        expect.stringContaining("Bitcoin")
      );
    });
  });

  it("deve acionar o retorno para a tela anterior quando a pessoa usuária tocar no botão de voltar", async () => {
    await render(
      <AlertProvider>
        <CreateAlertScreen />
      </AlertProvider>
    );

    // ScreenHeader possui botão com acessibilidade semântica via accessibilityLabel "Go back"
    await waitFor(() => {
      expect(screen.getByLabelText("Go back")).toBeTruthy();
    });

    const backButton = screen.getByLabelText("Go back");
    fireEvent.press(backButton);

    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
