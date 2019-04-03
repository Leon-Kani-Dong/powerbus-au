import { Component } from '@angular/core';
import { Events,AlertController,LoadingController, Loading,IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service'; 
import { CallerlocPage } from '../callerloc/callerloc'; //号码归属地界面

/**
 * Generated class for the PhoneregisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-phoneregister',
  templateUrl: 'phoneregister.html',
})
export class PhoneregisterPage {
  thirdPartytoken:any;
  loading: Loading;
  maxTime: any=60;
  timer:any;
  codeButton : any = false;
  responseData : any;
  userData = {"password": "", "email": "","country":"+61"};
  mobile={"mobile":""};
  codeButtonValue='SEND'
  constructor(public event:Events,public alert:AlertController,private nav: NavController,public loadingCtrl: LoadingController,private loginService:LoginServiceProvider,public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhoneregisterPage');
    this.thirdPartytoken=this.navParams.get("token");
    this.listenCountry();
  }
  
  publishBindMobile(id){
    var data={"status":"success","id":id};
    this.event.publish('bindMobile',data);
  }
  bindMobile(data){
    this.loginService.bindMobile(data,'Bearer',this.thirdPartytoken).subscribe(
      (result)=>{},
      (error)=>{}
    )
  }
  bind(){
    this.showLoader('Binding...');
    var data = {"mobile": "", "code": ""};
    let number;
    if(this.userData.email.charAt(0)=="0"){
      number = this.userData.email.substring(1);
    }else{
      number= this.userData.email;
    }
    data.mobile=this.userData.country+number;
    data.code=this.userData.password;
    this.loginService.bindMobile(data,'Bearer',this.thirdPartytoken).subscribe((result) => {
      this.responseData = result;
      if(this.responseData){
        console.log(typeof(this.responseData))
        this.publishBindMobile(this.responseData.id);
        this.loading.dismiss();
        this.nav.pop();
        //this.nav.setRoot( PowermapPage,{TOKEN:{'token':this.token},ID:this.ID});
      }
      else{ console.log("User already exists"); }
   }, (err) => {
    this.presentAlert("","wrong password,try again","Ok")
     this.loading.dismiss();
     // Error log
    });
  }


   //get sms code
   createCode(){
    this.showLoader('Sending...');
    this.StartTimer();
    let number;
    if(this.userData.email.charAt(0)=="0"){
      number = this.userData.email.substring(1);
    }else{
      number= this.userData.email;
    }
    this.loginService.createCode({"mobile":this.userData.country+number}).subscribe(
    (val) => {
        console.log(val);
        this.loading.dismiss();
        if (val==undefined){
          //this.loading.dismiss();
          this.presentAlert("","cannot send sms,please try again!","Ok")
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

  gocallerloc(){
    this.nav.push(CallerlocPage)
  }
  showLoader(words){
 
    this.loading = this.loadingCtrl.create({
        content: words
    });

    this.loading.present();

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
  presentAlert(title,subtitle,button) {
    let alert = this.alert.create({
      title: title,
      subTitle: subtitle,
      buttons: [button]
    });
    alert.present();
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
  goback(){
    this.nav.pop();
  }
}
