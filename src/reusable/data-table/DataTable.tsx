import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ConfirmAlertDialog } from '../confirm-alert-dialog/ConfirmAlertDialog'
import { Typography } from '../typography/Typography'

export type DataTableRecord = {
  id: string
  name: string
  email: string
  role: string
  skills: string[]
  active: boolean
  notes: string
  avatarUrl?: string
  startDate?: Date
  endDate?: Date
  createdAt: Date
}

type DataTableProps = {
  /** Full list of records (pagination is applied internally). */
  records: DataTableRecord[]
  /** Current 1-based page. */
  page: number
  /** Rows per page. */
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  /** Called after the user confirms delete in the alert dialog. */
  onDelete: (id: string) => void
}

/**
 * Paginated data table with avatar, badges, page size, and delete confirmation.
 *
 * Renders submitted form records. Page size options are 5 / 10 / 20. Deleting a
 * row opens `ConfirmAlertDialog` before calling `onDelete`.
 *
 * @example
 * ```tsx
 * import { DataTable } from '@/reusable'
 *
 * <DataTable
 *   records={records}
 *   page={page}
 *   pageSize={pageSize}
 *   onPageChange={setPage}
 *   onPageSizeChange={handlePageSizeChange}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export function DataTable({
  records,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onDelete,
}: DataTableProps) {
  const totalPages = Math.max(1, Math.ceil(records.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const pageRecords = records.slice(start, start + pageSize)

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date range</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No records yet. Submit the form to add one.
                </TableCell>
              </TableRow>
            ) : (
              pageRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        {record.avatarUrl ? (
                          <AvatarImage src={record.avatarUrl} alt={record.name} />
                        ) : null}
                        <AvatarFallback>
                          {record.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <Typography className="truncate font-medium">{record.name}</Typography>
                        <Typography className="truncate text-xs text-muted-foreground">
                          {record.email}
                        </Typography>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{record.role}</TableCell>
                  <TableCell>
                    <div className="flex max-w-[220px] flex-wrap gap-1">
                      {record.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={record.active ? 'default' : 'outline'}>
                      {record.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.startDate && record.endDate
                      ? `${format(record.startDate, 'MMM d')} - ${format(record.endDate, 'MMM d, yyyy')}`
                      : '—'}
                  </TableCell>
                  <TableCell>{format(record.createdAt, 'MMM d, yyyy HH:mm')}</TableCell>
                  <TableCell className="text-right">
                    <ConfirmAlertDialog
                      title="Delete record?"
                      description={`This will permanently remove ${record.name} from the table.`}
                      confirmLabel="Delete"
                      onConfirm={() => onDelete(record.id)}
                      trigger={
                        <Button type="button" variant="destructive" size="sm" className="h-8 w-auto">
                          Delete
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page</span>
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
          <span>
            {records.length === 0
              ? '0 items'
              : `${start + 1}-${Math.min(start + pageSize, records.length)} of ${records.length}`}
          </span>
        </div>

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
          <Typography className="text-sm text-muted-foreground">
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
      </div>
    </div>
  )
}
