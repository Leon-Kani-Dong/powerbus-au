import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { OrderfeedbackPage } from '../pages/orderfeedback/orderfeedback';
import { PhoneregisterPage } from '../pages/phoneregister/phoneregister';
import {PowermapPage} from  '../pages/powermap/powermap'
import {PhoneloginPage} from  '../pages/phonelogin/phonelogin'
import {PaymentPage} from  '../pages/payment/payment'
import { HomePage } from '../pages/home/home';  //  程序默认起始夜  home
import { SlidesPage } from '../pages/slides/slides'; //  程序默认起始页  引导页
import {AddcardPage} from '../pages/addcard/addcard';
import {NativeMapPage} from '../pages/native-map/native-map';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any;
  //rootPage:any =PowermapPage;
  rootPage:any =  PhoneloginPage ;
  //rootPage:any = AddcardPage;//  程序默认起始页  home
   //rootPage:any = SlidesPage; //程序默认起始夜  引导页

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      //this.rootPage=NativeMapPage;
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      if(platform.is('android')) {
        statusBar.styleLightContent();
      }
      //statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

