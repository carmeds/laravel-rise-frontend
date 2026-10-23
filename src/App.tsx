import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="p-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Esta sección se implementará en una etapa posterior.
        </p>
      </section>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/dashboards" element={<PlaceholderPage title="Dashboards" />} />
          <Route path="/pantallas" element={<PlaceholderPage title="Pantallas" />} />
          <Route path="/mensajes" element={<PlaceholderPage title="Mensajes" />} />
          <Route path="/usuarios" element={<PlaceholderPage title="Usuarios" />} />
          <Route path="/configuracion" element={<PlaceholderPage title="Configuración" />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}