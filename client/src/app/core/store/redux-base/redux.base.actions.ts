import { NgRxAction } from '../action.interface';

export abstract class ReduxBaseActions {
  private generateActionName(action: string): string {
    return `[${this.getClassName()}] ${action}`;
  }

  public getInitialActionName(): string {
    return this.generateActionName(this.getInitialActionCommandName());
  }

  public getResetActionName(): string {
    return this.generateActionName('RESET_ACTION');
  }

  public getLoadingActionName(): string {
    return this.generateActionName('LOADING_ACTION');
  }

  public getFailureActionName(): string {
    return this.generateActionName('FAILURE_ACTION');
  }

  public getSuccessActionName(): string {
    return this.generateActionName('SUCCESS_ACTION');
  }

  public fireInitialAction(data = null): NgRxAction {
    return {
      type: this.getInitialActionName(),
      payload: {
        data
      }
    };
  }

  public fireResetAction(): NgRxAction {
    return {
      type: this.getResetActionName()
    };
  }

  public fireLoadingAction(): NgRxAction {
    return {
      type: this.getLoadingActionName()
    };
  }

  public fireFailureAction(err): NgRxAction {
    return {
      type: this.getFailureActionName(),
      payload: {
        err
      }
    };
  }

  public fireSuccessAction(data = null): NgRxAction {
    return {
      type: this.getSuccessActionName(),
      payload: data
    };
  }

  abstract getClassName(): string;

  abstract getInitialActionCommandName(): string;
}
