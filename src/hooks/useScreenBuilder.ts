
import { useEffect, useMemo, useState } from 'react'

import type { ScreenRow } from '../contexts/ScreensContext'
import type { DashboardWidget } from '../data/dashboardWidgets'
import { dashboardWidgets } from '../data/dashboardWidgets'
import { useConfiguration } from './useConfiguration'

const DEFAULT_DISTRICT = 'PODER JUDICIAL'

function createRow(): ScreenRow {
  return {
    id: crypto.randomUUID(),
    columns: 4,
    widgetIds: [null, null, null, null],
  }
}

export function useScreenBuilder(
  clearMessage: () => void,
  isEditing = false,
) {
  const {
    colors,
    defaultColor,
    loading: colorsLoading,
    error: colorsError,
  } = useConfiguration()

  const [title, setTitle] = useState('')
  const [color, setColor] = useState(defaultColor)
  const [district, setDistrict] = useState(DEFAULT_DISTRICT)
  const [rows, setRows] = useState<ScreenRow[]>(() => [createRow()])
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)

  // Aplicar el color predeterminado al crear una pantalla.
  // Al editar, se conserva el color que ya tenía la pantalla.
  useEffect(() => {
    if (!isEditing) {
      setColor(defaultColor)
    }
  }, [defaultColor, isEditing])

  const placedIds = useMemo(
    () =>
      new Set(
        rows.flatMap((row) =>
          row.widgetIds.filter(
            (id): id is string => id !== null,
          ),
        ),
      ),
    [rows],
  )

  const availableWidgets = useMemo(
    () =>
      dashboardWidgets.filter(
        (widget) => !placedIds.has(widget.id),
      ),
    [placedIds],
  )

  function getWidget(
    id: string | null,
  ): DashboardWidget | undefined {
    return dashboardWidgets.find((widget) => widget.id === id)
  }

  function updateRowColumns(rowId: string, columns: number) {
    setRows((current) =>
      current.map((row) => {
        if (row.id !== rowId) return row

        const widgetIds = row.widgetIds.slice(0, columns)

        while (widgetIds.length < columns) {
          widgetIds.push(null)
        }

        return {
          ...row,
          columns,
          widgetIds,
        }
      }),
    )

    clearMessage()
  }

  function removeWidget(widgetId: string) {
    setRows((current) =>
      current.map((row) => ({
        ...row,
        widgetIds: row.widgetIds.map((id) =>
          id === widgetId ? null : id,
        ),
      })),
    )

    clearMessage()
  }

  function placeWidget(
    widgetId: string,
    targetRowId: string,
    targetIndex: number,
  ) {
    setRows((current) => {
      const sourcePosition = current
        .flatMap((row) =>
          row.widgetIds.map((id, index) => ({
            id,
            rowId: row.id,
            index,
          })),
        )
        .find((slot) => slot.id === widgetId)

      const targetRow = current.find(
        (row) => row.id === targetRowId,
      )

      if (
        !targetRow ||
        targetIndex < 0 ||
        targetIndex >= targetRow.columns
      ) {
        return current
      }

      const displacedWidget =
        targetRow.widgetIds[targetIndex] ?? null

      const next = current.map((row) => ({
        ...row,
        widgetIds: [...row.widgetIds],
      }))

      if (sourcePosition) {
        const sourceRow = next.find(
          (row) => row.id === sourcePosition.rowId,
        )

        if (sourceRow) {
          sourceRow.widgetIds[sourcePosition.index] =
            displacedWidget
        }
      }

      const destinationRow = next.find(
        (row) => row.id === targetRowId,
      )

      if (destinationRow) {
        destinationRow.widgetIds[targetIndex] = widgetId
      }

      return next
    })

    clearMessage()
  }

  function addRow() {
    setRows((current) => [...current, createRow()])
    clearMessage()
  }

  function deleteRow(rowId: string) {
    setRows((current) =>
      current.filter((row) => row.id !== rowId),
    )

    clearMessage()
  }

  return {
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

    // Configuración centralizada de colores.
    colors,
    colorsLoading,
    colorsError,
  }
}
