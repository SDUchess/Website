export type User = {
  id: number,
  username: string,
  role: 'teacher' | 'student'
}

export type StudentClass = {
  id: number,
  name: string,
  description: string
}
