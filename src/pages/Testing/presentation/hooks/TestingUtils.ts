import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { DateRange } from 'react-day-picker'
import { toast } from 'sonner'
import { z } from 'zod'
import { testingFormSchema } from '../schema/testingFormSchema'
import type { TestingRecord } from '../types/testingRecord'

export type TestingFormValues = z.infer<typeof testingFormSchema>

export const testingFormDefaults: TestingFormValues = {
  name: '',
  middleName: '',
  email: '',
  notes: '',
  richDescription: '',
  role: 'viewer',
  department: 'engineering',
  skills: [],
  active: true,
  dateRange: {},
  avatarUrl: undefined,
}

function createId() {
  return crypto.randomUUID()
}

export function useTestingPage() {
  const [records, setRecords] = useState<TestingRecord[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<TestingFormValues>({
    resolver: zodResolver(testingFormSchema),
    defaultValues: testingFormDefaults,
  })

  function handleAvatarUploaded(_file: File, previewUrl: string) {
    form.setValue('avatarUrl', previewUrl, { shouldDirty: true })
  }

  async function onSubmit(values: TestingFormValues) {
    setSubmitting(true)
    const toastId = toast.loading('Saving record...')

    await new Promise((resolve) => setTimeout(resolve, 800))

    const dateRange = values.dateRange as DateRange
    const nextRecord: TestingRecord = {
      id: createId(),
      name: values.name,
      email: values.email,
      role: values.role,
      skills: values.skills,
      active: values.active,
      notes: values.notes,
      richDescription: values.richDescription,
      avatarUrl: values.avatarUrl,
      startDate: dateRange.from,
      endDate: dateRange.to,
      createdAt: new Date(),
    }

    setRecords((prev) => [nextRecord, ...prev])
    setPage(1)
    form.reset({
      ...testingFormDefaults,
      avatarUrl: undefined,
    })
    toast.success('Record added to the table', { id: toastId })
    setSubmitting(false)
  }

  function handleDelete(id: string) {
    setRecords((prev) => prev.filter((record) => record.id !== id))
    toast.success('Record deleted')
  }

  function handlePageSizeChange(nextSize: number) {
    setPageSize(nextSize)
    setPage(1)
  }

  return {
    form,
    records,
    page,
    pageSize,
    submitting,
    setPage,
    handlePageSizeChange,
    handleAvatarUploaded,
    handleDelete,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
