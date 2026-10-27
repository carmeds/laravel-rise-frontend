import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Tableros from './pages/Tableros'
import Servicios from './pages/Servicios'
import ScreenBuilder from './pages/ScreenBuilder'
import ScreenDisplay from './pages/ScreenDisplay'
import LoginPage from './pages/LoginPage'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ScreensProvider } from './contexts/ScreensContext'
import Mensajes from './pages/Mensajes'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="p-6 pb-16">
      <section className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Esta sección se implementará en una etapa posterior.
        </p>
      </section>
    </main>
  )
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-300">
        Verificando sesión…
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}

function LoginRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-300">
        Verificando sesión…
      </div>
    )
  }

  return user ? <Navigate to="/dashboard" replace /> : <LoginPage />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScreensProvider>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route
              element={
                <RequireAuth>
                  <MainLayout />
                </RequireAuth>
              }
            >
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tableros" element={<Tableros />} />

              <Route path="/dashboards" element={<Navigate to="/tableros" replace />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/pantallas" element={<ScreenBuilder />} />
              <Route path="/pantallas/:screenId/editar" element={<ScreenBuilder />} />
              <Route path="/pantalla/:screenId" element={<ScreenDisplay />} />
              <Route path="/mensajes" element={<Mensajes />} />
              <Route path="/usuarios" element={<PlaceholderPage title="Usuarios" />} />
              <Route path="/configuracion" element={<PlaceholderPage title="Configuración" />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </ScreensProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}