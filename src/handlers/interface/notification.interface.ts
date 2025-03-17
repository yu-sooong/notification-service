export interface NotificationHandler<T = unknown> {
  send(params: T): Promise<boolean>;
}
