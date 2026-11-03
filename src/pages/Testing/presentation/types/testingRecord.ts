export type TestingRecord = {
  id: string
  name: string
  email: string
  role: string
  skills: string[]
  active: boolean
  notes: string
  richDescription: string
  avatarUrl?: string
  startDate?: Date
  endDate?: Date
  createdAt: Date
}
