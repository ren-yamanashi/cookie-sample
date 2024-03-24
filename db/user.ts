export type User = {
  id: number;
  email: string;
  password: string
}

export const users: User[] = [
  {
    id: 1,
    email: 'user1@example.com',
    password: 'password1'
  },
  {
    id: 2,
    email: 'user2@example.com',
    password: 'password2'
  }
]