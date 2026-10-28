import { z } from 'zod'


export const testingFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  middleName: z
    .string()
    .min(2, 'Middle name must be at least 2 characters')
    .max(20, 'Middle name must be at most 20 characters'),
  email: z.email('Enter a valid email'),
  notes: z.string().min(5, 'Notes must be at least 5 characters'),
  role: z.enum(['admin', 'editor', 'viewer'], {
    error: 'Please select a role',
  }),
  department: z.enum(['engineering', 'product', 'design', 'operations'], {
    error: 'Please select a department',
  }),
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  active: z.boolean(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .refine((value) => Boolean(value.from && value.to), {
      message: 'Select a start and end date',
    }),
  avatarUrl: z.string().optional(),
})