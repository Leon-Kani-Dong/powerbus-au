import { Component } from '@angular/core';
import {AlertController ,IonicPage, NavController, NavParams,Events  } from 'ionic-angular';
import { PayServiceProvider } from '../../providers/pay-service/pay-service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { PaymentPage} from '../payment/payment'; //信用卡界面
import { LoginServiceProvider } from '../../providers/login-service/login-service'; 
import { AddcardPage} from '../addcard/addcard'; //绑定信用卡界面
import {Md5} from "ts-md5/dist/md5";
//import {Stripe} from '@types/stripe/index';
import { InAppBrowser } from '@ionic-native/in-app-browser';
//import { Stripe } from '@ionic-native/stripe';
/**
 * Generated class for the WalletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var Stripe;
@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  PUBLISHKEY_STRIPE="pk_live_UpNGVycQF99tNajNbAZT0oS2";
  autoCharge:any=false;
  user:any;
  balance:any=null;
  chargeAmount:any;
  TOKEN:any;
  ID:any;
  RENTING:any;
  browser:any;
  buttonContent:any="CREDIT OR DEBIT CARD";
  constructor(private iap:InAppBrowser,private payService: PayServiceProvider ,private alerCtrl:AlertController,private call: CallNumber,public event:Events,public loginService:LoginServiceProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.TOKEN=navParams.get("TOKEN");
    this.ID=navParams.get("ID");
    this.RENTING=navParams.get("RENTING");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WalletPage');
    console.log(this.autoCharge)
    this.getBalance();
    this.listenBalance();
  }

  nativeCall(){
    console.log("statenativecallhahahhahahha")
    // this.call.isCallSupported()
    // .then((response)=> {
    //     console.log("yes call")
    //     if (response == true) {
          console.log("call")
            this.call.callNumber("18001010101", true)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => console.log('Error launching dialer', err));
    //     }
    //     else {
    //       console.log('Device does not support dialer')
    //     }
    // }).catch((error)=>{console.log(JSON.stringify(error))});
  }

  presentAlert(title,subtitle,button) {
    let alert = this.alerCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [button]
    });
    alert.present();
  }
  setChargeAmount(amount){
    this.buttonContent="CREDIT OR DEBIT CARD";
    this.chargeAmount=amount;
  }
  listenBalance(){
    this.event.subscribe('updateBalance',(balance)=>{
      this.balance=this.formatBalance(balance.b);
      this.user.balance=balance.b;
    })
  }
  getBalance(){
    this.loginService.getUser(this.TOKEN.type,this.TOKEN.token,this.ID).subscribe(
      (reject)=>{
        this.user=reject;
        this.autoCharge=this.user.auto_recharge;
        this.balance=this.formatBalance(this.user.balance);
      },
      (error)=>{
        console.log(error);
      }
    )
  }
  changeAutocharge(){
    if (this.autoCharge){
      this.getCards();
    }else{
      this.updateAutoCharge(null);
    }
  }
  getCards(){
    this.payService.getCards(this.ID,this.TOKEN.token,this.TOKEN.type).subscribe(
      (result:any)=>{
        console.log('getcards',result)
        if (result && result.length != 0){
          this.updateAutoCharge(null);
        }else{
          console.log('empty cards');
          this.listenCard();
          this.listenCardFail();
          this.navCtrl.push(AddcardPage,{TOKEN:this.TOKEN,ID:this.ID,RENTING:false});
        }
      },
      (error)=>{
        this.presentAlert("","Cannot get cards!","OK");
        console.log("getcards http error",JSON.stringify(error))
      }
    );

  }
  listenCard(){
    this.event.subscribe('bindCard',(card)=>{
      this.updateAutoCharge(null);
      this.event.unsubscribe('bindCardFail');
      this.event.unsubscribe('bindCard');
    })
  }
  listenCardFail(){
    this.event.subscribe('bindCardFail',(card)=>{
      if(this.autoCharge==true){
        this.autoCharge=false;
      }else{
        this.autoCharge=true;
      }
      this.event.unsubscribe('bindCardFail');
      this.event.unsubscribe('bindCard');
    })
  } 
  updateAutoCharge(event){
    var data={"auto_recharge":this.autoCharge};
    this.loginService.patchUser(data,this.TOKEN.type,this.TOKEN.token,this.ID).subscribe(
      (reject)=>{
        console.log(reject);
        this.event.publish('updateAutocharge',data);
      },
      (error)=>{
        if(this.autoCharge==true){
          this.autoCharge=false;
        }else{
          this.autoCharge=true;
        }
        this.presentAlert("cannot change auto-recharge status,please try again","","OK")
        console.log(error);
      }
    )
  }
  formatBalance(balance){
    if (balance==null){
      return 0;
    }else{
      return balance/100;
    }

  }
  startAlipay(){
    //var stripe = Stripe(this.PUBLISHKEY_STRIPE);
    //Stripe.setPublishableKey(this.PUBLISHKEY_STRIPE);
    this.payService.alipay().subscribe(
      (result:any)=>{
        console.log(result.redirect);
        if(result){
          console.log(result.wechat.qr_code_url)
          window.open(result.wechat.qr_code_url,'_system', 'location=yes'); 
        }
      },
      (error)=>{

      }
    )

    // stripe.createSource({
    //   type: 'alipay',
    //   amount: 100,
    //   currency: 'aud',
    //   redirect: {
    //     return_url: 'https://shop.example.com/crtA6B28E1',
    //   },
    // }).then(
    //   (result)=>{
    //     console.log(JSON.stringify(result.source));
    //     if(result.source.redirect){
    //       console.log(result.source.redirect.url)
    //       window.open(result.source.redirect.url,'_system', 'location=yes'); 
    //     }
    //   },
    //   (error)=>{
    //     console.log(JSON.stringify(error));
    //   }
    // );
    
  }
  alipay(){
    var m_number="0010011229";
    var timestamp=Math.floor(Date.now());
    //var timestamp='1552260000000';
    var nonce_str="313644f42ecd4758b5e23b80e86efdc4";
    var secret_key="78f8b4c14e5a4499a4c9eb6486ae0e4f";
    var sign_string=m_number+'&'+timestamp+"&"+nonce_str+"&"+secret_key;
    var order_name="noname"
    var currency="AUD"
    var amount ="100"
    var notify_url="https://192.168.1.117:8000/handle-ali-notice"
    var return_url="https://pwrbus.com"
    var out_order_no="SEORD000001"
    var type= "wap"
    //var sign_string="123456&1482812036067&313644f42ecd4758b5e23b80e86efdc4&0af61531c6c04ac4ac910d0cd59e6238"

    var sign=Md5.hashStr(sign_string);
    console.log(timestamp);
    var sign_post=String(sign).toUpperCase()
    console.log(sign_post);
    this.payService.getAlipay(m_number,timestamp,nonce_str,sign_post,order_name
      ,currency,amount,notify_url,return_url,out_order_no,type).subscribe(
      (result:any)=>{
        console.log(JSON.stringify(result));
        if(result.pay_url){
          console.log(result.pay_url)
          window.open(result.pay_url,'_system', 'location=yes'); 
        }
      },
      (error)=>{
        console.log(error);
      }
    );
  }
  //信用卡界面
  gopayment(){
    if (this.chargeAmount){
      this.navCtrl.push(PaymentPage,{TOKEN:this.TOKEN,ID:this.ID,CHARGEAMOUNT:this.chargeAmount,USER:this.user,RENTING:this.RENTING});
    }else{
      this.buttonContent="PLEASE CHOOSE AMOUNT";
    }
  }

  //返回上一页
  goback(){   
    this.navCtrl.pop()
  }

  //绑定信用卡
  goaddcard(){
    this.navCtrl.push(AddcardPage);
  }

}
