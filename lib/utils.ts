export const money = (value?: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value || 0);
export const uid = () => globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
export const dateMonthsAgo = (months: number) => { const d = new Date(); d.setMonth(d.getMonth() - months); return d.toISOString().slice(0, 10); };
