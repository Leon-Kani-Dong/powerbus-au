import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Url} from '../staticVariable/url';
/*
  Generated class for the LoginServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let url_object=new Url();
let url_code=url_object.URL_CODE;
let url_token=url_object.URL_MOBILE_TOKEN;
let url_refreshToken=url_object.URL_REFRESH_TOKEN;
let url_ads=url_object.URL_ADS;
let url_id=url_object.URL_USERID
let url_user=url_object.URL_USER;
let url_version=url_object.URL_VERSION;
let url_convertToken=url_object.URL_CONVERT_TOKEN;
let url_refreshConvertedToken=url_object.URL_REFRESHVONVERTEDTOKEN;
let url_bindMobile=url_object.URL_BINDMOBILE;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class LoginServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello LoginServiceProvider Provider');
  }
  createCode (data){
    return this.http.post(url_code, data, httpOptions)
  }
  getToken (data){
    return this.http.post(url_token, data ,httpOptions)
  }
  refreshToken (data){
    return this.http.post(url_refreshToken, data ,httpOptions)
  }
  getAds(){
    return this.http.get(url_ads, httpOptions)
  }
  getID(token_type,token){
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    return this.http.get(url_id,httpHeader)
  }
  getVersion(token_type,token){
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    return this.http.get(url_version, httpHeader)
  }
  getUser(token_type,token,user_id){
    var url_specific_user=url_user+user_id+'/'
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    return this.http.get(url_specific_user,httpHeader)
  }
  patchUser(data,token_type,token,user_id){
    console.log(data,'patch')
    var url_specific_user=url_user+user_id+'/'
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    return this.http.patch(url_specific_user,data,httpHeader)
  }

  convertToken(data){
    return this.http.post(url_convertToken,data,httpOptions);
  }
  refreshConvertedToken(data){
    return this.http.post(url_refreshConvertedToken,data,httpOptions);
  }
  bindMobile(data,token_type,token){
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };

    return this.http.post(url_bindMobile,data,httpHeader);
  }
}
