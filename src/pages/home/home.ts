import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//注入登录/注册界面
import { UsernewPage } from '../usernew/usernew';
//注入手机登录界面
import { PhoneloginPage } from '../phonelogin/phonelogin';

//引入地图页面
import { PowermapPage } from '../powermap/powermap';

import { SlidesPage } from '../slides/slides'; //引导页
// import { RentPage } from '../rent/rent'; //租借界面


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
  
  }
  //跳转到登录/注册界面
  usernew(){
    this.navCtrl.push(UsernewPage);
  }

  //跳转到手机登录界面
  phonelogin(){
    this.navCtrl.push(PhoneloginPage);
  }
  //跳转到首页（租借/归还）
  gopowermap(){
    this.navCtrl.push(PowermapPage);
  }

   //gosliders 引导页
   gosliders(){
    this.navCtrl.push(SlidesPage);
  };

}
