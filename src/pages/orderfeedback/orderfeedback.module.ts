import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderfeedbackPage } from './orderfeedback';

@NgModule({
  declarations: [
    OrderfeedbackPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderfeedbackPage),
  ],
})
export class OrderfeedbackPageModule {}
