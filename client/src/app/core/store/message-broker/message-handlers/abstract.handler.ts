export abstract class AbstractHandler {
  public abstract getType(): string;

  public abstract handleMessage(body: any): void;
}
