import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Button,
  ConfirmAlertDialog,
  Typography,
  type DataTableColumn,
} from '@/reusable'
import type { TestingRecord } from '../types/testingRecord'

export function getTestingColumns(
  onDelete: (id: string) => void,
): DataTableColumn<TestingRecord>[] {
  return [
    {
      id: 'user',
      header: 'User',
      cell: (record) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            {record.avatarUrl ? (
              <AvatarImage src={record.avatarUrl} alt={record.name} />
            ) : null}
            <AvatarFallback>{record.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <Typography className="truncate font-medium">{record.name}</Typography>
            <Typography className="truncate text-xs text-muted-foreground">
              {record.email}
            </Typography>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      cell: (record) => (
        <Typography className="capitalize">{record.role}</Typography>
      ),
    },
    {
      id: 'skills',
      header: 'Skills',
      cell: (record) => (
        <div className="flex max-w-[220px] flex-wrap gap-1">
          {record.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (record) => (
        <Badge variant={record.active ? 'default' : 'outline'}>
          {record.active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'dateRange',
      header: 'Date range',
      cell: (record) => (
        <Typography>
          {record.startDate && record.endDate
            ? `${format(record.startDate, 'MMM d')} - ${format(record.endDate, 'MMM d, yyyy')}`
            : '—'}
        </Typography>
      ),
    },
    {
      id: 'created',
      header: 'Created',
      cell: (record) => (
        <Typography>{format(record.createdAt, 'MMM d, yyyy HH:mm')}</Typography>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      headerClassName: 'text-right',
      className: 'text-right',
      cell: (record) => (
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
      ),
    },
  ]
}
