import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { PhoneloginPage } from '../phonelogin/phonelogin';      //电话号码登录界面
/**
 * Generated class for the CallerlocPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-callerloc',
  templateUrl: 'callerloc.html',
})
export class CallerlocPage {

  // 引入searchbar 
  searchQuery: string = '';
  items: string[];
  country:any;
  constructor(public event:Events,public navCtrl: NavController, public navParams: NavParams) {

    //引入searchbar
    this.initializeItems();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CallerlocPage');

    //document.getElementById('country').addEventListener("click",this.selectCountry)
  }
  selectCountry(i){
    this.country=i;
    // document.getElementById('country').style.backgroundColor='#F5F5F5';
    console.log(i)
    if(i==0){
      this.event.publish('selectCountry','+86')
    }else if(i==1){
      this.event.publish('selectCountry','+61')
    }
    this.navCtrl.pop();

  }
  initializeItems() {
    this.items = [
      'China',
      'Australia',
    ];
  }
  引入searchbar
  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  goback(){
    this.navCtrl.pop();
  }

}
