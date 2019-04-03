import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhoneregisterPage } from './phoneregister';

@NgModule({
  declarations: [
    PhoneregisterPage,
  ],
  imports: [
    IonicPageModule.forChild(PhoneregisterPage),
  ],
})
export class PhoneregisterPageModule {}
