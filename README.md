# Calculadora de Insolvencia Colombia

Aplicación web local para reconstruir obligaciones financieras, consolidarlas por acreedor y explorar escenarios matemáticos de pago. No es un CRM, no requiere cuenta, no envía datos a un servidor y no reemplaza asesoría jurídica.

## Qué hace

- Acreedores con varias obligaciones independientes.
- Cuota fija, interés simple y modo personalizado.
- Comparación entre saldo informado y saldo estimado.
- Consolidado global, escenarios de pago, descuentos hipotéticos y presupuesto mensual.
- Gráficos, tabla de amortización, impresión y guardado en `localStorage`.

## Qué no hace

No decide procedencia de insolvencia, prelación, legalidad de cobros, extinción de intereses ni el contenido de un acuerdo. Esas materias requieren revisión jurídica y documental.

## Instalación y desarrollo

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

Abra `http://localhost:3000` tras ejecutar el servidor de desarrollo.

## Arquitectura

- `types/`: modelos de acreedores, obligaciones y cálculos.
- `lib/calculations/`: motor financiero puro y testeable.
- `lib/storage/`: persistencia exclusiva en el navegador.
- `data/legalRules.ts`: referencias jurídicas separadas del motor.
- `components/`: interfaz, formularios, resultados y gráficos.

Los cálculos se hacen por obligación, luego por acreedor y finalmente de forma global. La interfaz redondea COP solo para mostrar; las operaciones conservan precisión numérica.

## GitHub y Cloudflare

El proyecto usa `output: "export"`, por lo que `npm run build` genera una exportación estática en `out/`. Súbalo a GitHub y, en Cloudflare Pages, configure:

- Build command: `npm run build`
- Build output directory: `out`
- Node.js: versión compatible con Next.js 16.

No se necesita servidor Node persistente ni variables de entorno.
