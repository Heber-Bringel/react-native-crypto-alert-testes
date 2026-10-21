import { formatChange, formatPrice } from "../index";

describe("Utils - Funções de Formatação Numérica", () => {
  describe("formatPrice", () => {
    it("deve formatar valor com separador de milhar e duas casas decimais por padrão", () => {
      const result = formatPrice(67999.5);
      expect(result).toBe("67,999.50");
    });

    it("deve formatar valor padrão quando fornecido número inteiro", () => {
      const result = formatPrice(1000);
      expect(result).toBe("1,000.00");
    });

    it("deve formatar valores com quantidade personalizada de casas decimais", () => {
      const result = formatPrice(0.00004512, 6);
      expect(result).toBe("0.000045");
    });

    it("deve tratar valor zero retornando 0.00 com duas casas decimais", () => {
      const result = formatPrice(0);
      expect(result).toBe("0.00");
    });

    it("deve formatar valores negativos preservando o sinal de menos", () => {
      const result = formatPrice(-1250.75);
      expect(result).toBe("-1,250.75");
    });

    it("deve arredondar o valor para a quantidade de casas decimais especificada", () => {
      const resultRoundedUp = formatPrice(10.556, 2);
      expect(resultRoundedUp).toBe("10.56");

      const resultRoundedZeroDecimals = formatPrice(99.6, 0);
      expect(resultRoundedZeroDecimals).toBe("100");
    });

    it("deve retornar 0.00 para entradas inválidas (NaN, infinito, null e undefined)", () => {
      expect(formatPrice(Number.NaN)).toBe("0.00");
      expect(formatPrice(Number.POSITIVE_INFINITY)).toBe("0.00");
      expect(formatPrice(Number.NEGATIVE_INFINITY)).toBe("0.00");
      expect(formatPrice(null as unknown as number)).toBe("0.00");
      expect(formatPrice(undefined as unknown as number)).toBe("0.00");
    });

    it("deve manter a quantidade de casas decimais ao tratar entrada inválida", () => {
      expect(formatPrice(Number.NaN, 6)).toBe("0.000000");
    });
  });

  describe("formatChange", () => {
    it("deve adicionar o prefixo '+' e o sufixo '%' para variações positivas", () => {
      const result = formatChange(2.45);
      expect(result).toBe("+2.45%");
    });

    it("deve preservar o prefixo '-' e o sufixo '%' para variações negativas", () => {
      const result = formatChange(-1.23);
      expect(result).toBe("-1.23%");
    });

    it("deve formatar variação zero com prefixo '+' e duas casas decimais (+0.00%)", () => {
      const result = formatChange(0);
      expect(result).toBe("+0.00%");
    });

    it("deve arredondar variações com mais de duas casas decimais", () => {
      const result = formatChange(5.6789);
      expect(result).toBe("+5.68%");
    });

    it("deve tratar pequenas variações negativas próximas a zero", () => {
      const result = formatChange(-0.004);
      expect(result).toBe("-0.00%");
    });

    it("deve retornar +0.00% para entradas inválidas (NaN, infinito, null e undefined)", () => {
      expect(formatChange(Number.NaN)).toBe("+0.00%");
      expect(formatChange(Number.POSITIVE_INFINITY)).toBe("+0.00%");
      expect(formatChange(Number.NEGATIVE_INFINITY)).toBe("+0.00%");
      expect(formatChange(null as unknown as number)).toBe("+0.00%");
      expect(formatChange(undefined as unknown as number)).toBe("+0.00%");
    });
  });
});
