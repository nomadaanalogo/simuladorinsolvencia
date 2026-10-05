import type { CreditCalculation, Obligation, ScheduleRow } from "@/types";

export const calculateMonthlyRate = (rate: number, type: string) => type === "effectiveAnnual" ? Math.pow(1 + rate / 100, 1 / 12) - 1 : type === "nominalAnnual" ? rate / 1200 : rate / 100;
export const calculatePayment = (principal: number, monthlyRate: number, months: number) => monthlyRate === 0 ? principal / months : principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
export const calculateSimpleInterest = (principal: number, annualRate: number, months: number) => principal * (annualRate / 100) * (months / 12);
export const calculateDifference = (reported?: number, calculated?: number) => reported === undefined || calculated === undefined ? undefined : reported - calculated;
export const calculateEffectiveAnnualRate = (monthlyRate: number) => Math.pow(1 + monthlyRate, 12) - 1;
export const calculateNominalRate = (monthlyRate: number) => monthlyRate * 12;

export function calculateAmortizationSchedule(principal: number, rate: number, months: number): ScheduleRow[] {
  const payment = calculatePayment(principal, rate, months); let balance = principal; const rows: ScheduleRow[] = [];
  for (let month = 1; month <= months; month++) { const interest = balance * rate; const capital = Math.min(payment - interest, balance); balance = Math.max(0, balance - capital); rows.push({ month, payment: interest + capital, interest, principal: capital, balance }); }
  return rows;
}

export function calculateCredit(o: Obligation): CreditCalculation {
  const warnings: string[] = []; const principal = o.originalPrincipal ?? 0;
  const payments = o.paymentMode === "detailed" ? o.payments.reduce((sum, p) => sum + p.amount, 0) : (o.totalPaid ?? 0);
  const detailedPrincipal = o.payments.reduce((sum, p) => sum + (p.principal ?? 0), 0);
  const detailedInterest = o.payments.reduce((sum, p) => sum + (p.ordinaryInterest ?? 0), 0);
  const defaultInterest = (o.reportedDefaultInterest ?? 0); const otherCharges = o.reportedOtherCharges ?? 0;
  if (!principal) return { originalPrincipal: 0, principalPaid: detailedPrincipal, interestPaid: detailedInterest, principalOutstanding: 0, ordinaryInterest: o.reportedOrdinaryInterest ?? 0, defaultInterest, otherCharges, calculatedBalance: 0, reportedBalance: o.reportedBalance, difference: calculateDifference(o.reportedBalance, 0), schedule: [], warnings: ["Información insuficiente para reconstruir exactamente el crédito: falta el capital original."], certainty: "incomplete" };
  const canAmortize = o.amortizationSystem === "fixedPayment" && !!o.interestRate && !!o.interestRateType && !!o.originalTermMonths;
  if (canAmortize) {
    const rate = calculateMonthlyRate(o.interestRate!, o.interestRateType!); const schedule = calculateAmortizationSchedule(principal, rate, o.originalTermMonths!);
    const count = Math.min(o.installmentsPaid ?? 0, schedule.length); const elapsed = schedule.slice(0, count); const estimatedPrincipal = elapsed.reduce((s, r) => s + r.principal, 0); const estimatedInterest = elapsed.reduce((s, r) => s + r.interest, 0);
    const principalPaid = detailedPrincipal || estimatedPrincipal; const interestPaid = detailedInterest || estimatedInterest;
    if (o.paymentMode === "total" && payments && !o.installmentsPaid) warnings.push("Distribución de pagos desconocida. El total pagado no se reparte automáticamente entre capital e intereses.");
    const outstanding = Math.max(0, principal - principalPaid); const ordinary = Math.max(0, schedule.slice(count).reduce((s, r) => s + r.interest, 0));
    const calculatedBalance = outstanding + defaultInterest + otherCharges;
    return { originalPrincipal: principal, estimatedInstallment: calculatePayment(principal, rate, o.originalTermMonths!), numberOfInstallments: o.originalTermMonths, principalPaid, interestPaid, principalOutstanding: outstanding, ordinaryInterest: o.reportedOrdinaryInterest ?? ordinary, defaultInterest, otherCharges, calculatedBalance, reportedBalance: o.reportedBalance, difference: calculateDifference(o.reportedBalance, calculatedBalance), schedule, warnings, certainty: count || detailedPrincipal ? "reconstructed" : "estimated" };
  }
  if (o.amortizationSystem === "simpleInterest" && o.interestRate && o.originalTermMonths) {
    const interest = calculateSimpleInterest(principal, o.interestRate, o.originalTermMonths); const outstanding = Math.max(0, principal - detailedPrincipal); const calculatedBalance = outstanding + Math.max(0, interest - detailedInterest) + defaultInterest + otherCharges;
    return { originalPrincipal: principal, principalPaid: detailedPrincipal, interestPaid: detailedInterest, principalOutstanding: outstanding, ordinaryInterest: o.reportedOrdinaryInterest ?? Math.max(0, interest - detailedInterest), defaultInterest, otherCharges, calculatedBalance, reportedBalance: o.reportedBalance, difference: calculateDifference(o.reportedBalance, calculatedBalance), schedule: [], warnings: ["Resultado estimado con base en interés simple y los datos disponibles."], certainty: "estimated" };
  }
  warnings.push("Información insuficiente para reconstruir exactamente el crédito. Agregue tasa, plazo y sistema, o un historial detallado de pagos.");
  const outstanding = Math.max(0, principal - detailedPrincipal); const calculatedBalance = outstanding + (o.reportedOrdinaryInterest ?? 0) + defaultInterest + otherCharges;
  return { originalPrincipal: principal, principalPaid: detailedPrincipal, interestPaid: detailedInterest, principalOutstanding: outstanding, ordinaryInterest: o.reportedOrdinaryInterest ?? 0, defaultInterest, otherCharges, calculatedBalance, reportedBalance: o.reportedBalance, difference: calculateDifference(o.reportedBalance, calculatedBalance), schedule: [], warnings, certainty: "incomplete" };
}
