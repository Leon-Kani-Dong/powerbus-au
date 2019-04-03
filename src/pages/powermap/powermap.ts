import { Component , ViewChild, ElementRef, ComponentFactoryResolver} from '@angular/core';
import { Events,IonicPage, NavController, NavParams, AlertController,LoadingController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { OrderhistoryPage } from '../orderhistory/orderhistory'; //订单记录
import { ClickBlock } from 'ionic-angular/umd/components/app/click-block';
import { PhoneloginPage } from '../phonelogin/phonelogin';//登录界面
import { StorelistPage} from '../storelist/storelist'; //店铺列表
import { WalletPage} from '../wallet/wallet'; //钱包
import { RentPage } from '../rent/rent'; //租借界面
import { ReturnPage} from '../return/return'; //返还界面
import { ShopServiceProvider } from '../../providers/shop-service/shop-service'; 
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Platform } from 'ionic-angular';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import * as MarkerClusterer from 'node-js-marker-clusterer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Cordova } from '@ionic-native/core';
import { LoginServiceProvider } from '../../providers/login-service/login-service'; 
import { ScanPage} from '../scan/scan';
import { UtilityFunctions } from '../../providers/utilities/UtilityFunctions';
import { RentServiceProvider } from '../../providers/rent-service/rent-service'
import {Md5} from "ts-md5/dist/md5";
import { PayServiceProvider } from '../../providers/pay-service/pay-service';
import {AddcardPage} from '../addcard/addcard';
import { LoginPage } from '../login/login';
/**
 * Generated class for the PowermapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */




 //Google map
declare var google;
declare const AMap: any;//声明
declare let window: any;
@IonicPage()

@Component({
  selector: 'page-powermap',
  templateUrl: 'powermap.html',
})

export class PowermapPage {
  startANewCharge:any=false;
  homebuttondisable:any=false;
  usingbuttondisable:any=false;
  returnbuttondisable:any=false;
  spinner_display:any='none';
  spinner_display_using:any='none';
  spinner_display_return:any='none';
  homebuttoncontent:any='START CHARGING';
  returnbuttoncontent:any='START A NEW CHARGE';
  usingbuttoncontent:any='RETURN NOW';
  timer:any;
  updated_serial:any;
  current_serial:any;
  current_serial_3:any;
  current_serial_2:any;
  current_serial_1:any;
  current_time:any;
  current_bankId:any;
  current_bank:any;
  current_shopId:any;
  current_transcationId:any;
  current_transcation:any;
  left_time:any;
  card:any;
  password:any;
  choosed_plan:any=1;
  user:any;
  balance:any=0;
  homeButtonType:any="0";
  shop_number:any=0;
  current_info_window:any;
  current_direction:any;
  markers_array:any[]=new Array;
  myLocationMarker:any;
  userPosition:any;
  center_marker:any;
  map:any;
  loading: any;
  options : GeolocationOptions;
  currentPos : Geoposition;
  shops:any;
  current_shop_name:any;
  adHide = true;//初始化默认广告栏 ngif=false；
  version:any;
  TOKEN:any;
  ID:any;
  VERSIONID = "3";
  SECRET="pwpb041901";
  AMOUNT=1000;
  //googlemap
  @ViewChild('map') mapElement: ElementRef;
    // map: any;

  constructor(private payService : PayServiceProvider,public rentService: RentServiceProvider,public event:Events,private loginService:LoginServiceProvider,private call: CallNumber,private iap: InAppBrowser,public alerCtrl: AlertController,public loadingCtrl: LoadingController, private openNativeSettings :OpenNativeSettings ,private diagnostic: Diagnostic,
    public platform: Platform,public geolocation: Geolocation,public shopService:ShopServiceProvider,public storage: Storage,public navCtrl: NavController,navParams: NavParams) {
    this.TOKEN=navParams.get("TOKEN");
    this.ID=navParams.get("ID");
    this.userPosition={
      lat: -33.9,
      lng:151
    };
    //this.getUserPosition();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PowermapPage');
    //google map
    this.checkLocation();
    this.checkVersion();
    this.initMap();
    this.getShops();
    this.listenEnterCode();
    this.listenScan();
    this.listenBalance();
    this.getUser();
   // this.nativeCall()

  }


  //chat
  chat(){
    this.showLoader();
    let conversationObject = {
      'appId' : '497d868eb7cddfee9c2fe65acc60e0a',
      'withPreChat' : false,
      'isUnique' : true,
      'agentIds' : ['hyc_gotz@pwrbus.com'], //AGENT_ID is the email id used to signup on kommunicate dashboard
    }
    kommunicate.startSingleChat(conversationObject, (response) => {
      this.loading.dismiss();
      console.log("Test Success response : " + response);
      }, (response) =>{
        this.loading.dismiss();
            console.log("Test Failure response : " + response);
      });
  }




  startNewCharge(){
    let confirm = this.alerCtrl.create({
      title: 'START A NEW CHARGE?',
      buttons: [
        {
          text: 'NO',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'YES',
          handler: () => {
            // console.log('Agree clicked');
            //this.showFinishDiv();
            this.usingbuttoncontent="";
            this.usingbuttondisable=true;
            this.spinner_display_using="block";
            this.stopTimerForLeftTime(this);
            this.startANewCharge=true;
            this.updateTranscation(this.current_transcationId);
            //this.updateFreePowerbank(this.current_shopId,'increase');
          }
        }
      ]
    });
    confirm.present()
  }


  showLoader(){
 
    this.loading = this.loadingCtrl.create({
        content: 'LOADING...'
    });

    this.loading.present();

  }







  //close plan selecting and device-id inputing pop
  closeRentPop(){
    document.getElementById("enterCode").style.display="none";
    document.getElementById("selectPlan").style.display="none";
    this.current_bankId=null;
    this.homeButtonType='0';
    this.homebuttoncontent="START CHARGING";
  }




  //autocharge
  autocharge(){
    console.log('start to Autocharge card');
    this.payService.chargeCard({"customer_id":this.card.payment_customer_id,"source":null,"amount":this.AMOUNT,"capture":true}).subscribe(
      (result)=>{
        console.log(result)
        this.postCharging(result);
        this.updateBalanceforCharge();
      },
      (error)=>{
        console.log(JSON.stringify(error));
        this.homebuttondisable=false;
        this.spinner_display="none";
        this.homebuttoncontent="CONFIRM PAYMENT";
        this.presentAlert("cannot auto-charge your card !","","OK");
      }
    )
  }
  postCharging(data){
    this.payService.postCharging({"user":this.ID,"time":new UtilityFunctions().getNowFormatDate(),"charge_id":data.id,"amount":this.AMOUNT},
      this.ID,this.TOKEN.type,this.TOKEN.token
    ).subscribe(
      (result)=>{
        console.log('post charging result',result)
      },
      (error)=>{
        console.log(JSON.stringify(error));
        this.presentAlert("cannot post charging record!","","OK");
      }
    )
  }
  updateBalanceforCharge(){
    var updatedBalance=(this.user.balance==null)?0+this.AMOUNT:this.user.balance+this.AMOUNT
    console.log(updatedBalance,'updatedBalance')
    this.loginService.patchUser({"balance":updatedBalance},this.TOKEN.type,this.TOKEN.token,this.ID,).subscribe(
      (result:any)=>{
        console.log('updateBalanceforCharge',result);
        this.user.balance=result.balance;
        this.balance=this.formatBalance(result.balance);
        this.makePayment();
      },
      (error)=>{
        console.log('error updateBalanceforCharge',error);
        this.showConfirmForUpdateBalanceforCharge();
      }
    )
  }

  showConfirmForUpdateBalanceforCharge(){
    let confirm = this.alerCtrl.create({
      title: 'Cannot update balance for charging,try again?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
            this.presentAlert("ATTENTION!","Sorry,You have been charged succeed .Howevere, the balance cannot be updated succeed ! Please Call customer service !","OK")
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // console.log('Agree clicked');
            this.updateBalanceforCharge();
          }
        }
      ]
    });
    confirm.present()
  }

  getCards(){
    this.payService.getCards(this.ID,this.TOKEN.token,this.TOKEN.type).subscribe(
      (result:any)=>{
        console.log('getcards',result)
        if (result && result.length != 0){
          this.card=result.pop();
          this.autocharge();
        }else{
          console.log('empty cards')
          //this.presentAlert("No cards available,Please go to bind first!","","OK")
          //this.listenCard();
          this.homebuttondisable=false;
          this.spinner_display="none";
          this.homebuttoncontent="CONFIRM PAYMENT";
          this.listenAutocharge();
          this.navCtrl.push(WalletPage,{TOKEN:this.TOKEN,ID:this.ID,RENTING:true});
        }
      },
      (error)=>{
        this.homebuttondisable=false;
        this.spinner_display="none";
        this.homebuttoncontent="CONFIRM PAYMENT";
        this.presentAlert("","Cannot get cards to finish charging!","OK");
        console.log("getcards http error",JSON.stringify(error))
      }
    );

  }
  listenCard(){
    this.event.subscribe('bindCard',(card)=>{
      console.log('get listen card',card);
      this.card=card;
      this.homebuttondisable=true;
      this.spinner_display="block";
      this.homebuttoncontent="";
      this.autocharge();
    })
  }

  //autocharge

  listenAutocharge(){
    this.event.subscribe('updateAutocharge',(data)=>{
      this.user.auto_recharge=data.auto_recharge;
    })
  }

  updateFreePowerbank(id,operate){
    var data={"shop_id":id,"operate":operate};
    this.shopService.updateFreepowerbank(data,this.TOKEN.token,this.TOKEN.type).subscribe(
      (result)=>{
        console.log("updateFreePowerbank",result);
      },
      (error)=>{
        console.log("updateFreePowerbank",error);
      }
    )
  }
  getUser(){
    this.loginService.getUser(this.TOKEN.type,this.TOKEN.token,this.ID).subscribe(
      (reject)=>{
        this.user=reject;
        console.log("defaultamount",this.user.vip)
        if (this.user.vip){
          this.AMOUNT=Number(this.user.vip);
        }else{
          this.AMOUNT=1000;
        }
        console.log("defaultamount",this.AMOUNT)
        this.balance=this.formatBalance(this.user.balance);
        if(this.user.borrow_status!='0'&&this.user.borrow_status!='4'){
          this.getTranscation(this.user.borrow_status);
        }
      },
      (error)=>{
        this.presentAlert("","Cannot get your info from database!","OK");
        console.log(error);
      }
    )
  }
  getTranscation(id){
    this.rentService.getTranscation(id,this.TOKEN.token,this.TOKEN.type).subscribe(
      (result:any)=>{
        console.log(result);
        this.current_transcation=result;
        this.current_transcationId=result.id;
        this.choosed_plan=result.plan;
        this.current_serial=result.serial;
        this.current_bankId=result.powerBank;
        this.current_shop_name=result.borrow_shop;
        this.current_shopId=Number(result.tender_id);
        this.password=this.createPassword(this.choosed_plan,this.SECRET,
          this.current_bankId,this.current_serial);
        this.showUsingDiv();
      },
      (error)=>{
        this.presentAlert("","Cannot get transcation!","OK");
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
  choosePlan(hour){
    if(hour=='1'){
      this.choosed_plan=1;
      this.current_serial=this.current_serial_1;
    }else if(hour=='2'){
      this.choosed_plan=2;
      this.current_serial=this.current_serial_2;
    }else if(hour=='3'){
      this.choosed_plan=3;
      this.current_serial=this.current_serial_3;    
    }

    this.checkBalanceIfEnough();
  }



  listenBalance(){
    this.event.subscribe('updateBalance',(balance)=>{
      this.balance=this.formatBalance(balance.b);
      this.user.balance=balance;
      if(balance.renting){
        this.homeButtonType="3";
        this.homebuttondisable=false;
        this.homebuttoncontent="CONFIRM PAYMENT";
      }
    })
  }
  //start to show enter device idCode DIV
  listenEnterCode(){
    this.event.subscribe('enterCode',(result:any)=>{
      if (result.enableEnterCode==true){
        document.getElementById("enterCode").style.display="block";
        //document.getElementById("homePageButton").innerHTML="Confirm";
        this.homebuttoncontent="CONFIRM";
        this.homeButtonType="1";
      }
    })
  }
  listenScan(){
    this.event.subscribe('scanSuccess',(result:any)=>{
      var re = new RegExp('^190[0-9][0-9][0-9][0-9][0-9]$');
      if (re.test(result.dev_id)){
        this.current_bankId=result.dev_id;
        this.getPowerbank();
      }else{
        this.presentAlert("UNKNOWN QRCODE" ,"","OK");
      }
    })
  }
  showUpdateConfirm(){
    const confirm = this.alerCtrl.create({
      title: 'New Version Available',
      message: 'There is a newer version available for download. Please update the app through the Apple Store or Play Store.',
      buttons: [        
        {
          text: 'Update',
          handler: () => {
            const browser = this.iap.create("https://pwrbus.com", '_system');
            browser.show();
          }
        }
      ]
    });
    confirm.present();
  }
  homePageButton(type){
    if(type=="0"){
      if (this.user.borrow_status=='5'){
        this.presentAlert("","You still got an unfinished transaction","OK")
      }else if(this.version!=null&&document.getElementById("div_version").innerHTML<this.version){
        this.showUpdateConfirm();
      }else{
        this.gotoScanPage();
      }
    }else if(type=="1"){
      this.getPowerbank()//check if powerbank exist in server
    }else if(type=="2"){
      //document.getElementById("homePageButton").innerHTML="Please select your plan";  
      this.homebuttoncontent="PLEASE SELECT YOUR PLAN";
    }else if(type=="3"){
      this.initPayment();
    }else if(type=="4"){
      this.gowalletRenting();
    }else if(type=="5"){
      //do nothing
    }else if(type=="6"){
      document.getElementById("finish").style.display="none";
    }
  }
  initPayment(){
    this.showButtonSpinner();
    this.password=this.createPassword(this.choosed_plan,this.SECRET,
      this.current_bankId,this.current_serial);
    this.postTranscation();
  }
  finishRenting(){
    this.returnbuttoncontent="";
    this.returnbuttondisable=true;
    this.spinner_display_return="block";
    this.updateTranscation(this.current_transcationId);
    //document.getElementById("homePageButton").innerHTML="Start Charging";  
  }
  to2digits(num){
    var numberStr = num.toString();
    if(numberStr.length < 2){
      return '0' + numberStr;
    }else{
      return numberStr;
    }
  }

  hexStringToByte(str) {
    if (!str) {
      return new Uint8Array([]);
    }
    var a = [];
    for (var i = 0, len = str.length; i < len; i+=2) {
      a.push(parseInt(str.substr(i,2),16));
    }
    return new Uint8Array(a);
  }

  createPassword(plan,secret,dev_id,serial){
    if (serial==null){
      serial='01'
    }
    var pd_String=String(secret)+String(dev_id)+String(serial);
    var h=Md5.hashStr(pd_String)
    var b=this.hexStringToByte(h);
    var p2=(b[14] & 0x03)+1;
    var p3=((b[15]>>6)&0x03)+1;
    var p4=((b[15]>>4)&0x03)+1;
    var p5=((b[15]>>2)&0x03)+1;
    var p6=(b[15]&0x03)+1;
    var p1=(Number(plan)+4-((p2+p3+p4+p5+p6)%4))%4+1
    //check which hour it belong to
    var plan_from_password=(p2+p3+p4+p5+p6)%4;
    if(plan_from_password==0){
      plan_from_password=1;
    } 
    if(plan_from_password!=plan){
      console.log(String(p1)+String(p2)+String(p3)+String(p4)+String(p5)+String(p6));
      this.getUpdatedSerial();
      this.current_serial=this.updated_serial;
      return this.createPassword(plan,secret,dev_id,this.current_serial);
    }else{
      console.log(String(p1)+String(p2)+String(p3)+String(p4)+String(p5)+String(p6));
      return String(p1)+String(p2)+String(p3)+String(p4)+String(p5)+String(p6);
    }
  }

  checkBalanceIfEnough(){
    console.log(this.user.auto_recharge);
    if(this.balance>=this.choosed_plan){
      this.homeButtonType="3";
      this.homebuttoncontent="CONFIRM PAYMENT";
      //document.getElementById("homePageButton").innerHTML="Confirm Payment";  
    }else if(this.user.auto_recharge){//if auto charge toggled
      this.homeButtonType="3";
      this.homebuttoncontent="CONFIRM PAYMENT";
      //document.getElementById("homePageButton").innerHTML="Confirm Payment";  
    }else{
      this.homeButtonType="4";
      this.homebuttoncontent="TOP UP";
      //document.getElementById("homePageButton").innerHTML="Top Up";
    }
  }
  showButtonSpinner(){
    this.homebuttondisable=true;
    this.spinner_display="block";
    this.homebuttoncontent="";
  }
  showButtonContent(content){
    this.homebuttondisable=false;
    this.spinner_display="none";
    this.homebuttoncontent=content;
  }
  goBackToHome(){
    this.returnbuttoncontent="START A NEW CHARGE";
    this.returnbuttondisable=false;
    this.spinner_display_return="none";
    this.usingbuttoncontent="RETURN NOW";
    this.usingbuttondisable=false;
    this.spinner_display_using="none";
    document.getElementById("using").style.display="none";
    document.getElementById("finish").style.display="none";
    this.current_bankId=null;
    this.homeButtonType='0';
    this.homebuttondisable=false;
    this.spinner_display="none";
    this.homebuttoncontent="START CHARGING";
    document.getElementById("using").style.display="none";
    document.getElementById("finish").style.display="none";
    document.getElementById("selectPlan").style.display="none";
    document.getElementById("enterCode").style.display="none";
  }
  makePayment(){
    this.homebuttondisable=true;
    this.spinner_display="block";
    this.homebuttoncontent="";
    if(this.balance>=this.choosed_plan){  
      var balance=this.balance-this.choosed_plan;
      this.updateBalance(balance*100);
    }else{
      this.getCards();
    }
  }
  updateBalance(balance){
    console.log(balance,'updatedBalance')
    this.loginService.patchUser({"balance":balance},this.TOKEN.type,this.TOKEN.token,this.ID,).subscribe(
      (result)=>{
        this.balance=this.balance-this.choosed_plan;
        console.log(result)
        this.showUsingDiv();
        //this.updateFreePowerbank(this.current_bank.shop,'decrease')
        //this.loading.dismiss();
      },
      (error)=>{
        this.showConfirmForUpdateBalance(balance);
        console.log(error)
      }
    )
  }
  showConfirmForUpdateBalance(balance){
    let confirm = this.alerCtrl.create({
      title: 'Cannot update balance,try again?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.updateUserStatus("4");
            this.goBackToHome();
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // console.log('Agree clicked');
            this.updateBalance(balance);
          }
        }
      ]
    });
    confirm.present()
  }
  getPowerbank(){
    this.homebuttondisable=true;
    this.spinner_display="block";
    this.homebuttoncontent="";
    this.rentService.getPowerbank(this.current_bankId,this.TOKEN.token,this.TOKEN.type).subscribe(
      (result:any)=>{
        this.homebuttondisable=false;
        this.spinner_display="none";
        this.homebuttoncontent="CONFIRM";
        console.log(result)
        this.current_bank=result;
        this.current_shop_name=result.shop_name;
        this.current_serial_3=result.current_serial_3;
        this.current_serial_2=result.current_serial_2;
        this.current_serial_1=result.current_serial
        if (result.status=='1'){
          this.showPlanDiv();// if bank exists, show plan selecting divthis.showPlanDiv();
        }else if(result.status=='3'){
          this.presentAlert("WARNING","This powerbank is currently out of service. Please use another one.","OK")
        }
      },
      (error)=>{
        this.homebuttondisable=false;
        this.spinner_display="none";
        this.homebuttoncontent="CONFIRM";
        console.log(error);
        this.presentAlert("","Cannot get the device ID from server" + status,"OK")
      }
    )
  }
  updatePowerbankSerial(serial){
    var data;
    if (this.choosed_plan==1){
      data={"current_serial":serial}
    }else if(this.choosed_plan==2){
      data={"current_serial_2":serial}
    }else if(this.choosed_plan==3){
      data={"current_serial_3":serial}
    }
    this.rentService.patchPowerbank(data,this.current_bankId,this.TOKEN.token,this.TOKEN.type).subscribe(
      (result)=>{
        this.makePayment();
        console.log(result)
      },
      (error)=>{
        this.showConfirmForPassword();
        console.log(error);
      }
    )
  }
  updateUserStatus(status){
    this.loginService.patchUser({"borrow_status":status},this.TOKEN.type,this.TOKEN.token,this.ID,).subscribe(
      (result)=>{
        console.log(result);
        this.user.borrow_status=status;
        if(status=="0"){
          if(this.startANewCharge){
            this.returnbuttoncontent="START A NEW CHARGE";
            this.returnbuttondisable=false;
            this.spinner_display_return="none";
            this.usingbuttoncontent="RETURN NOW";
            this.usingbuttondisable=false;
            this.spinner_display_using="none";
            document.getElementById("using").style.display="none";
            document.getElementById("finish").style.display="none";
            this.current_bankId=null;
            this.homeButtonType='0';
            this.homebuttondisable=false;
            this.spinner_display="none";
            this.homebuttoncontent="START CHARGING";
            this.startANewCharge=false;
            this.gotoScanPage();
          }else{
            this.returnbuttoncontent="START A NEW CHARGE";
            this.returnbuttondisable=false;
            this.spinner_display_return="none";
            this.usingbuttoncontent="RETURN NOW";
            this.usingbuttondisable=false;
            this.spinner_display_using="none";
            document.getElementById("using").style.display="none";
            document.getElementById("finish").style.display="none";
            this.current_bankId=null;
            this.homeButtonType='0';
            this.homebuttondisable=false;
            this.spinner_display="none";
            this.homebuttoncontent="START CHARGING";
            this.presentAlert("THANK YOU !","","OK");
          }
        }else if(status!="4"){
          this.getUpdatedSerial();
          this.updatePowerbankSerial(this.updated_serial);
        }
        //this.loading.dismiss();
      },
      (error)=>{
        if(status=="0"){
          this.startANewCharge=false;
          this.returnbuttoncontent="START A NEW CHARGE";
          this.returnbuttondisable=false;
          this.spinner_display_return="none";
          this.usingbuttoncontent="RETURN NOW";
          this.usingbuttondisable=false;
          this.spinner_display_using="none";
          this.presentAlert("","Cannot update user's status,please click button again!","OK");
        }else if(status!="4"){
          this.showConfirmForUpdateUserStatus(status);
        }else{
          this.presentAlert("SOMETHING WRONG","Please call customer service!","OK");
        }
        console.log(error);
      }
    )
  }
  showConfirmForUpdateUserStatus(status){
    let confirm = this.alerCtrl.create({
      title: 'Cannot update user status,try again?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.updateUserStatus('4');
            this.goBackToHome();
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // console.log('Agree clicked');
            this.updateUserStatus(status);
          }
        }
      ]
    });
    confirm.present()
  }
  getLeftTime(context){
    console.log(context.current_transcation)
    let d_start = new Date(context.current_transcation.startTime);
    let d_now = new Date(new UtilityFunctions().getNowFormatDate());
    console.log(d_now,d_start);
    let currentDuration = d_now.getTime()-d_start.getTime();
    console.log(currentDuration);
    let endDuration=context.choosed_plan*1000*3600;
    let leftDuration=endDuration-currentDuration;
    let h,m,h_str,m_str;
    if (leftDuration<=0){
      h=0;
      m=0;
      context.showFinishDiv();
    }else{
      h = parseInt(String(leftDuration/1000/3600));
      m = parseInt(String(leftDuration/1000/60%60));
    }
    h_str = String(h);
    m_str= String(m);
    if(h<=9){
      h_str = "0"+h;
   }
    if(m<=9){
      m_str = "0"+m;
    } 
    console.log(h_str+"h "+m_str+"m");
    context.left_time= h_str+"h "+m_str+"m";
  }

  startTimerForLeftTime(context){
    let d_start = new Date(context.current_transcation.startTime);
    let d_now = new Date(new UtilityFunctions().getNowFormatDate());
    let currentDuration = d_now.getTime()-d_start.getTime();
    let endDuration=context.choosed_plan*1000*3600;
    let leftDuration=endDuration-currentDuration;
    let h,m,h_str,m_str;
    if (leftDuration<=0){
      context.showFinishDiv();
    }else{
      h = parseInt(String(leftDuration/1000/3600));
      m = parseInt(String(leftDuration/1000/60%60));
      h_str = String(h);
      m_str= String(m);
      if(h<=9){
        h_str = "0"+h;
      }
      if(m<=9){
        m_str = "0"+m;
      } 
      context.left_time= h_str+"h "+m_str+"m";
      context.timer=setInterval(context.getLeftTime,60000,context)
    }
  }
  stopTimerForLeftTime(context){
    if(context.timer){
      clearInterval(context.timer);
    }
  }
  returnNow(){
    let confirm = this.alerCtrl.create({
      title: 'RETURN NOW?',
      buttons: [
        {
          text: 'NO',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'YES',
          handler: () => {
            // console.log('Agree clicked');
            //this.showFinishDiv();
            this.usingbuttoncontent="";
            this.usingbuttondisable=true;
            this.spinner_display_using="block";
            this.stopTimerForLeftTime(this);
            this.updateTranscation(this.current_transcationId);
            //this.updateFreePowerbank(this.current_shopId,'increase');
          }
        }
      ]
    });
    confirm.present()
  }
  showFinishDiv(){
    this.stopTimerForLeftTime(this);
    //this.updateFreePowerbank(this.current_shopId,'increase');
    document.getElementById("using").style.display="none";
    document.getElementById("finish").style.display="block";
    //document.getElementById("homePageButton").innerHTML="Start a New Charge";
    this.homebuttoncontent="START A NEW CHARGE";
    this.homeButtonType="6";
  }
  showUsingDiv(){
    // this.password=this.createPassword(this.choosed_plan,this.SECRET,
    // this.current_bankId,this.current_serial);
    document.getElementById("selectPlan").style.display="none";
    document.getElementById("using").style.display="block";
    this.homebuttoncontent="RETURN NOW";
    //document.getElementById("homePageButton").innerHTML="Return Now";
    this.homeButtonType="5";
    this.startTimerForLeftTime(this);
  }
  postTranscation(){
    var data={"tender_id":String(this.current_bank.shop),"user":this.ID,"serial":this.current_serial,"plan":this.choosed_plan,"startTime":new UtilityFunctions().getNowFormatDate(),"powerBank":this.current_bank.bankid,"status":"5","borrow_shop":this.current_bank.shop_name,"amount":this.choosed_plan,};
    this.rentService.postTranscation(data,this.ID,this.TOKEN.token,this.TOKEN.type).subscribe(
      (result:any)=>{
        console.log(result);
        this.current_transcation=result;
        this.current_transcationId=result.id;
        this.updateUserStatus(result.id);
        //this.showUsingDiv();
      },
      (error)=>{
        this.showConfirmForPostTranscation();
        console.log(error);
      }
    )
  }
  showConfirmForPostTranscation(){
    let confirm = this.alerCtrl.create({
      title: 'Cannot post transcation,try again?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.goBackToHome();
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // console.log('Agree clicked');
            this.postTranscation();
          }
        }
      ]
    });
    confirm.present()
  }
  updateTranscation(id){
    var data={"return_shop":this.current_shop_name,"endTime":new UtilityFunctions().getNowFormatDate(),"status":"0"}
    this.rentService.patchTranscation(data,id,this.TOKEN.token,this.TOKEN.type).subscribe(
      (result)=>{
        console.log("patch trans result",result);
        this.updateUserStatus("0");
      },
      (error)=>{
        this.returnbuttoncontent="START A NEW CHARGE";
        this.returnbuttondisable=false;
        this.spinner_display_return="none";
        this.usingbuttoncontent="RETURN NOW";
        this.usingbuttondisable=false;
        this.spinner_display_using="none";
        this.presentAlert("","Cannot update the transcation,please click return again!","OK");
        console.log("patch trans error",JSON.stringify(error))
      }
    )
  }
  getUpdatedSerial(){
    if (this.current_serial==null){
      this.updated_serial='02'
    }else{
      var serial_num=Number(this.current_serial)+1
      if (serial_num==41){
        serial_num=1
      }
      this.updated_serial=this.to2digits(serial_num);
    }
  }
  showPlanDiv(){
    document.getElementById("enterCode").style.display="none";
    document.getElementById("selectPlan").style.display="block";
    //document.getElementById("homePageButton").innerHTML="Confirm Payment";
    this.homebuttoncontent="CONFIRM PAYMENT";
    this.homeButtonType="2"
  }

  showConfirmForPassword(){
    let confirm = this.alerCtrl.create({
      title: 'Cannot get password,try again?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.goBackToHome();
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // console.log('Agree clicked');
            this.updatePowerbankSerial(this.updated_serial);
          }
        }
      ]
    });
    confirm.present()
  }
  showConfirm2(){
    let confirm = this.alerCtrl.create({
      title: 'Refresh to get your location?',
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
            this.initMap();
          }
        }
      ]
    });
    confirm.present()
  }
  openSettings(setting:string){
    this.openNativeSettings.open(setting).then(
      val =>{
        console.log(JSON.stringify(val));
        this.showConfirm2()
      }
    ).catch(
      err =>{
        console.log(JSON.stringify(err))
      }
    )
  }

  showUpdate() {
    const confirm = this.alerCtrl.create({
      title: 'New Version Available',
      message: 'There is a newer version available for download. Please update the app through the Apple Store.',
      buttons: [        
        {
          text: 'Update',
          handler: () => {
            const browser = this.iap.create("https://pwrbus.com");
            browser.show();
          }
        }
      ]
    });
    confirm.present();
  }


  checkVersion(){
    this.loginService.getVersion(this.TOKEN.type,this.TOKEN.token).subscribe(
      (result:any)=>{
        if(result!=null){
          console.log("version:"+result);
          this.version = result.comment;
          console.log(this.version);
        }
      },
      (error)=>{
        console.log(error)
      }
    )
  }

  showConfirm(){
    let confirm = this.alerCtrl.create({
      title: 'GPS service not available',
      message: 'Do you wanna enable GPS service?',
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
            this.openSettings('locations');
          }
        }
      ]
    });
    confirm.present()
  }

  checkLocation()
  {
    this.platform.ready().then((readySource) => {
    
    this.diagnostic.isLocationEnabled().then(
    (isAvailable) => {
      if (isAvailable==false){
        this.showConfirm();
      }
    }).catch( (e) => {
      console.log(JSON.stringify(e))
    });
    });
  }


  //是否退出登录
  logout(){
    
     let confirm = this.alerCtrl.create({
      // title: '是否确认退出登录?',
      message: 'LOGOUT NOW?',
      buttons: [
        {
          text: 'NO',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'YES',
          handler: () => {
            // console.log('Agree clicked');
            this.storage.remove('powerbusToken');
            this.navCtrl.setRoot(PhoneloginPage );
          }
        }
      ]
    });
    confirm.present()
  }
  amountIn3km(shops){
    //console.log(this.userPosition.lat)
    var newShopArray=shops.filter((shop)=>{
      //console.log(this.userPosition.lat)
      return this.calculateDistance(shop.Latitude,shop.longitude,this.userPosition)<=3;
    })
    this.shop_number=newShopArray.length;
  }
  getShops(){
    this.shopService.getShops().subscribe(
      (result:any)=>{
        this.shops = result.filter((shop)=>{
          return shop.other_info!='OLD GENERATION';
        });
        this.shop_number=result.length;
        //this.getUserPosition();
        this.setMarkers(this.map);
      },
      (error)=>{
        this.presentAlert("","Cannot get shops!","OK");
        console.log(error)
      }
    )
  }
  getUserPosition(){
    this.options = {
        enableHighAccuracy : true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

        this.currentPos = pos; 
        this.shops.map((shop)=>{
          shop.distance=this.calculateDistance(shop.Latitude,shop.longitude,this.userPosition)

        })
        this.shops.sort((locationA, locationB) => {
          return locationA.distance - locationB.distance;
      });

        console.log(pos.coords.latitude);

    },(err : PositionError)=>{

        console.log("error : " + err.message);
    });
  }


  calculateDistance(lat1:number,long1:number,userLocation){
    
    let lat2=userLocation.lat;
    let long2=userLocation.lng;
    //console.log(lat2,long2)
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return Number(Math.round(dis * 100) / 100);
  }
  //租借
  gorent(){
    this.navCtrl.push(RentPage);
  }
  //归还
  goreturn(){
    this.navCtrl.push(ReturnPage);
  }
  //关闭广告
  BoxHide(){
    this.adHide=false;
  }
   //钱包
  gowallet(){
    this.listenAutocharge();
    this.navCtrl.push(WalletPage,{TOKEN:this.TOKEN,ID:this.ID,RENTING:false});
  }
  gowalletRenting(){
    this.listenAutocharge();
    this.navCtrl.push(WalletPage,{TOKEN:this.TOKEN,ID:this.ID,RENTING:true});
  }
   //店铺列表
   gostorelist(){
    this.navCtrl.push(StorelistPage);
  }
  //订单记录
  goorderhistory(){
    this.navCtrl.push(OrderhistoryPage,{TOKEN:this.TOKEN,ID:this.ID});
  };
  
  
  initMap() {

    var styledMapType = new google.maps.StyledMapType(
      [   
        {elementType: 'geometry', stylers: [{color: '#fff'}]},
        {elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#616161'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#f5f5f5'}]},
        {
          featureType: 'administrative.land_parcel', //选择地块
          elementType: 'labels.text.fill',
          stylers: [{color: '#bdbdbd'}]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{color: '#eeeeee'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#757575'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#e5e5e5'}]
        },
        {
          featureType: 'poi.park',//公园
          elementType: 'labels.text.fill',
          stylers: [{color: '#9e9e9e'}]
        },
        {
          featureType: 'road', //道路
          elementType: 'geometry',
          stylers: [{color: '#ffffff'}]
        },
        {
          featureType: 'road.arterial', //旅游景点
          elementType: 'labels.text.fill',
          stylers: [{color: '#757575'}]
        },
        {
          featureType: 'road.highway',//高速公路
          elementType: 'geometry',
          stylers: [{color: '#dadada'}]
        },
        {
          featureType: 'road.highway', 
          elementType: 'labels.text.fill',
          stylers: [{color: '#616161'}]
        },
        {
          featureType: 'road.local',//当地道路
          elementType: 'labels.text.fill',
          stylers: [{color: '#9e9e9e'}]
        },
        {
          featureType: 'transit.line',//公交线路
          elementType: 'geometry',
          stylers: [{color: '#e5e5e5'}]
        },
        {
          featureType: 'transit.station',//中转站
          elementType: 'geometry',
          stylers: [{color: '#eeeeee'}]
        },
        {
          featureType: 'water',//水体
          elementType: 'geometry',
          stylers: [{color: '#c9c9c9'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9e9e9e'}]
        }
      ],
      {name: 'Styled Map'}
    );  
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: this.userPosition,
      zoom: 16,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain','styled_map']
      }
    });
    this.getUserLocation();
    //this.setUserLocationMarker();
    this.map.mapTypes.set('styled_map', styledMapType);
    this.map.setMapTypeId('styled_map');  
    var image = {
      url: '../../assets/icon/pin.png',
      // This marker is 20 pixels wide by 32 pixels high.
      scaledSize: new google.maps.Size(20, 38),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32)
    };
    this.center_marker= new google.maps.Marker({
      map: this.map,
      position:this.map.getCenter() ,
      icon:image
    });
    this.center_marker.bindTo('position', this.map, 'center');
    // var markerCluster = new MarkerClusterer(this.map, this.markers_array,
    //   {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    /* another way to listen to center
    // this.map.addListener('drag',
    //   ()=>{
    //     this.center_marker.setPosition( this.map .getCenter() );
    //   }
    // )
    */
  

  }
  enableOrientationArrow() {

    if (window.DeviceOrientationEvent) {

        window.addEventListener('deviceorientation', (event)=> {
            var alpha = null;
            //Check for iOS property
            if (event.webkitCompassHeading) {
                alpha = event.webkitCompassHeading;
            }
            //non iOS
            else {
                alpha = event.alpha;
            }
            var locationIcon = this.myLocationMarker.get('icon');
            locationIcon.rotation = alpha;
            this.myLocationMarker.set('icon', locationIcon);
        }, false);
    }
  }







  getDirection(start_lat,start_lng,end_lat,end_lng){
    var start = new google.maps.LatLng(start_lat, start_lng);
    var end = new google.maps.LatLng(end_lat, end_lng);
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    calculateAndDisplayRoute();
    directionsDisplay.setMap(this.map);
    if (this.current_direction){
      this.current_direction.setMap(null)
      this.current_direction=directionsDisplay
    }else{
      this.current_direction=directionsDisplay
    }
    function calculateAndDisplayRoute() {
      directionsService.route({
        origin: start,
        destination: end,
        travelMode: 'WALKING'
      }, (response, status) => {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
        } else {
          this.presentAlert("","Directions request failed due to" + status,"OK")
        }
      });
    }
  
  }
  getUserLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=> {
        this.userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.setUserLocationMarker();
      }, (error) =>{
        this.presentAlert("","Cannot get your location","OK");
        console.log(error.message)
      });
    } else {
      // Browser doesn't support Geolocation
      this.presentAlert("","Cannot get your location","OK");
      console.log("Browser doesn't support Geolocation")
    }
  }
  setUserLocationMarker(){
    this.map.setCenter(this.userPosition);
    this.myLocationMarker = new google.maps.Marker({
      position:this.userPosition,
      clickable : false,
      icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            strokeColor : '#4a5b3b',
            strokeWeight : 5,
            scale: 2.5
          },
      shadow : null,
      zIndex : 999,
      title : "YOU ARE HERE",
      map : this.map
  });
  if (this.myLocationMarker!= null && this.myLocationMarker!= undefined){
    this.enableWatchPosition();
    this.enableOrientationArrow();
    //this.test()
  }
  }

  enableWatchPosition() {
    if (navigator.geolocation) {
      var  watchPositionId = navigator.geolocation.watchPosition((location)=>{
        var currentLocation = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
        this.userPosition={"lat":location.coords.latitude,"lng":location.coords.longitude}
        if (this.shops){
          this.amountIn3km(this.shops);
        }
        this.myLocationMarker.setPosition(currentLocation);
      }, handleErrorGettingLocation, {
            timeout : 30000,
            enableHighAccuracy : true,
            maximumAge : 1000
        });
    }
    function handleErrorGettingLocation(error){
      console.log(error);
    }
}

setMarkers(map){
    this.amountIn3km(this.shops);
    var image = {
      url:'../../assets/imgs/p.png',
      // This marker is 20 pixels wide by 32 pixels high.
      scaledSize: new google.maps.Size(31,33),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(0, 32)
    };
    for (let i of this.shops){
      //console.log(Number(i.latitude))
      var marker=new google.maps.Marker({
        position:{lat: Number(i.Latitude), lng:(Number(i.longitude))},
        //map: map,
        title: i.name,
        icon:image,
      });
      google.maps.event.addListener(marker, 'click', ()=> {
        var content='<h4>'+i.name+'</h4>'+'<p>'+i.address+'</p>'
        var infoWindow  = new google.maps.InfoWindow(
          { 
                  maxWidth: 300,
                  content: content
          });
        infoWindow.setPosition({lat: Number(i.Latitude), lng:(Number(i.longitude))});
        //infoWindow.setContent(i.name);
        infoWindow.open(this.map);
        if (this.current_info_window){
          this.current_info_window.close();
          this.current_info_window=infoWindow
        }else{
          this.current_info_window=infoWindow
        }
        this.map.panTo({lat: Number(i.Latitude), lng:(Number(i.longitude))})
        this.getDirection(this.userPosition.lat,this.userPosition.lng,i.Latitude,i.longitude)
      });
      // this.markers_array.push(marker);
      marker.setMap(this.map);
    }
    // var markerCluster = new MarkerClusterer(this.map, this.markers_array,
    //   {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    // , maxZoom: 18,});
  }
  back2UserPosition(){
    this.map.panTo(this.userPosition)
  }
  presentAlert(title,subtitle,button) {
    let alert = this.alerCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [button]
    });
    alert.present();
  }
  gotoScanPage(){
    this.navCtrl.push(ScanPage)  }
}
//chat
declare var kommunicate: any;
