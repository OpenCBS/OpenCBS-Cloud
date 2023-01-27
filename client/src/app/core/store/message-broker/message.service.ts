import { Message } from '@stomp/stompjs';
import { zip ,  Subscription } from 'rxjs';
import { StompConfig, StompRService } from '@stomp/ng2-stompjs';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { RabbitService } from './rabbit.service'
import { MessageMQ, RabbitConfig } from './message.models';
import { Observable } from 'rxjs/internal/Observable'
import { MessageHandlerService } from './message.handler.service';
import { environment } from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class MessageService {
  private combinedSub: any;
  private subscriptions: Array<Subscription> = [];
  private messages: Array<Observable<Message>> = [];
  private mqSubscribed: boolean;

  constructor(private toastService: ToastrService,
              private stompService: StompRService,
              private rabbitService: RabbitService,
              private messageHandlerService: MessageHandlerService) {
  }

  public init(): void {
    const currentUserSub = this.rabbitService.getCurrentUser();
    const stompSub = this.rabbitService.getRabbitConfig();
    this.combinedSub = zip(currentUserSub, stompSub)
      .subscribe(
        x => {
          if (x[0]) {
            if (x[1]) {
              this.initMq(this.getStompConfig(x[1]));
              this.subscribeMq(x[0].id, x[1]);
            }
          }
        });
  }

  public unsubscribeMq(): void {
    if (!this.mqSubscribed) {
      return;
    }

    this.subscriptions.forEach(x => {
      x.unsubscribe();
    });

    this.subscriptions = [];
    this.messages = [];

    this.mqSubscribed = false;
    this.combinedSub.unsubscribe();
  }

  private initMq(config: StompConfig): void {
    this.stompService.config = config;
    this.stompService.initAndConnect();
  }

  private subscribeMq(userId: number, rabbitConfig: RabbitConfig) {
    if (this.mqSubscribed) {
      return;
    }

    this.subscribeToQueue(`/exchange/${rabbitConfig.directExchange}/${userId}`, this.onNext);
    this.subscribeToQueue(`/exchange/${rabbitConfig.fanoutExchange}/${userId}`, this.onNext);

    this.mqSubscribed = true;
  }

  private subscribeToQueue(queueName: string, onNext: any): void {
    const messages = this.stompService.subscribe(queueName);
    this.subscriptions.push(
      messages.subscribe(x => {
        onNext(this, x);
      }));
    this.messages.push(messages);
  }

  private getStompConfig(rabbitConfig: RabbitConfig): StompConfig {
    const stompConfig = new StompConfig();
    stompConfig.headers = {
      'login': rabbitConfig.username,
      'passcode': rabbitConfig.password,
      'host': rabbitConfig.virtualHost
    };
    stompConfig.url = location.protocol === 'https:' ? `wss://${rabbitConfig.host}:15674/ws` : `ws://${rabbitConfig.host}:15674/ws`
    stompConfig.heartbeat_in = environment.STOMP_HEARTBEAT_IN;
    stompConfig.heartbeat_out = environment.STOMP_HEARTBEAT_OUT;
    stompConfig.debug = environment.STOMP_DEBUG;
    return stompConfig;
  }

  private onNext(self: any, message: Message): void {
    const body = <MessageMQ>JSON.parse(message.body);
    self.messageHandlerService.handleMessage(body);
  }
}
