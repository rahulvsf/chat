export interface UserLogin {
  username: string;
  password: string;
  client_id: string;
  client_password: string;
}

export interface UserLoginSuccess {
  code: string;
}

export interface PostMessage {
  body: string;
  channelId: string;
  channelType: string;
  status: number;
  subject: string;
  toUserId: string;
  parentMessageId?: string;
}
