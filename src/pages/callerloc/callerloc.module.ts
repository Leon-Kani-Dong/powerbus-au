import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CallerlocPage } from './callerloc';

@NgModule({
  declarations: [
    CallerlocPage,
  ],
  imports: [
    IonicPageModule.forChild(CallerlocPage),
  ],
})
export class CallerlocPageModule {}
