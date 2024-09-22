export type User = {
  id: number,
  username: string,
  role: UserRole
}

export type UserRole = 'teacher' | 'student' | 'admin'

export type Student = User & {
  totalScore: number
}

export type StudentClass = {
  id: number,
  name: string,
  description: string
}
