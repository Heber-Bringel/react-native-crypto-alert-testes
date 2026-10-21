import type { ReactNode } from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { AlertProvider } from "@context/AlertProvider/AlertProvider";
import { useCreateAlertScreen } from "../useCreateAlertScreen";

function wrapper({ children }: { children: ReactNode }) {
  return <AlertProvider>{children}</AlertProvider>;
}

describe("Hook - useCreateAlertScreen", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it("deve registrar erros ao tentar salvar um formulário vazio", async () => {
    const { result } = await renderHook(() => useCreateAlertScreen(), {
      wrapper,
    });

    await act(async () => {
      result.current.handleSave();
    });

    expect(result.current.errors).toEqual({
      crypto: "Please select a cryptocurrency",
      price: "Please enter a target price",
    });
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("deve rejeitar preço não numérico, zero e negativo", async () => {
    const { result } = await renderHook(() => useCreateAlertScreen(), {
      wrapper,
    });

    await act(async () => {
      result.current.setSelectedCrypto("bitcoin");
      result.current.setTargetPrice("abc");
    });

    await act(async () => {
      result.current.handleSave();
    });

    expect(result.current.errors.price).toBe("Please enter a valid price");

    await act(async () => {
      result.current.setTargetPrice("0");
    });

    await act(async () => {
      result.current.handleSave();
    });

    expect(result.current.errors.price).toBe("Please enter a valid price");

    await act(async () => {
      result.current.setTargetPrice("-10");
    });

    await act(async () => {
      result.current.handleSave();
    });

    expect(result.current.errors.price).toBe("Please enter a valid price");
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("deve salvar um alerta válido e redirecionar para a listagem", async () => {
    const { result } = await renderHook(() => useCreateAlertScreen(), {
      wrapper,
    });

    await act(async () => {
      result.current.setSelectedCrypto("bitcoin");
      result.current.setTargetPrice("75000");
      result.current.setCondition("below");
    });

    await act(async () => {
      result.current.handleSave();
    });

    expect(router.replace).toHaveBeenCalledWith("/alerts");

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "cryptoAlerts",
        expect.stringContaining("Bitcoin"),
      );
    });
  });
});
