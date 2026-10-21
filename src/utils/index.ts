export function formatPrice(price: number, decimals: number = 2): string {
    const safePrice = Number.isFinite(price) ? price : 0;
    return safePrice.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  
  export function formatChange(change: number): string {
    const safeChange = Number.isFinite(change) ? change : 0;
    const sign = safeChange >= 0 ? "+" : "";
    return `${sign}${safeChange.toFixed(2)}%`;
  }