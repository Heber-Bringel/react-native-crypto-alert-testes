import { renderHook, waitFor, act } from "@testing-library/react-native";
import { useCryptoListScreen } from "../useCryptoListScreen";
import {
  fetchCryptocurrenciesFromApi,
  cryptocurrencies as fallbackCryptos,
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
    image: "https://example.com/ada.png",
  },
];

describe("Hook Customizado - useCryptoListScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve iniciar em estado de carregamento com os dados de fallback e atualizar para 'idle' após sucesso da API", async () => {
    let resolveFetch!: (value: Cryptocurrency[]) => void;

    mockedFetchCryptos.mockReturnValueOnce(
      new Promise<Cryptocurrency[]>((resolve) => {
        resolveFetch = resolve;
      }),
    );

    const { result } = await renderHook(() => useCryptoListScreen());

    // Antes da promise resolver, o estado inicial deve permanecer em loading
    expect(result.current.loadingState).toBe("loading");
    expect(result.current.cryptocurrencies).toEqual(fallbackCryptos);

    await act(async () => {
      resolveFetch(mockApiResponse);
    });

    // Aguarda o efeito assíncrono concluir com sucesso
    await waitFor(() => {
      expect(result.current.loadingState).toBe("idle");
    });

    expect(result.current.cryptocurrencies).toEqual(mockApiResponse);
    expect(mockedFetchCryptos).toHaveBeenCalledTimes(1);
  });

  it("deve transitar para o estado 'empty' e esvaziar a lista quando a API retornar um array vazio", async () => {
    mockedFetchCryptos.mockResolvedValueOnce([]);

    const { result } = await renderHook(() => useCryptoListScreen());

    await waitFor(() => {
      expect(result.current.loadingState).toBe("empty");
    });

    expect(result.current.cryptocurrencies).toEqual([]);
  });

  it("deve transitar para o estado 'error' e preservar os dados de fallback quando a API falhar", async () => {
    mockedFetchCryptos.mockRejectedValueOnce(new Error("Erro de rede ao buscar cotações"));

    const { result } = await renderHook(() => useCryptoListScreen());

    await waitFor(() => {
      expect(result.current.loadingState).toBe("error");
    });

    // Em caso de falha, o hook preserva os dados estáticos de fallback
    expect(result.current.cryptocurrencies).toEqual(fallbackCryptos);
  });

  it("deve permitir nova tentativa de requisição através do handleRetry após uma falha", async () => {
    // Primeira chamada falha
    mockedFetchCryptos.mockRejectedValueOnce(new Error("Falha inicial"));

    const { result } = await renderHook(() => useCryptoListScreen());

    await waitFor(() => {
      expect(result.current.loadingState).toBe("error");
    });

    // Segunda chamada (retry) sucede
    mockedFetchCryptos.mockResolvedValueOnce(mockApiResponse);

    await act(async () => {
      result.current.handleRetry();
    });

    await waitFor(() => {
      expect(result.current.loadingState).toBe("idle");
    });

    expect(result.current.cryptocurrencies).toEqual(mockApiResponse);
    expect(mockedFetchCryptos).toHaveBeenCalledTimes(2);
  });
});
