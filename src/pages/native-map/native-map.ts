import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GoogleMaps,GoogleMap} from "@ionic-native/google-maps"
/**
 * Generated class for the NativeMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-native-map',
  templateUrl: 'native-map.html',
})
export class NativeMapPage {
  map:GoogleMap;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.loadMap();
    console.log('ionViewDidLoad NativeMapPage');
  }
  loadMap(){
    this.map=GoogleMaps.create('map_canvas');
  }
}
