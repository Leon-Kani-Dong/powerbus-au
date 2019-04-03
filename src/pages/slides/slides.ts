import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
//引入地图页面
import { PowermapPage } from '../powermap/powermap';

/**
 * Generated class for the SlidesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SlidesPage');
  }
  // 引导页(一共三页，此处是前两页 无button)   
  slides = [
    {
      image: "../../assets/imgs/ionic-14.png",
    },
    {
      image: "../../assets/imgs/ionic-15.png",
    }
  ];

  // 跳转到首页（租借/归还）
  gopowermap(){
    this.navCtrl.push(PowermapPage);
  }
  gologin(){
    this.navCtrl.setRoot(LoginPage);
  }
}
