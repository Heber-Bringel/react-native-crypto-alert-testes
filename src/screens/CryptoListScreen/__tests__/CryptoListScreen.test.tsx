import { act, render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { CryptoListScreen } from "../CryptoListScreen";
import { AlertProvider } from "@context/AlertProvider/AlertProvider";
import {
  fetchCryptocurrenciesFromApi,
  type Cryptocurrency,
} from "@data/cryptoData";

jest.mock("@data/cryptoData", () => {
  const actual = jest.requireActual("@data/cryptoData");
  return {
    ...actual,
    fetchCryptocurrenciesFromApi: jest.fn(),
  };
});

const mockedFetchCryptos = fetchCryptocurrenciesFromApi as jest.MockedFunction<
  typeof fetchCryptocurrenciesFromApi
>;

const mockApiResponse: Cryptocurrency[] = [
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 150.0,
    change24h: 4.5,
    image: "https://example.com/sol.png",
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.65,
    change24h: -2.1,
  },
];

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

async function renderScreen() {
  return render(
    <AlertProvider>
      <CryptoListScreen />
    </AlertProvider>,
  );
}

describe("Tela - CryptoListScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir o estado de carregamento enquanto a API está pendente", async () => {
    const request = deferred<Cryptocurrency[]>();
    mockedFetchCryptos.mockReturnValueOnce(request.promise);

    await renderScreen();

    expect(screen.getByText("Cryptocurrencies")).toBeTruthy();
    expect(screen.getByText("Loading cryptocurrencies...")).toBeTruthy();
  });

  it("deve listar as criptomoedas com preço e variação após sucesso da API", async () => {
    const request = deferred<Cryptocurrency[]>();
    mockedFetchCryptos.mockReturnValueOnce(request.promise);

    await renderScreen();

    await act(async () => {
      request.resolve(mockApiResponse);
    });

    await waitFor(() => {
      expect(screen.getByText("Solana")).toBeTruthy();
    });

    expect(screen.getByText("SOL")).toBeTruthy();
    expect(screen.getByText("$150.00")).toBeTruthy();
    expect(screen.getByText("+4.50%")).toBeTruthy();
    expect(screen.getByText("Cardano")).toBeTruthy();
    expect(screen.getByText("$0.65")).toBeTruthy();
    expect(screen.getByText("-2.10%")).toBeTruthy();
  });

  it("deve exibir estado vazio quando a API retornar lista vazia", async () => {
    const request = deferred<Cryptocurrency[]>();
    mockedFetchCryptos.mockReturnValueOnce(request.promise);

    await renderScreen();

    await act(async () => {
      request.resolve([]);
    });

    await waitFor(() => {
      expect(screen.getByText("No cryptocurrencies found")).toBeTruthy();
    });
  });

  it("deve exibir erro e permitir nova tentativa após falha da API", async () => {
    const request = deferred<Cryptocurrency[]>();
    mockedFetchCryptos.mockReturnValueOnce(request.promise);

    await renderScreen();

    await act(async () => {
      request.reject(new Error("Falha de rede"));
    });

    await waitFor(() => {
      expect(screen.getByText("Failed to load")).toBeTruthy();
    });

    mockedFetchCryptos.mockResolvedValueOnce(mockApiResponse);

    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Retry" }));
    });

    await waitFor(() => {
      expect(screen.getByText("Solana")).toBeTruthy();
    });

    expect(mockedFetchCryptos).toHaveBeenCalledTimes(2);
  });
});
