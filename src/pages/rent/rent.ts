import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';//退出登录 确认弹窗


import { ClickBlock } from 'ionic-angular/umd/components/app/click-block';
import { PhoneloginPage } from '../phonelogin/phonelogin';//登录界面
import { StorelistPage} from '../storelist/storelist'; //店铺列表
import { WalletPage} from '../wallet/wallet'; //钱包

import { OrderhistoryPage } from '../orderhistory/orderhistory'; //订单记录

/**
 * Generated class for the RentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

  //Google map
declare var google;
declare const AMap: any;//声明

@IonicPage()
@Component({
  selector: 'page-rent',
  templateUrl: 'rent.html',
})


export class RentPage {

  priceHide = true;//初始化默认广告栏 ngif=false；

  rentHide = false;//弹出动画默认隐藏

  constructor(public navCtrl: NavController, public alerCtrl: AlertController, navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RentPage');
 

    //google map
    this.initMap();
  }

    //是否退出登录
  logout(){
      
    let confirm = this.alerCtrl.create({
    // title: '是否确认退出登录?',
    message: '是否确认退出登录?',
    buttons: [
      {
        text: '否',
        handler: () => {
          console.log('Disagree clicked');
        }
      },
      {
        text: '是',
        handler: () => {
          // console.log('Agree clicked');
          this.navCtrl.push(PhoneloginPage);
        }
      }
    ]
  });
  confirm.present()
  }

  //
  doAlert() {
    let alert = this.alerCtrl.create({
      title: 'PRICING',
      message: 
      '<div>Your friend, Obi wan Kenobi, just approved your friend request! </div>'
      
      ,
      
    });
    alert.present()
  }


  //租借时 弹出租借动画
  rentShow(){
    this.rentHide = true;
  }
  //关闭广告
  BoxHide(){
    this.priceHide=false;
  }

  //钱包
  gowallet(){
  this.navCtrl.push(WalletPage);
  }
  //店铺列表
  gostorelist(){
  this.navCtrl.push(StorelistPage);
  }
  //订单记录
  goorderhistory(){
  this.navCtrl.push(OrderhistoryPage);
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
        stylers: [{color: '#ifffff'}]
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
  var map = new google.maps.Map(document.getElementById('mapa'), {
    center: {lat: -33.868, lng: 151.2},
    zoom: 12,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain','styled_map']
    }
  });
  map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');  
    
    var marker=new google.maps.Marker({
      position:{lat: -33.868, lng: 151.2},
      icon:'../../assets/imgs/marker.png'
  
    });
    marker.setMap(map);       
  }

}


