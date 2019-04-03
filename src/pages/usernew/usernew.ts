import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//注入注册页 & 登录页
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';


/**
 * Generated class for the UsernewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-usernew',
  templateUrl: 'usernew.html',
})
export class UsernewPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsernewPage');
  }

  Register(){
    this.navCtrl.push(RegisterPage);
  }

  Login(){
    this.navCtrl.push(LoginPage);
  }
}
