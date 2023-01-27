export interface RabbitConfig {
  host: string;
  username: string;
  password: string;
  virtualHost: number;
  directExchange: string;
  fanoutExchange: string;
}

export interface MessageMQ {
  messageType: string,
  payload: any
}
