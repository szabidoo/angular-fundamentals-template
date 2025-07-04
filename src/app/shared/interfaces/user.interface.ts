export interface User {
  name: string | null;
  email: string;
  password: string;
  role: string;
  id: string;
}

export interface UserResponse {
  successful: boolean;
  result: User;
}
