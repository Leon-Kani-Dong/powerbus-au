import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController ,AlertController } from 'ionic-angular';
import { ShopServiceProvider } from '../../providers/shop-service/shop-service'; 
import { Geolocation ,GeolocationOptions ,Geoposition ,PositionError } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Platform } from 'ionic-angular';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
/**
 * Generated class for the StorelistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-storelist',
  templateUrl: 'storelist.html',
})
export class StorelistPage {
  loading: any;
  options : GeolocationOptions;
  currentPos : Geoposition;
  shops:any;
  constructor(public alerCtrl: AlertController,public loadingCtrl: LoadingController, private openNativeSettings :OpenNativeSettings ,private diagnostic: Diagnostic,
    public platform: Platform,public geolocation: Geolocation,public shopService:ShopServiceProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.getShops();
  }

  ionViewDidLoad() {
    this.checkLocation();
    this.showLoader();
    console.log('ionViewDidLoad StorelistPage');
  }
  presentAlert(title,subtitle,button) {
    let alert = this.alerCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [button]
    });
    alert.present();
  }
  showConfirm2(){
    let confirm = this.alerCtrl.create({
      title: 'Refresh to get the distance',
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
            this.getUserPosition();
          }
        }
      ]
    });
    confirm.present()
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
    console.log(JSON.stringify(e));
    });
    });
  }
  getShops(){
    this.shopService.getShops().subscribe(
      (result:any)=>{
        this.loading.dismiss();
        this.shops = result.filter((shop)=>{
          return shop.other_info!='OLD GENERATION';
        });
        this.getUserPosition();
      },
      (error)=>{
        this.loading.dismiss();
        this.presentAlert("Cannot get shops !","","OK");
        console.log(error)
      }
    )
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
  getUserPosition(){
    this.options = {
        enableHighAccuracy : true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos : Geoposition) => {

        this.currentPos = pos; 
        this.shops.map((shop)=>{
          shop.distance=this.calculateDistance(shop.Latitude,shop.longitude)

        })
        this.shops.sort((locationA, locationB) => {
          return locationA.distance - locationB.distance;
      });

        console.log(pos.coords.latitude);

    },(err : PositionError)=>{

        console.log("error : " + err.message);
    });
  }


  calculateDistance(lat1:number,long1:number){
    let lat2=this.currentPos.coords.latitude
    let long2=this.currentPos.coords.longitude
    let p = 0.017453292519943295;    // Math.PI / 180
    let c = Math.cos;
    let a = 0.5 - c((lat1-lat2) * p) / 2 + c(lat2 * p) *c((lat1) * p) * (1 - c(((long1- long2) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return Number(Math.round(dis * 100) / 100).toFixed(2);
  }
  showLoader(){
 
    this.loading = this.loadingCtrl.create({
        content: 'LOADING...'
    });

    this.loading.present();

  }
  //返回上一页
  goback(){   
    this.navCtrl.pop()
  }

}
