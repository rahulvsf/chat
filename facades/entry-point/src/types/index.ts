export interface UserLogin {
  username: string;
  password: string;
  client_id: string;
  client_password: string;
}

export interface UserLoginSuccess {
    code: string;
}