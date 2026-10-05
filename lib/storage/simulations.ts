import type { Simulation } from "@/types";
const KEY = "insolvencia-colombia-simulations";
export const loadSimulations = (): Simulation[] => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
export const saveSimulation = (simulation: Simulation) => { const all = loadSimulations().filter((s) => s.id !== simulation.id); localStorage.setItem(KEY, JSON.stringify([{ ...simulation, updatedAt: new Date().toISOString() }, ...all])); };
export const deleteSimulation = (id: string) => localStorage.setItem(KEY, JSON.stringify(loadSimulations().filter((s) => s.id !== id)));
