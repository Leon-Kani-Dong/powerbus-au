import { Component, ComponentFactoryResolver } from '@angular/core';
import {Events,AlertController,LoadingController, Loading, IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginServiceProvider } from '../../providers/login-service/login-service'; 
// import { PhoneloginPage } from '../phonelogin/phonelogin';
import { Storage } from '@ionic/storage';
import { PhoneloginPage } from '../phonelogin/phonelogin';
import { Facebook,FacebookLoginResponse } from '@ionic-native/facebook';
import { PowermapPage } from '../powermap/powermap';
import { PhoneregisterPage } from '../phoneregister/phoneregister';
import { CompileMetadataResolver } from '@angular/compiler';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  CLIENT_ID="TDIqvPwo0AjsmTOA3gtC3P9dKHmU5CJlxvigsXNc";
  CLIENT_SECRET="8skJENQhESkbXeoK957odrBvjRe3SKYgz1nFTVKFegryU1h2lVT5dYodo7e8jKB4yAslQAyQWWpZ9EHdKZmwkYtRVjG0LeIzJht2z2rw7A0BqGRpwGbX9f7MsiUZo8rs";
  responseData:any;
  token:any;
  loading:Loading;
  ID:any;
  fb_token:any;
  converted_token:any;
  refresh_token:any;
  timerads = "3";
  maxTime: any=60;
  maxAds: any = 3;
  timer: any;
  constructor(public event:Events,public alert:AlertController,private nav: NavController,public storage: Storage,public loadingCtrl: LoadingController,public loginService: LoginServiceProvider,public fb: Facebook,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    //this.initAds();
    this.initLogin();
    this.listenBindMobile();
  }

  initLogin(){
    this.storage.get('powerbusToken').then((token) => {//auto login check
      // document.getElementById("ic_time").style.visibility = "hidden";
      // document.getElementById("img_ads").remove();
      console.log('saved token',token)
      if(typeof(token) == 'string'){
        console.log(token);
        var data=JSON.parse(token)
        if (data.type=="Bearer"){
          this.converted_token=data.token;
          this.refresh_token=data.refresh_token;
          this.refreshToken();
        }else if(data.type=="JWT"){
          this.Phonelogin();
        }else{
          console.log('no token stored')
          document.getElementById("div_login").style.visibility = "visible"; 
          document.getElementById("protocol").style.visibility = "visible"; 
          // this.loading.dismiss();
        }
      } else {
        console.log('no token stored')
        document.getElementById("div_login").style.visibility = "visible"; 
        document.getElementById("protocol").style.visibility = "visible"; 
          // this.loading.dismiss();
      }
    });
  }

  openProtocol(type){
    if(type=='1'){
      window.open("https://pwrbus.com/protocol-service",'_system', 'location=yes');
    }else if(type=='2'){
      window.open("https://pwrbus.com/protocol-use",'_system', 'location=yes');
    }
  }
  initAds(){
    this.loginService.getAds().subscribe(
      (result:any)=>{
        if (result){
          console.log(result.id)
          //let image = new Image();
          //image.src 
          //var src= String(result.image.replace("data:image/jpeg;base64,", ""));
          //document.getElementById("img_ads").setAttribute("src", result.image);
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
  listenBindMobile(){
    this.event.subscribe('bindMobile',(result)=>{
      if(result.status=='success'){
        if (this.loading){
          this.loading.dismiss();
        }
        this.ID=result.id;//after get id ,nav to home page
        this.nav.setRoot(PowermapPage,{TOKEN:{'token':this.converted_token,'type':'Bearer'},ID:this.ID});
      }else{
      }
    })
  }


  Phoneregister(){
    if (this.loading){
      this.loading.dismiss();
    };
    this.navCtrl.push(PhoneregisterPage,{"token":this.converted_token});
  }

  getID(token_type){
    console.log('iddddddtokenhahaha',this.converted_token)
    this.loginService.getID(token_type,this.converted_token).subscribe(
      (result:any)=>{
        console.log('id_result',JSON.stringify(result),result.no_mobile=='1')
        if(result.no_mobile){
          if(result.no_mobile=='1'){
            console.log(result.no_mobile)
            this.Phoneregister();
          }else{
            console.log(result.id)
            if (this.loading){
              this.loading.dismiss();
            }
            this.ID=result.id;//after get id ,nav to home page
            console.log(result.id,'what')
            this.nav.setRoot(PowermapPage,{TOKEN:{'token':this.converted_token,'type':'Bearer'},ID:this.ID});
          }
        }else{
          this.presentAlert("","Cannot get user id","Ok")
          if (this.loading){
            this.loading.dismiss();
          }
          console.log('id_error',JSON.stringify(result))
        }
      },
      (error)=>{
        if (this.loading){
          this.loading.dismiss();
        };
        this.presentAlert("","Cannot get user id","Ok")
        console.log('id_error',JSON.stringify(error))
      }
    )
  }

  presentAlert(title,subtitle,button) {
    let alert = this.alert.create({
      title: title,
      subTitle: subtitle,
      buttons: [button]
    });
    alert.present();
  }
  showLoader(words){
 
    this.loading = this.loadingCtrl.create({
        content: words
    });

    this.loading.present();

  }

  facebookLogin()
  {
    console.log("start fb login")
    this.showLoader('Logging...');
      // Login with permissions
      this.fb.login(['email',])
      .then( (res: FacebookLoginResponse) => {
          console.log("res",res)
          // The connection was successful
          if(res.status == "connected") {
            // Get user ID and Token
            var fb_id = res.authResponse.userID;
            this.fb_token = res.authResponse.accessToken;
            this.convertToken();
            console.log("token",this.fb_token)
            // Get user infos from the API
          }
          // An error occurred while loging-in
          else {
            console.log("An error occurred...");
            this.loading.dismiss();
            this.presentAlert("cannot login via facebook,try again","","ok")
          }
      })
      .catch((e) => {
          console.log('Error logging into Facebook', e);
          this.loading.dismiss();
          this.presentAlert("cannot login via facebook,try again","","ok")
      });
  }

  convertToken(){
    var data={"client_id":this.CLIENT_ID,"client_secret":this.CLIENT_SECRET,"grant_type":"convert_token","backend":"facebook","token":this.fb_token}
    this.loginService.convertToken(data).subscribe(
      (result:any)=>{
        this.converted_token=result.access_token;
        this.refresh_token=result.refresh_token;
        this.storage.set('powerbusToken', JSON.stringify({"type":"Bearer","token":result.access_token,"refresh_token":result.refresh_token}));
        this.getID('Bearer');
      },
      (error)=>{
        console.log(error);
        this.loading.dismiss();
        this.presentAlert("cannot convert third party token","","ok");
      }
    )
  }
  refreshToken(){
    var data={"client_id":this.CLIENT_ID,"client_secret":this.CLIENT_SECRET,"grant_type":"refresh_token","refresh_token":this.refresh_token}
    this.loginService.refreshConvertedToken(data).subscribe(
      (result:any)=>{
        this.converted_token=result.access_token;
        this.refresh_token=result.refresh_token;
        this.storage.set('powerbusToken', JSON.stringify({"type":"Bearer","token":result.access_token,"refresh_token":result.refresh_token}));
        this.getID('Bearer');
      },
      (error)=>{
        console.log(error)
        document.getElementById("div_login").style.visibility = "visible"; 
        document.getElementById("protocol").style.visibility = "visible"; 
      }
    )
  }
  Phonelogin(){
    this.navCtrl.push(PhoneloginPage);
  }
}
