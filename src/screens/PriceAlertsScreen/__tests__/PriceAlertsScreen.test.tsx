import AsyncStorage from "@react-native-async-storage/async-storage";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import { PriceAlertsScreen } from "../PriceAlertsScreen";
import { AlertProvider } from "@context/AlertProvider/AlertProvider";
import type { PriceAlert } from "@context/AlertProvider/useAlertProvider";

const savedAlert: PriceAlert = {
  id: "alert-1",
  cryptocurrency: "Bitcoin",
  symbol: "BTC",
  targetPrice: 70000,
  condition: "above",
  createdAt: new Date().toISOString(),
};

async function renderScreen() {
  return render(
    <AlertProvider>
      <PriceAlertsScreen />
    </AlertProvider>,
  );
}

describe("Tela - PriceAlertsScreen", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await AsyncStorage.clear();
  });

  it("deve exibir o estado vazio e navegar para a criação de alerta", async () => {
    await renderScreen();

    await waitFor(() => {
      expect(screen.getByText("No alerts yet")).toBeTruthy();
    });

    fireEvent.press(screen.getByRole("button", { name: /New Alert/ }));

    expect(router.push).toHaveBeenCalledWith("/alerts/create");
  });

  it("deve listar um alerta salvo e removê-lo da lista", async () => {
    await AsyncStorage.setItem("cryptoAlerts", JSON.stringify([savedAlert]));

    await renderScreen();

    await waitFor(() => {
      expect(screen.getByText("Bitcoin")).toBeTruthy();
    });

    expect(screen.getByText("above")).toBeTruthy();
    expect(screen.getByText("$70,000.00")).toBeTruthy();

    fireEvent.press(screen.getByLabelText("Delete alert"));

    await waitFor(() => {
      expect(screen.getByText("No alerts yet")).toBeTruthy();
    });
  });
});
