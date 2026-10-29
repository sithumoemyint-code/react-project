import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import {
  Button,
  DataTable,
  DateRangePicker,
  FileUploadDialog,
  Input,
  MultiSelect,
  RadioGroupField,
  SelectField,
  SwitchField,
  TextareaField,
  Typography,
} from '@/reusable' 
import { departmentOptions, roleOptions, skillOptions } from '../data/dummyData'
import { useTestingPage } from '../hooks/TestingUtils'

export default function Testing() {
  const {
    form,
    records,
    page,
    pageSize,
    submitting,
    setPage,
    handlePageSizeChange,
    handleAvatarUploaded,
    handleDelete,
    onSubmit,
  } = useTestingPage()

  const { control } = form
  const avatarUrl = form.watch('avatarUrl')

  return (
    <section className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create test record</CardTitle>
          <CardDescription>
            React Hook Form + Zod demo with shadcn inputs, upload dialog, and date range.
          </CardDescription>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              control={control}
              name="name"
              label="Full name"
              placeholder="Jane Doe"
            />
            <Input
              control={control}
              name="middleName"
              label="Middle name"
              placeholder="Doe"
              maxLength={20}
              showCount
            />
            <Input
              control={control}
              name="email"
              label="Email"
              type="email"
              placeholder="jane@example.com"
              autoComplete="email"
            />

            <div className="md:col-span-2">
              <TextareaField
                control={control}
                name="notes"
                label="Notes"
                placeholder="Short description for this record"
              />
            </div>

            <RadioGroupField
              control={control}
              name="role"
              label="Role"
              options={[...roleOptions]}
            />

            <SelectField
              control={control}
              name="department"
              label="Department"
              placeholder="Select department"
              options={[...departmentOptions]}
            />

            <MultiSelect
              control={control}
              name="skills"
              label="Skills"
              options={[...skillOptions]}
            />

            <SwitchField
              control={control}
              name="active"
              label="Active status"
              description="Inactive records stay visible but marked as inactive."
            />

            <DateRangePicker
              control={control}
              name="dateRange"
              label="Availability range"
              numberOfMonths={2}
            />

            <div className="flex flex-col gap-2 md:col-span-2">
              <Typography className="text-sm font-medium">Avatar</Typography>
              <div className="flex flex-wrap items-center gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Selected avatar"
                    className="size-16 rounded-md object-cover ring-1 ring-border"
                  />
                ) : (
                  <Typography className="bg-muted text-muted-foreground grid size-16 place-items-center rounded-md text-[0.65rem] ring-1 ring-border">
                    Preview
                  </Typography>
                )}
                <FileUploadDialog onUploaded={handleAvatarUploaded} />
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-end gap-2 border-0 bg-transparent">
            <Button
              type="button"
              variant="outline"
              className="w-auto"
              disabled={submitting}
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" className="w-auto" disabled={submitting}>
              {submitting ? <Spinner className="size-4" /> : null}
              {submitting ? 'Saving...' : 'Add to table'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submitted records</CardTitle>
          <CardDescription>
            Table with avatar, pagination, page size, and delete confirmation.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <DataTable
            records={records}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </section>
  )
}
