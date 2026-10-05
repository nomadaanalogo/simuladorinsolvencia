export type CreditorType = "banco" | "cooperativa" | "entidadFinanciera" | "particular" | "empresa" | "entidadPublica" | "otro";
export type ObligationType = "creditoConsumo" | "libreInversion" | "tarjetaCredito" | "creditoVehicular" | "creditoHipotecario" | "libranza" | "prestamoParticular" | "impuesto" | "multa" | "servicios" | "otro";
export type RateType = "effectiveAnnual" | "nominalAnnual" | "monthly";
export type AmortizationSystem = "fixedPayment" | "simpleInterest" | "custom";

export interface Payment { id: string; date?: string; amount: number; principal?: number; ordinaryInterest?: number; defaultInterest?: number; insurance?: number; other?: number; }
export interface Obligation {
  id: string; creditorId: string; name: string; type: ObligationType;
  originalPrincipal?: number; disbursementDate?: string; originalTermMonths?: number;
  interestRate?: number; interestRateType?: RateType; amortizationSystem?: AmortizationSystem;
  paymentMode: "total" | "detailed"; totalPaid?: number; payments: Payment[]; installmentsPaid?: number;
  reportedBalance?: number; reportedPrincipal?: number; reportedOrdinaryInterest?: number; reportedDefaultInterest?: number; reportedOtherCharges?: number;
  daysPastDue?: number; defaultInterestRate?: number; hasGuarantee: boolean; guaranteeType?: string; guaranteeValue?: number; hasLegalCollection: boolean;
}
export interface Creditor { id: string; name: string; type: CreditorType; obligations: Obligation[]; }
export interface Simulation { id: string; title: string; cutoffDate: string; creditors: Creditor[]; createdAt: string; updatedAt: string; }
export interface ScheduleRow { month: number; payment: number; interest: number; principal: number; balance: number; }
export interface CreditCalculation { originalPrincipal: number; estimatedInstallment?: number; numberOfInstallments?: number; principalPaid: number; interestPaid: number; principalOutstanding: number; ordinaryInterest: number; defaultInterest: number; otherCharges: number; calculatedBalance: number; reportedBalance?: number; difference?: number; schedule: ScheduleRow[]; warnings: string[]; certainty: "reconstructed" | "estimated" | "incomplete"; }
