import { Component } from '@angular/core';
import { Events,AlertController,LoadingController, Loading,IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//引入地图页面
import { WalletPage} from '../wallet/wallet'; //钱包
import { PowermapPage } from '../powermap/powermap';
import {AddcardPage} from '../../pages/addcard/addcard';
import {PaymentPage} from  '../../pages/payment/payment'
import { CallerlocPage } from '../callerloc/callerloc'; //号码归属地界面
import { LoginServiceProvider } from '../../providers/login-service/login-service'; 
import { OrderfeedbackPage } from '../orderfeedback/orderfeedback'; 
/**
 * Generated class for the PhoneloginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-phonelogin',
  templateUrl: 'phonelogin.html',
})
export class PhoneloginPage {
  ad_base64:any;
  loading: Loading;
  codeButton : any = false;
  responseData : any;
  userData = {"password": "", "email": "","country":"+61"};
  mobile={"mobile":""};
  codeButtonValue='SEND'
  timerads = "3";
  maxTime: any=60;
  maxAds: any = 3;
  timer: any;
  token:any;
  ID:any;
  constructor(public event:Events,public alert:AlertController,private nav: NavController,public storage: Storage,public loadingCtrl: LoadingController,private loginService:LoginServiceProvider,public navCtrl: NavController, public navParams: NavParams) {
  }
  presentAlert(title,subtitle,button) {
    let alert = this.alert.create({
      title: title,
      subTitle: subtitle,
      buttons: [button]
    });
    alert.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PhoneloginPage');
    if (!navigator.onLine) {
      this.presentAlert("no internet","","OK")
      }
    this.initLogin();
    this.listenCountry();
  }
  listenCountry(){
    this.event.subscribe("selectCountry",(value)=>{
      this.userData.country=value
      if (value=="+86"){
        document.getElementById("countryname").innerText="China +86";
      }else if(value=="+61"){
        document.getElementById("countryname").innerText="Australia +61";
      }
    })
  }
  initAds(){
    this.loginService.getAds().subscribe(
      (result:any)=>{
        if (result){
          console.log(result.id)
          //let image = new Image();
          //image.src 
          //var src= String(result.image.replace("data:image/jpeg;base64,", ""));
          document.getElementById("img_ads").setAttribute("src", result.image);
          console.log(result)
          this.StartAds();
        }
      },
      (error)=>{
        console.log(error);
        this.initLogin();
      }
    )
  }

  //login automaticlly
  initLogin(){
    this.storage.get('powerbusToken').then((token) => {//auto login check
      // document.getElementById("ic_time").style.visibility = "hidden";
      // document.getElementById("img_ads").remove();
      console.log('saved token',token)
      if(typeof(token) == 'string'){
        console.log(token);
        var data=JSON.parse(token)
        if (data.type=="JWT"){
          var postData={"token":data.token}
          this.loginService.refreshToken(postData).subscribe((result) => {
            this.responseData = result;
            if(this.responseData){
              console.log(typeof(this.responseData))
              this.storage.set('powerbusToken', JSON.stringify({"type":"JWT","token":this.responseData.token}));
              this.token=this.responseData.token;
              this.getID('JWT');
            }
            else{ 
              console.log('no result')
              document.getElementById("div_login_phone").style.visibility = "visible"; 
              document.getElementById("protocol_phone").style.visibility = "visible"; 
            }
          }, (err) => {
            // Error log
            console.log('refresh token error')
            document.getElementById("div_login_phone").style.visibility = "visible";
            document.getElementById("protocol_phone").style.visibility = "visible"; 
          });
        }else{
          console.log('no token stored haha')
          document.getElementById("div_login_phone").style.visibility = "visible";
          document.getElementById("protocol_phone").style.visibility = "visible"; 
          // this.loading.dismiss();
        }
      } else {
        console.log('no token stored')
        document.getElementById("div_login_phone").style.visibility = "visible";
        document.getElementById("protocol_phone").style.visibility = "visible"; 
          // this.loading.dismiss();
      }
    });
  }

  openProtocol(type){
    if(type=='1'){
      window.open("https://pwrbus.com/protocol-service",'_system', 'location=yes');
      //window.open("http://192.168.1.119:8000/chat",'_blank', 'location=yes');
    }else if(type=='2'){
      window.open("https://pwrbus.com/protocol-use",'_system', 'location=yes');
    }
  }

  //timer
  StartTimer(){
    this.timer = setTimeout(x => 
      {   //this.loading.dismiss();
          if(this.maxTime <= 0) { }
          this.maxTime -= 1;
          
          if(this.maxTime>0){
            this.codeButton= true;
            this.codeButtonValue=this.maxTime;
            this.StartTimer();
          }
          
          else{
            this.maxTime=60;
            this.codeButtonValue='SEND'
              this.codeButton = false;
          }

      }, 1000);
  }
  //get user id
  getID(token_type){
    console.log('iddddddtoken',this.token)
    this.loginService.getID(token_type,this.token).subscribe(
      (result:any)=>{
        console.log('id_result',JSON.stringify(result))
        this.ID=result.id;//after get id ,nav to home page
        this.nav.setRoot(PowermapPage,{TOKEN:{'token':this.token,'type':'JWT'},ID:this.ID});
      },
      (error)=>{
        this.presentAlert("","Cannot get user id","Ok")
        console.log('id_error',JSON.stringify(error))
      }
    )
  }

  //get token
  login(){
    this.showLoader('LOGGING...');
    var data = {"password": "", "email": "","country":"+61"};
    let number;
    if(this.userData.email.charAt(0)=="0"){
      number = this.userData.email.substring(1);
    }else{
      number= this.userData.email;
    }
    data.email=this.userData.country+number;
    data.password=this.userData.password
    this.loginService.getToken(data).subscribe((result) => {
      this.responseData = result;
      if(this.responseData){
        console.log(typeof(this.responseData))
        this.storage.set('powerbusToken', JSON.stringify({"type":"JWT","token":this.responseData.token}));
        this.token=this.responseData.token;
        this.getID('JWT');
        this.loading.dismiss();
        //this.nav.setRoot( PowermapPage,{TOKEN:{'token':this.token},ID:this.ID});
      }
      else{ console.log("User already exists"); }
   }, (err) => {
    this.presentAlert("","ERROR","Ok")
     this.loading.dismiss();
     // Error log
    });
  }
  //get sms code
  createCode(){
    this.showLoader('SENDING...');
    this.StartTimer();
    let number;
    if(this.userData.email.charAt(0)=="0"){
      number = this.userData.email.substring(1);
    }else{
      number= this.userData.email;
    }
    this.loginService.createCode({"mobile":this.userData.country+number}).subscribe(
    (val) => {
        this.loading.dismiss();
        console.log(val);
        if (val==undefined){
          //this.loading.dismiss();
          this.presentAlert("","ERROR","Ok")
          this.maxTime = -1;
        }
    },
    (error)=>{
      console.log(error)
      this.loading.dismiss();
      this.presentAlert("","cannot send sms,please try again!","Ok") 
      this.maxTime = -1;
    })
  }
  //ad
  StartAds(){// timer
    this.timer = setTimeout(x => 
      {   //this.loading.dismiss();          
        this.maxAds -= 1;
          
        if(this.maxAds>=0){
          this.timerads=this.maxAds;
          this.StartAds();
        }          
        else{
          this.maxAds=3;
          this.initLogin();
          }

      }, 1000);
  }
  //loading window
  showLoader(words){
 
    this.loading = this.loadingCtrl.create({
        content: words
    });

    this.loading.present();

  }
  //跳转到首页（租借/归还）
  gopowermap(){
    this.navCtrl.push(PowermapPage);
  }
  goback(){
    this.nav.pop();
  }
  gocallerloc(){
    this.navCtrl.push(CallerlocPage)
    //this.navCtrl.push(WalletPage);
  }

}
