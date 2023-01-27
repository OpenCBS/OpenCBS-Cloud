import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { OperationDayRoutingModule } from './operation-day-routing.module';
import { OperationDayComponent } from './operation-day/operation-day.component';
import { ProcessBlockComponent } from './process-block/process-block.component';
import { OperationDayService } from './shared/operation-day.service';
import { StompRService } from '@stomp/ng2-stompjs';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../../../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    TranslateModule,
    FormsModule,
    OperationDayRoutingModule
  ],
  declarations: [OperationDayComponent, ProcessBlockComponent],
  providers: [
    OperationDayService,
    StompRService],
})
export class OperationDayModule {
}
