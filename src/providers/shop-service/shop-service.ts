
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Url} from '../staticVariable/url';
/*
  Generated class for the ShopServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
let url_object=new Url();
let url_shop=url_object.URL_STORE;
let url_updateFreePowerbank=url_object.URL_UPDATEFREEPOWERBANK;
@Injectable()
export class ShopServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ShopServiceProvider Provider');
  }
  getShops() {
    return this.http.get(url_shop,httpOptions);
  }
  patchShop(data,id,token,token_type){
    console.log(data,'patch transcation')
    var url_specific_shop=url_shop+id+'/';
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    return this.http.patch(url_specific_shop,data,httpHeader)
  }
  updateFreepowerbank(data,token,token_type){
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    return this.http.post(url_updateFreePowerbank,data,httpHeader)
  }
}
