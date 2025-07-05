export interface LoginRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  successful: boolean;
  result: string;
  user?: {
    name: string;
    email: string;
  };
}
