import { Component } from '@angular/core';
import { LoadingController,IonicPage, NavController, NavParams, Loading,AlertController} from 'ionic-angular';
import { PayServiceProvider } from '../../providers/pay-service/pay-service';
import { Events } from 'ionic-angular';
import { UtilityFunctions } from '../../providers/utilities/UtilityFunctions';
import { LoginServiceProvider } from '../../providers/login-service/login-service'; 
import {AddcardPage} from '../addcard/addcard';
/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  loading:Loading;
  card:any={"last_4":'1234','id':null};
  TOKEN:any;
  ID:any;
  image_src:any;
  AMOUNT:any;
  USER:any;
  RENTING:any;
  constructor(public alerCtrl: AlertController,public event:Events,private loginService:LoginServiceProvider,private alertCtrl: AlertController,public loadingCtrl: LoadingController,private payService : PayServiceProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.TOKEN=navParams.get("TOKEN");
    this.ID=navParams.get("ID");
    this.AMOUNT=navParams.get("CHARGEAMOUNT");
    this.USER=navParams.get("USER");
    this.RENTING=navParams.get("RENTING");
    this.listenCard();
    this.getCards();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
    console.log('ionViewDidLoad PaymentPage,',this.AMOUNT);
  }
  presentAlert(title,subtitle,button) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [button]
    });
    alert.present();
  }
  chargeCard(){
    this.showLoader('CHARGING...');
    console.log('start to charge card');
    this.payService.chargeCard({"customer_id":this.card.payment_customer_id,"source":null,"amount":this.AMOUNT,"capture":true}).subscribe(
      (result)=>{
        console.log(result)
        this.postCharging(result);
        this.updateBalance();
      },
      (error)=>{
        this.loading.dismiss();
        this.presentAlert("","Cannot finish charging !","OK");
        console.log(JSON.stringify(error));
      }
    )
  }
  postCharging(result){
    this.payService.postCharging({"user":this.ID,"time":new UtilityFunctions().getNowFormatDate(),"charge_id":result.id,"amount":this.AMOUNT},
      this.ID,this.TOKEN.type,this.TOKEN.token
    ).subscribe(
      (result)=>{
        console.log(result)
      },
      (error)=>{
        this.loading.dismiss();
        this.presentAlert("","Cannot post charging !","OK");
        console.log(error)
      }
    )
  }
  publishUpdateBalance(balance){
    this.event.publish('updateBalance',balance);
  }

  updateBalance(){
    var updatedBalance=(this.USER.balance==null)?0+this.AMOUNT:this.USER.balance+this.AMOUNT
    console.log(updatedBalance,'updatedBalance')
    this.loginService.patchUser({"balance":updatedBalance,"vip":String(this.AMOUNT)},this.TOKEN.type,this.TOKEN.token,this.ID,).subscribe(
      (result:any)=>{
        console.log(result)
        this.event.publish('updateBalance',{"b":result.balance,"renting":this.RENTING});
        this.loading.dismiss();
        this.presentAlert("","CHARGED SUCCEED","OK");
        if(this.RENTING){
          this.navCtrl.popToRoot();
        }
      },
      (error)=>{
        this.loading.dismiss();
        this.showConfirmForUpdateBalance();
        console.log(JSON.stringify(error));
      }
    )
  }
  showConfirmForUpdateBalance(){
    let confirm = this.alerCtrl.create({
      title: 'Cannot  update balance,you have to click "Yes" to try again!',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.presentAlert("ATTENTION!","Sorry,You have been charged succeed .Howevere, the balance cannot be updated succeed ! Please Call customer service !","OK");
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // console.log('Agree clicked');
            this.updateBalance();
          }
        }
      ]
    });
    confirm.present()
  }
  getCard(){
    console.log('start to get specific card')
    this.payService.getCard(this.card.id,this.TOKEN.token,this.TOKEN.type).subscribe(
      (result)=>{console.log(result)},
      (error)=>{console.log(error)}
    )
  }
  showConfirm(){
    let confirm = this.alerCtrl.create({
      title: 'Delete successfully',
      message: 'Do you wanna bind another card now?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // console.log('Agree clicked');
            this.listenCard();
            this.navCtrl.push(AddcardPage,{TOKEN:this.TOKEN,ID:this.ID});
          }
        }
      ]
    });
    confirm.present()
  }
  listenCard(){
    this.event.subscribe('bindCard',(card)=>{
      console.log('get listen card',JSON.stringify(card));
      document.getElementById("havecard").style.visibility = "visible";
      document.getElementById('nocard').style.display="none";
      this.card=card;
      if (this.card.card_brand == 'Visa'){
        this.image_src='../../assets/imgs/ionic-06.png'
      }else if(this.card.card_brand == 'MasterCard'){
        this.image_src='../../assets/imgs/mastercard.png'
      }
    })
  }
  deleteCard(){
    this.showLoader('DELETING...');
    console.log('start to delete card')
    console.log(this.ID,this.TOKEN.token,this.TOKEN.type,this.card.id)
    this.payService.deleteCard(this.ID,this.TOKEN.token,this.TOKEN.type,this.card.id).subscribe(
      (result)=>{
        console.log('delectcard result',result);
        this.loading.dismiss();
        this.showConfirm();
        document.getElementById("havecard").style.visibility = "hidden";
        document.getElementById('nocard').style.display="block";
      },
      (error)=>{
        this.loading.dismiss();
        this.presentAlert('Fail','cannot delete card,try again .','OK')
        //alert('cannot delete card,try again .')
        console.log('delectcard error',error);
      }
    )
  }

  getCards(){
    this.showLoader('LOADING...');
    this.payService.getCards(this.ID,this.TOKEN.token,this.TOKEN.type).subscribe(
      (result:any)=>{
        console.log('getcards',result)
        if (result && result.length != 0){
          this.card=result.pop();
          if (this.card.card_brand == 'Visa'){
            this.image_src='../../assets/imgs/ionic-06.png'
          }else if(this.card.card_brand == 'MasterCard'){
            this.image_src='../../assets/imgs/mastercard.png'
          }
          this.loading.dismiss();
        }else{
          this.loading.dismiss();
          console.log('empty cards')
          document.getElementById('nocard').style.display="block";
          document.getElementById("havecard").style.visibility = "hidden";
          this.navCtrl.push(AddcardPage,{TOKEN:this.TOKEN,ID:this.ID});
        }
      },
      (error)=>{
        this.loading.dismiss();
        this.presentAlert('Fail','cannot get card,try again .','OK')
        console.log("getcards http error",JSON.stringify(error))
      }
    );

  }
 //loading window
  showLoader(words){
 
    this.loading = this.loadingCtrl.create({
        content: words
    });

    this.loading.present();

  }
  //返回上一页
  goback(){
    this.event.unsubscribe('bindCard') ;
    this.navCtrl.pop()
  }

}
