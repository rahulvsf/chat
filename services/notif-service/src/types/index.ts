interface PubNubMessage {
    receiver: {
      to: {
        type: 0; //Channel Type
        id: string; //Channel identifier
        name?: string;
      }[];
    };
    subject: string;
    body: string;
    sentDate: Date;
    type: 0; //Push Notification
    options?: {
      sound: string;
    };
  }