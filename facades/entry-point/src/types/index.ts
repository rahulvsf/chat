export interface UserLogin {
  username: string;
  password: string;
  client_id: string;
  client_password: string;
}

export interface UserLoginSuccess {
  code: string;
}

export interface TokenLogin {
  code: string;
  clientId: string;
}

export interface TokenSuccess {
  accessToken: string;
  refreshToken: string;
  expires: number;
}
