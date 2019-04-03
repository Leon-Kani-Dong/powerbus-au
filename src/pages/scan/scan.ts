import { Component } from '@angular/core';
import { AlertController,IonicPage, NavController, NavParams, ViewController,Events } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import {Md5} from "ts-md5/dist/md5";
/**
 * Generated class for the ScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {
  plan1_pw= new Array;
  plan2_pw= new Array;
  plan3_pw= new Array;
  dev_id:any;
  scansub:any;
  serial:any;
  serial_num=1;
  light: boolean;//判断闪光灯
  frontCamera: boolean;//判断摄像头
  isShow: boolean = false;//控制显示背景，避免切换页面卡顿
  secret:any;
  plan:any;
  constructor(
    public event:Events,
    public alert: AlertController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private qrScanner: QRScanner,
    private viewCtrl: ViewController) {
      //默认为false
      this.light = false;
      this.frontCamera = false;
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
    //this.serial=this.to2digits(this.serial_num);
    //console.log(this.afterGetContent("http://pwrbus.com/pwpb1234/19012000"))
    //this.afterGetContent("http://pwrbus.com/pwpb1234/19012000")
    //this.presentAlert("text",this.afterGetContent("http://pwrbus.com/pwpb1234/19012000"),"ok")
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          // start scanning
            this.scansub = this.qrScanner.scan().subscribe((text: string) => {
              //this.presentAlert("text",text,"ok")
            this.afterGetContent(text);
            this.qrScanner.hide(); // hide camera preview
            this.scansub.unsubscribe(); // stop scanning
            this.navCtrl.pop();
          });

          // show camera preview
          this.qrScanner.show();

          // wait for user to scan something, then the observable callback will be called
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }
  afterGetContent(text){
    this.dev_id=text.split('/').pop()
    this.event.publish("scanSuccess",{"dev_id":this.dev_id});
  }
  
  goback(){   
    this.navCtrl.pop()
  }

  


  ionViewDidEnter(){
    //页面可见时才执行
    this.showCamera();
    this.isShow = true;//显示背景
  }



  /**
   * 闪光灯控制，默认关闭
   */
  toggleLight() {
    if (this.light) {
      this.qrScanner.disableLight();
    } else {
      this.qrScanner.enableLight();
    }
    this.light = !this.light;
  }

  /**
   * 前后摄像头互换
   */
  toggleCamera() {
    if (this.frontCamera) {
      this.qrScanner.useBackCamera();
    } else {
      this.qrScanner.useFrontCamera();
    }
    this.frontCamera = !this.frontCamera;
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }
  hideCamera() {    
  
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
    this.qrScanner.hide();//需要关闭扫描，否则相机一直开着
    this.qrScanner.destroy();//关闭
  }

  ionViewWillLeave() {
    this.hideCamera();
  }

  gotoEnterCode(){
    this.event.publish("enterCode",{"enableEnterCode":true});
    this.navCtrl.pop();
  }
}
