import { Component } from '@angular/core';
import { AlertController,LoadingController, Loading,IonicPage, NavController, NavParams ,Events} from 'ionic-angular';
import { Stripe } from '@ionic-native/stripe';
import { PayServiceProvider } from '../../providers/pay-service/pay-service';
import {PaymentPage} from  '../../pages/payment/payment'
/**
 * Generated class for the AddcardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addcard',
  templateUrl: 'addcard.html',
})
export class AddcardPage {
  bindcard:any=null;
  loading: Loading;
  exp_deleting:any=false;
  TOKEN:any;
  ID:any;
  PUBKEY:string='sk_live_G68Q1pemAY76OH5HuBWoyIK6';
  constructor(public alert: AlertController,public event:Events,public loadingCtrl: LoadingController,private payService : PayServiceProvider,private stripe: Stripe,public navCtrl: NavController, public navParams: NavParams) {
    this.TOKEN=navParams.get("TOKEN");
    this.ID=navParams.get("ID");
    console.log(this.TOKEN,this.ID)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddcardPage');
  }
  card = {
    number: null,
    exp: null,
    cvv: null
  };


  addSplash(){
    if(this.card.exp.length==2 && this.exp_deleting==false){
      this.card.exp=this.card.exp.concat('/');
    }
    if(this.exp_deleting==true && this.card.exp.length<=3){
      this.exp_deleting=false;
    }
    if (this.card.exp.length>=2){
      this.exp_deleting=true;
    }
  }
  presentAlert(title,subtitle,button) {
    let alert = this.alert.create({
      title: title,
      subTitle: subtitle,
      buttons: [button]
    });
    alert.present();
  }
  /*
  change card info format
  */
  change_format(){
    return {
      number:this.card.number,
      expMonth: Number(this.card.exp==null?'0':this.card.exp.split('/')[0]),
      expYear: Number(this.card.exp==null?'0':this.card.exp.split('/')[1]),
      cvc:this.card.cvv
    }
  }
  createCard(){
    console.log("start to post card!")
    this.showLoader('BINDING ... ')
    this.stripe.setPublishableKey(this.PUBKEY);
    this.stripe.createCardToken(this.change_format())
    .then(
      token => {console.log(token.id)
      this.payService.createCard({"user":this.ID,"nonce":token.id},this.ID,this.TOKEN.token,this.TOKEN.type).subscribe(
        (data)=>{
          this.loading.dismiss();
          //this.navCtrl.pop()
          this.event.publish("bindCard",data);
          this.bindcard=data;
          this.navCtrl.pop();
          console.log('post card result',JSON.stringify(data))
          
        },
        (error)=>{
          this.loading.dismiss();
          this.presentAlert("","Cannot bind card, try again.","OK");
          console.log('post card http error',JSON.stringify(error))}
      )
      }
    ).catch(error => {
      this.loading.dismiss();
      this.presentAlert("","Cannot bind card, try again.","OK");
      console.log('stripe error',error)});
  }
  test(){

    console.log(this.change_format())
  }
  //loading window
  showLoader(words){
 
    this.loading = this.loadingCtrl.create({
        content: words
    });

    this.loading.present();

  }
  ionViewWillLeave() {
    if (this.bindcard){
      this.event.publish("bindCard",this.card);
    }else{
      this.event.publish("bindCardFail",null);
    }

  }

  //返回上一页
  goback(){   
    this.navCtrl.pop()
  }

}
