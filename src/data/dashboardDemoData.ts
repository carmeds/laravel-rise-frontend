export type SemiDonutData = {
  percentage: number
  centerValue: string
  centerLabel: string
  leftValue: string
  leftLabel: string
  rightValue: string
  rightLabel: string
}

export const monthlyData = [
  { name: 'En', value: 420, previous: 380 },
  { name: 'Fe', value: 510, previous: 440 },
  { name: 'Ma', value: 465, previous: 420 },
  { name: 'Ab', value: 590, previous: 480 },
  { name: 'My', value: 550, previous: 510 },
  { name: 'Ju', value: 630, previous: 540 },
  { name: 'Jl', value: 390, previous: 360 },
  { name: 'Ag', value: 440, previous: 490 },
  { name: 'Se', value: 600, previous: 530 },
  { name: 'Oc', value: 410, previous: 390 },
  { name: 'No', value: 320, previous: 570 },
  { name: 'Di', value: 610, previous: 410 },
]

export const tramiteData = [
  { name: 'En', bars: 430, trend: 180 },
  { name: 'Fe', bars: 680, trend: 340 },
  { name: 'Ma', bars: 510, trend: 260 },
  { name: 'Ab', bars: 710, trend: 300 },
  { name: 'My', bars: 520, trend: 320 },
  { name: 'Ju', bars: 420, trend: 350 },
  { name: 'Jl', bars: 360, trend: 410 },
  { name: 'Ag', bars: 380, trend: 520 },
  { name: 'Se', bars: 700, trend: 610 },
  { name: 'Oc', bars: 330, trend: 440 },
  { name: 'No', bars: 260, trend: 690 },
  { name: 'Di', bars: 650, trend: 510 },
]

export const ejecucionData = [
  { name: 'En', bars: 650, trend: 200 },
  { name: 'Fe', bars: 590, trend: 370 },
  { name: 'Ma', bars: 320, trend: 330 },
  { name: 'Ab', bars: 610, trend: 490 },
  { name: 'My', bars: 630, trend: 460 },
  { name: 'Ju', bars: 540, trend: 450 },
  { name: 'Jl', bars: 620, trend: 520 },
  { name: 'Ag', bars: 220, trend: 680 },
  { name: 'Se', bars: 340, trend: 430 },
  { name: 'Oc', bars: 710, trend: 720 },
  { name: 'No', bars: 760, trend: 500 },
  { name: 'Di', bars: 380, trend: 300 },
]

export const stackedData = [
  { name: '2019', completed: 320, pending: 180 },
  { name: '2020', completed: 180, pending: 160 },
  { name: '2021', completed: 350, pending: 210 },
  { name: '2022', completed: 170, pending: 70 },
  { name: '2023', completed: 190, pending: 180 },
  { name: '2024', completed: 300, pending: 200 },
  { name: '2025', completed: 280, pending: 310 },
]

export const donutData = [
  { name: 'Atendidos', value: 68 },
  { name: 'Pendientes', value: 22 },
  { name: 'Otros', value: 10 },
]

export const semiDonutData: Record<string, SemiDonutData> = {
  budget: {
    percentage: 98.4,
    centerValue: '3906.5M',
    centerLabel: 'PIM',
    leftValue: '3843.8M',
    leftLabel: 'Devengado',
    rightValue: '62.7M',
    rightLabel: 'Saldo',
  },
  goals: {
    percentage: 49.3,
    centerValue: '1178',
    centerLabel: 'Meta Anual',
    leftValue: '581.00',
    leftLabel: 'Resueltos',
    rightValue: '597.00',
    rightLabel: 'Pendiente',
  },
  flagrancia: {
    percentage: 83,
    centerValue: '901',
    centerLabel: 'Denuncias',
    leftValue: '748.00',
    leftLabel: 'Atendidas',
    rightValue: '153.00',
    rightLabel: 'Pendiente',
  },
  panic: {
    percentage: 53.6,
    centerValue: '733',
    centerLabel: 'Inscritos',
    leftValue: '393.00',
    leftLabel: 'Instalados',
    rightValue: '340.00',
    rightLabel: 'Pendiente',
  },
  inventario: {
    percentage: 68,
    centerValue: '68%',
    centerLabel: 'Inventariado',
    leftValue: '68%',
    leftLabel: 'Registrado',
    rightValue: '32%',
    rightLabel: 'Pendiente',
  },
  reaperturado: {
    percentage: 68,
    centerValue: '68%',
    centerLabel: 'Reaperturados',
    leftValue: '68%',
    leftLabel: 'Registrados',
    rightValue: '32%',
    rightLabel: 'Pendientes',
  },
  jornada: {
    percentage: 91.3,
    centerValue: '91.3%',
    centerLabel: 'Cumplimiento',
    leftValue: 'Cumplido',
    leftLabel: 'Jornada',
    rightValue: '8.7%',
    rightLabel: 'Restante',
  },
}

// This file contains illustrative values only. Replace them with API responses when the Laravel endpoints are ready.
export const demoDataNote = 'Datos de demostración'
