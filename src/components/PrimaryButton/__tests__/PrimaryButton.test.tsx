import React from "react";
import { Text } from "react-native";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { PrimaryButton } from "../PrimaryButton";

describe("Componente Visual - PrimaryButton", () => {
  it("deve renderizar o texto do botão (label) corretamente", async () => {
    await render(<PrimaryButton label="Salvar Alerta" onPress={jest.fn()} />);

    expect(screen.getByText("Salvar Alerta")).toBeTruthy();
  });

  it("deve ser acessível através do papel semântico de botão com o nome correto", async () => {
    await render(<PrimaryButton label="Confirmar" onPress={jest.fn()} />);

    const button = screen.getByRole("button", { name: "Confirmar" });
    expect(button).toBeTruthy();
  });

  it("deve disparar a ação onPress quando pressionado pela pessoa usuária", async () => {
    const handlePressMock = jest.fn();
    await render(<PrimaryButton label="Clique Aqui" onPress={handlePressMock} />);

    const button = screen.getByRole("button", { name: "Clique Aqui" });
    fireEvent.press(button);

    expect(handlePressMock).toHaveBeenCalledTimes(1);
  });

  it("não deve disparar onPress quando o botão estiver desabilitado", async () => {
    const handlePressMock = jest.fn();
    await render(
      <PrimaryButton
        label="Desabilitado"
        onPress={handlePressMock}
        disabled={true}
      />
    );

    const button = screen.getByRole("button", { name: "Desabilitado" });
    expect(button.props.accessibilityState.disabled).toBe(true);

    fireEvent.press(button);

    expect(handlePressMock).not.toHaveBeenCalled();
  });

  it("deve renderizar o ícone à esquerda quando fornecido pela propriedade leftIcon", async () => {
    const icon = <Text>★</Text>;
    await render(
      <PrimaryButton
        label="Com Ícone"
        onPress={jest.fn()}
        leftIcon={icon}
      />
    );

    expect(screen.getByText("★")).toBeTruthy();
    expect(screen.getByText("Com Ícone")).toBeTruthy();
  });
});


