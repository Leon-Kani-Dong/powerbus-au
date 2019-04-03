import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PowermapPage } from './powermap';
@NgModule({
  declarations: [
    PowermapPage,
  ],
  imports: [
    IonicPageModule.forChild(PowermapPage),
  ],
})
export class PowermapPageModule {}
