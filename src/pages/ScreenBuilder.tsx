
import { useEffect, useState } from 'react'
import { Check, Eye, Save } from 'lucide-react'
import { useParams } from 'react-router-dom'

import {
  useScreens,
  type SavedScreen,
} from '../contexts/ScreensContext'

import FeedbackModal from '../components/ui/FeedbackModal'
import ScreenForm from '../components/screens/ScreenForm'
import WidgetCatalog from '../components/screens/WidgetCatalog'
import ScreenRowsEditor from '../components/screens/ScreenRowsEditor'
import ScreenPreview from '../components/screens/ScreenPreview'
import { useScreenBuilder } from '../hooks/useScreenBuilder'

export default function ScreenBuilder() {
  const { screenId } = useParams<{ screenId: string }>()

  const {
    addScreen,
    updateScreen,
    getScreen,
    loading,
  } = useScreens()

  const existingScreen = screenId
    ? getScreen(screenId)
    : undefined

  // Estado propio de la página: guardado, vista previa y mensajes.
  const [savedScreen, setSavedScreen] = useState<SavedScreen | null>(null)
  const [preview, setPreview] = useState(false)
  const [message, setMessage] = useState('')
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [editInitialized, setEditInitialized] = useState(false)

  function notify(messageText: string) {
    setMessage(messageText)
    setShowMessageModal(true)
  }

  function clearMessage() {
    setMessage('')
    setShowMessageModal(false)
  }

  // Estado del formulario y distribución de widgets administrados por el hook.
  const {
    title,
    setTitle,
    color,
    setColor,
    district,
    setDistrict,
    rows,
    setRows,
    draggedWidget,
    setDraggedWidget,
    availableWidgets,
    getWidget,
    updateRowColumns,
    removeWidget,
    placeWidget,
    addRow,
    deleteRow,
  } = useScreenBuilder(clearMessage)

  // Cargar los datos cuando se edita una pantalla existente.
  useEffect(() => {
    if (!screenId) {
      setEditInitialized(false)
      setSavedScreen(null)
      return
    }

    if (loading) return

    if (!existingScreen) {
      setEditInitialized(false)
      return
    }

    setTitle(existingScreen.title)
    setColor(existingScreen.color)
    setDistrict(existingScreen.district)

    setRows(
      existingScreen.rows.map((row) => ({
        ...row,
        widgetIds: [...row.widgetIds],
      })),
    )

    setSavedScreen(existingScreen)
    setEditInitialized(true)
  }, [
    screenId,
    loading,
    existingScreen,
    setTitle,
    setColor,
    setDistrict,
    setRows,
  ])

  // Validar y guardar una pantalla nueva o actualizar una existente.
  async function saveScreen(showPreview: boolean) {
    if (screenId && (!editInitialized || !existingScreen)) {
      notify('No se encontró la pantalla que deseas editar.')
      return
    }

    if (!title.trim()) {
      notify('Escribe un título para la pantalla.')
      return
    }

    if (rows.length === 0) {
      notify('Añade al menos una fila a la pantalla.')
      return
    }

    if (!rows.some((row) => row.widgetIds.some((id) => id !== null))) {
      notify('Arrastra al menos un widget a la distribución.')
      return
    }

    try {
      const data = {
        title: title.trim(),
        color,
        district,
        rows: rows.map((row) => ({
          ...row,
          widgetIds: [...row.widgetIds],
        })),
      }

      let result: SavedScreen

      if (screenId && existingScreen) {
        result = {
          ...existingScreen,
          ...data,
        }

        await updateScreen(result)
      } else {
        result = await addScreen(data)
      }

      setSavedScreen(result)
      setPreview(showPreview)

      notify(
        screenId
          ? 'Pantalla actualizada correctamente en la base de datos.'
          : 'Pantalla guardada correctamente en la base de datos.',
      )
    } catch (error) {
      notify(
        error instanceof Error
          ? `No se pudo guardar la pantalla: ${error.message}`
          : 'No se pudo guardar la pantalla en la base de datos.',
      )
    }
  }

  const isSuccessMessage =
    message.startsWith('Pantalla guardada') ||
    message.startsWith('Pantalla actualizada')

  // Vista previa de la pantalla guardada.
  if (preview && savedScreen) {
    return (
      <main className="min-h-[calc(100vh-98px)] bg-slate-100 p-3 pb-16 dark:bg-slate-950 sm:p-5">
        <ScreenPreview
          screen={savedScreen}
          onBack={() => setPreview(false)}
        />

        <FeedbackModal
          open={showMessageModal}
          message={message}
          variant={isSuccessMessage ? 'success' : 'error'}
          title={
            isSuccessMessage
              ? 'Operación completada'
              : 'Revisa la información'
          }
          onClose={() => setShowMessageModal(false)}
        />
      </main>
    )
  }

  return (
    <main className="min-h-[calc(100vh-98px)] bg-slate-100 p-3 pb-16 dark:bg-slate-950 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            {screenId ? 'Editar pantalla' : 'Creador de pantallas'}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Diseña la distribución y arrastra los indicadores a sus espacios.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => saveScreen(false)}
            className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
          >
            <Save size={16} />
            {screenId ? 'Guardar cambios' : 'Guardar'}
          </button>

          <button
            type="button"
            onClick={() => saveScreen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Eye size={16} />
            {screenId
              ? 'Guardar cambios y mostrar'
              : 'Guardar y mostrar'}
          </button>
        </div>
      </div>

      <ScreenForm
        title={title}
        color={color}
        district={district}
        onTitleChange={(value) => {
          setTitle(value)
          clearMessage()
        }}
        onColorChange={(value) => {
          setColor(value)
          clearMessage()
        }}
        onDistrictChange={(value) => {
          setDistrict(value)
          clearMessage()
        }}
      />

      <div className="grid items-start gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <WidgetCatalog
          widgets={availableWidgets}
          draggedWidget={draggedWidget}
          onDragStart={setDraggedWidget}
          onDragEnd={() => setDraggedWidget(null)}
        />

        <ScreenRowsEditor
          rows={rows}
          title={title}
          color={color}
          district={district}
          draggedWidget={draggedWidget}
          getWidget={getWidget}
          onAddRow={addRow}
          onDeleteRow={deleteRow}
          onUpdateColumns={updateRowColumns}
          onRemoveWidget={removeWidget}
          onPlaceWidget={placeWidget}
          onDragStart={setDraggedWidget}
          onDragEnd={() => setDraggedWidget(null)}
        />
      </div>

      {message && (
        <div
          role="status"
          className={`mt-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
            isSuccessMessage
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'
              : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300'
          }`}
        >
          {isSuccessMessage && <Check size={17} />}
          {message}
        </div>
      )}

      <FeedbackModal
        open={showMessageModal}
        message={message}
        variant={isSuccessMessage ? 'success' : 'error'}
        title={
          isSuccessMessage
            ? 'Operación completada'
            : 'Revisa la información'
        }
        onClose={() => setShowMessageModal(false)}
      />
    </main>
  )
}
