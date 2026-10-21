import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { CryptoCard } from "../CryptoCard";
import { AlertContext } from "@context/AlertProvider/useAlertProvider";
import type { Cryptocurrency } from "@data/cryptoData";
import type { PriceAlert } from "@context/AlertProvider/useAlertProvider";

const mockCryptoBitcoin: Cryptocurrency = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "BTC",
  price: 67999.5,
  change24h: 2.45,
  image: "https://example.com/btc.png",
};

const mockCryptoEthereum: Cryptocurrency = {
  id: "ethereum",
  name: "Ethereum",
  symbol: "ETH",
  price: 3850.25,
  change24h: -1.23,
};

function renderWithAlerts(crypto: Cryptocurrency, alerts: PriceAlert[] = []) {
  return render(
    <AlertContext.Provider
      value={{
        alerts,
        addAlert: jest.fn(),
        deleteAlert: jest.fn(),
      }}
    >
      <CryptoCard crypto={crypto} />
    </AlertContext.Provider>
  );
}

describe("Componente Visual - CryptoCard", () => {
  it("deve renderizar as informações principais da criptomoeda (nome, símbolo, preço e variação positiva)", async () => {
    await renderWithAlerts(mockCryptoBitcoin);

    expect(screen.getByText("Bitcoin")).toBeTruthy();
    expect(screen.getByText("BTC")).toBeTruthy();
    expect(screen.getByText("$67,999.50")).toBeTruthy();
    expect(screen.getByText("+2.45%")).toBeTruthy();
  });

  it("deve renderizar variação negativa formatada com sinal de menos", async () => {
    await renderWithAlerts(mockCryptoEthereum);

    expect(screen.getByText("Ethereum")).toBeTruthy();
    expect(screen.getByText("ETH")).toBeTruthy();
    expect(screen.getByText("$3,850.25")).toBeTruthy();
    expect(screen.getByText("-1.23%")).toBeTruthy();
  });

  it("deve renderizar a letra inicial do símbolo quando a criptomoeda não possuir imagem", async () => {
    await renderWithAlerts(mockCryptoEthereum);

    // Ethereum não possui imagem no mockCryptoEthereum, renderiza a primeira letra "E"
    expect(screen.getByText("E")).toBeTruthy();
  });

  it("não deve renderizar botão de alertas quando não houver nenhum alerta cadastrado para a moeda", async () => {
    await renderWithAlerts(mockCryptoBitcoin, []);

    const alertButton = screen.queryByRole("button", {
      name: "Toggle alerts for this cryptocurrency",
    });
    expect(alertButton).toBeNull();
  });

  it("deve exibir a badge de alerta no singular quando houver 1 alerta associado", async () => {
    const alert: PriceAlert = {
      id: "alert-1",
      cryptocurrency: "Bitcoin",
      symbol: "BTC",
      targetPrice: 70000,
      condition: "above",
      createdAt: new Date().toISOString(),
    };

    await renderWithAlerts(mockCryptoBitcoin, [alert]);

    expect(screen.getByText("1 alert")).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: "Toggle alerts for this cryptocurrency",
      })
    ).toBeTruthy();
  });

  it("deve alternar a visibilidade da lista de alertas ao clicar no botão de alertas (expandir e colapsar)", async () => {
    const alerts: PriceAlert[] = [
      {
        id: "alert-1",
        cryptocurrency: "Bitcoin",
        symbol: "BTC",
        targetPrice: 70000,
        condition: "above",
        createdAt: new Date().toISOString(),
      },
      {
        id: "alert-2",
        cryptocurrency: "Bitcoin",
        symbol: "BTC",
        targetPrice: 65000,
        condition: "below",
        createdAt: new Date().toISOString(),
      },
    ];

    await renderWithAlerts(mockCryptoBitcoin, alerts);

    expect(screen.getByText("2 alerts")).toBeTruthy();

    // Inicialmente a lista de detalhes está colapsada
    expect(screen.queryByText("Above target")).toBeNull();
    expect(screen.queryByText("Below target")).toBeNull();

    // Clica para expandir
    const toggleButton = screen.getByRole("button", {
      name: "Toggle alerts for this cryptocurrency",
    });
    fireEvent.press(toggleButton);

    // Agora os detalhes devem estar visíveis
    await waitFor(() => {
      expect(screen.getByText("Above target")).toBeTruthy();
      expect(screen.getByText("$70,000.00")).toBeTruthy();
      expect(screen.getByText("Below target")).toBeTruthy();
      expect(screen.getByText("$65,000.00")).toBeTruthy();
    });

    // Clica novamente para recolher
    fireEvent.press(toggleButton);

    await waitFor(() => {
      expect(screen.queryByText("Above target")).toBeNull();
      expect(screen.queryByText("Below target")).toBeNull();
    });
  });
});
