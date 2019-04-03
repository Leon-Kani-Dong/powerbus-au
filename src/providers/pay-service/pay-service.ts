import { HttpClient ,HttpHeaders,HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Url} from '../staticVariable/url';
import { Observable, } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import {Http, Headers} from '@angular/http';
/*
  Generated class for the PayServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let url_object=new Url();
let url=url_object.URL_CREATE_CARD;
let url_user=url_object.URL_USER;
let url_card=url_object.URL_CARD;
let url_charge_card=url_object.URL_CHARGE_CARD;
let url_alipay=url_object.URL_ALIPAY;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':'123456'} )
};
@Injectable()
export class PayServiceProvider {
  header:any;
  ADMINTOKEN='JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxNywidXNlcm5hbWUiOiJwb3dlcmJ1c0Bwd3JidXMuY29tIiwiZXhwIjoxNTUwMjc4NTEyLCJlbWFpbCI6InBvd2VyYnVzQHB3cmJ1cy5jb20iLCJvcmlnX2lhdCI6MTU0NzY4NjUxMn0.az_zHgcLRa3gm0jWKhTE5JhPxvoIG-EdELXzLL0vBYA'
  constructor(public http: HttpClient,public httpOld:Http) {
    console.log('Hello PayServiceProvider Provider');
  }
  handleError(result?){
    return (error)=>{
      console.error('handleerror',error);
      console.log('handleerror',JSON.stringify(error));
      return of(result)
    }
  }
  chargeCard(data){
    console.log(data)
    return this.http.post(url_charge_card,data,httpOptions);
  }
  getCards(id,token,token_type){
    console.log('start get card')
    var url_user_card=url_user+id+'/cards/';
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    this.header=httpHeader
    console.log(httpHeader.headers)
    return this.http.get(url_user_card,httpHeader)
  }
  getCard(card_id,token,token_type){
    console.log('start get card')
    var url_user_card=url_card+card_id+'/';
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    this.header=httpHeader
    console.log(httpHeader.headers)
    return this.http.get(url_user_card,httpHeader)
  }
  createCard(data,id,token,token_type){
    var url_user_card=url_user+id+'/cards/'
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    console.log(url_user_card)
    return this.http.post(url_user_card,data,httpHeader)
  }
  deleteCard(id,token,token_type,card_id){
    var url_user_card=url_card+card_id+'/';
    let header: HttpHeaders = new HttpHeaders()
      header=header.append('Content-Type', 'application/json; charset=UTF-8')
      header=header.append('Authorization', token_type+' ' + token);
    const httpOptions = {
                headers: header,
            };
    return this.http.request('DELETE', url_user_card,httpOptions )
  }
  postCharging(data,id,token_type,token){
    var url_user_charging=url_user+id+'/chargings/';
    console.log(token)
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    return this.http.post(url_user_charging,data,httpHeader)
  }
  getAlipay(m_number,timestamp,nonce_str,sign,order_name
    ,currency,amount,notify_url,return_url,out_order_no,type){
    var url="https://www.omipay.com.cn/omipay/api/v2/MakeOnlineOrder";
    var headers=new HttpHeaders({ 'Content-Type': 'application/json'})

    let params = new HttpParams();

    // Begin assigning parameters
    params = params.append('m_number',m_number);
    params = params.append('timestamp',timestamp);
    params = params.append('nonce_str',nonce_str);
    params = params.append('sign',sign);
    params = params.append('order_name',order_name);
    params = params.append('currency',currency);
    params = params.append('amount',amount);
    params = params.append('notify_url',notify_url);
    params = params.append('return_url',return_url);
    params = params.append('out_order_no',out_order_no);
    params = params.append('type',type);
    return this.http.get(url,{headers , params })
  }
  alipay(){
    var headers=new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.get(url_alipay,{headers})
  }
  /*
  //method 2 for http request
  deleteCard(id,token,token_type,card_id){
    var url_user_card=url_card+card_id;
    let headers = new Headers({ 'Authorization':token_type+' '+token });
    return this.httpOld.delete(url_user_card,httpOptions )
  }

  //method 3 for http request
  deleteCard(id,token,token_type,card_id){
    var url_user_card=url_card+card_id;
    console.log(url_user_card)
    var time = 5000;
    var timeout = false;
    var request = new XMLHttpRequest();
    var timer = setTimeout(function() {
        var request = new XMLHttpRequest();
        timeout = true;
        request.abort();
    }, time);
    request.open("GET", url_user_card);
    //request.setRequestHeader("Content-type", "application/json");
    request.setRequestHeader("Authorization", 'JWT '+'12434241');
    console.log(request)
    request.onreadystatechange = function() {
      if (request.readyState !== 4) {
        return;
      }
      if (timeout) {
        console.log("timeout");
        return;
      }
      clearTimeout(timer);
      if (request.status == 200) {
        console.log('success')
      }else{
        console.log('fail')
      }

    }
    request.send(null);
  }
  */
}
