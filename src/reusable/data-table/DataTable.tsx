import type { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '../button/Button'
import { Typography } from '../typography/Typography'

export type DataTableColumn<T> = {
  /** Stable column key used for React keys. */
  id: string
  /** Header label or custom node. */
  header: ReactNode
  /** Cell renderer for a single row. */
  cell: (row: T) => ReactNode
  /** Optional class for body cells. */
  className?: string
  /** Optional class for the header cell. */
  headerClassName?: string
}

type DataTableProps<T> = {
  /** Full list of records (pagination is applied internally). */
  records: T[]
  /** Column definitions (header + cell renderers). */
  columns: DataTableColumn<T>[]
  /** Current 1-based page. */
  page: number
  /** Rows per page. */
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  /** Resolve a stable row key. Defaults to `row.id` when present. */
  getRowId?: (row: T, index: number) => string
  /** Empty-state message. */
  emptyMessage?: string
  /** Show rows-per-page select and item count. Defaults to `true`. */
  showRowsPerPage?: boolean
  /** Show previous/next controls and page indicator. Defaults to `true`. */
  showPagination?: boolean
}

/**
 * Paginated data table driven by caller-defined columns.
 *
 * Pass any record shape via generics and describe headers/cells with `columns`.
 * Page size options are 5 / 10 / 20. Use `showRowsPerPage` and `showPagination`
 * to toggle footer controls.
 *
 * @example
 * ```tsx
 * import { DataTable, type DataTableColumn } from '@/reusable'
 *
 * const columns: DataTableColumn<User>[] = [
 *   { id: 'name', header: 'Name', cell: (row) => row.name },
 *   { id: 'email', header: 'Email', cell: (row) => row.email },
 * ]
 *
 * <DataTable
 *   records={users}
 *   columns={columns}
 *   page={page}
 *   pageSize={pageSize}
 *   onPageChange={setPage}
 *   onPageSizeChange={handlePageSizeChange}
 * />
 * ```
 */
export function DataTable<T>({
  records,
  columns,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  getRowId,
  emptyMessage = 'No records yet.',
  showRowsPerPage = true,
  showPagination = true,
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(records.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const pageRecords = records.slice(start, start + pageSize) // pageRecords = records.slice(5, 10) → index ၅ ကနေ ၉ အထိ (row ၆–၁၀) ကိုသာ table မှာ ပြမယ်။
  const showFooter = showRowsPerPage || showPagination

  function resolveRowId(row: T, index: number) {
    if (getRowId) return getRowId(row, index)
    if (row && typeof row === 'object' && 'id' in row) {
      return String((row as { id: string | number }).id)
    }
    return String(start + index)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className={column.headerClassName}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={Math.max(columns.length, 1)} className="h-24 text-center">
                  <Typography className="text-muted-foreground">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              pageRecords.map((record, index) => (
                <TableRow key={resolveRowId(record, index)}>
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.className}>
                      {column.cell(record)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showFooter ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {showRowsPerPage ? (
            <div className="flex items-center gap-2">
              <Typography className="inline text-sm text-muted-foreground">
                Rows per page
              </Typography>
              <select
                className="h-8 rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none"
                value={pageSize}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
                aria-label="Rows per page"
              >
                {[5, 10, 20].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <Typography className="inline text-sm text-muted-foreground">
                {records.length === 0
                  ? '0 items'
                  : `${start + 1}-${Math.min(start + pageSize, records.length)} of ${records.length}`}
              </Typography>
            </div>
          ) : (
            <div />
          )}

          {showPagination ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-auto"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <Typography className="inline text-sm text-muted-foreground">
                Page {currentPage} / {totalPages}
              </Typography>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 w-auto"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
