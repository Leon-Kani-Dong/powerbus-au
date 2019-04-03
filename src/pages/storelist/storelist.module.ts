import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StorelistPage } from './storelist';

@NgModule({
  declarations: [
    StorelistPage,
  ],
  imports: [
    IonicPageModule.forChild(StorelistPage),
  ],
})
export class StorelistPageModule {}
