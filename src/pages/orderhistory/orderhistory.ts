import { Component, ComponentFactoryResolver } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController} from 'ionic-angular';
import { RentServiceProvider } from '../../providers/rent-service/rent-service';

import { OrderfeedbackPage } from '../orderfeedback/orderfeedback'; //订单问题反馈

/**
 * Generated class for the OrderhistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orderhistory',
  templateUrl: 'orderhistory.html',
})
export class OrderhistoryPage {
  ID:any;
  TOKEN:any;
  transcations:any;
  constructor(public alert:AlertController,public rentService:RentServiceProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.ID=this.navParams.get("ID")
    this.TOKEN=this.navParams.get("TOKEN")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderhistoryPage');
    this.getTranscations()
  }
  presentAlert(title,subtitle,button) {
    let alert = this.alert.create({
      title: title,
      subTitle: subtitle,
      buttons: [button]
    });
    alert.present();
  }
  getTranscations(){
    this.rentService.getTranscations(this.ID,this.TOKEN.token,this.TOKEN.type).subscribe(
      (result:any)=>{
        console.log(result)
        if (result){
          console.log('yes result')
          if (result.length == 0){
            document.getElementById("notrac").style.display=""
          }else{
            document.getElementById("notrac").style.display="none"
            this.transcations=result.reverse();
          }
        }else{
          console.log('no result')
          document.getElementById("notrac").style.display=""
        }
      },
      (error)=>{
        this.presentAlert("cannot get history","","ok");
        console.log(error)
      }
    )
  }



  // 订单问题反馈
  feedback(){
    this.navCtrl.push(OrderfeedbackPage);
  }

  //返回上一页
  goback(){   
    this.navCtrl.pop()
  }

}
