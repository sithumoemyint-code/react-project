import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type DateRangePickerProps<T extends FieldValues> = {
  /** `react-hook-form` control from `useForm()`. */
  control: Control<T>
  /** Field name; value shape is `{ from?: Date; to?: Date }`. */
  name: FieldPath<T>
  /** Visible label above the trigger. */
  label: string
  /** How many months to show. Defaults to 1. */
  numberOfMonths?: number
  className?: string
}

/**
 * Date-range picker wired to `react-hook-form`.
 *
 * Opens a popover calendar (`mode="range"`). Supports one or more months via
 * `numberOfMonths`. Validation messages come from the form field state.
 *
 * @example
 * ```tsx
 * import { DateRangePicker } from '@/reusable'
 *
 * <DateRangePicker
 *   control={control}
 *   name="dateRange"
 *   label="Availability range"
 *   numberOfMonths={1}
 * />
 * ```
 */
export function DateRangePicker<T extends FieldValues>({
  control,
  name,
  label,
  numberOfMonths = 1,
  className,
}: DateRangePickerProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const value = (field.value ?? undefined) as DateRange | undefined
        const labelText =
          value?.from && value?.to
            ? `${format(value.from, 'LLL dd, y')} - ${format(value.to, 'LLL dd, y')}`
            : value?.from
              ? format(value.from, 'LLL dd, y')
              : 'Pick a date range'

        return (
          <div className={cn('flex flex-col gap-1.5', className)}>
            <Label>{label}</Label>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'h-10 w-full justify-start text-left font-normal',
                      !value?.from && 'text-muted-foreground',
                    )}
                  />
                }
              >
                <CalendarIcon className="mr-2 size-4" />
                {labelText}
              </PopoverTrigger>
              <PopoverContent
                className="w-auto border bg-popover p-0 shadow-md"
                align="start"
              >
                <Calendar
                  mode="range"
                  numberOfMonths={numberOfMonths}
                  selected={value}
                  onSelect={field.onChange}
                  defaultMonth={value?.from}
                  className="[--cell-size:2rem]"
                />
              </PopoverContent>
            </Popover>
            {fieldState.error?.message ? (
              <p className="m-0 text-xs text-destructive">{fieldState.error.message}</p>
            ) : null}
          </div>
        )
      }}
    />
  )
}
