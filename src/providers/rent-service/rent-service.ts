import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Url} from '../staticVariable/url';
/*
  Generated class for the RentServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let url_object=new Url();
let url_transcation=url_object.URL_TRANSACTION;
let url_user=url_object.URL_USER;
let url_powerbank=url_object.URL_POWERBANK;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class RentServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello RentServiceProvider Provider');
  }
  getTranscations(id,token,token_type){
    console.log('start get transcations')
    var url_user_transcation=url_user+id+'/transcations/';
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    return this.http.get(url_user_transcation,httpHeader)
  }
  getTranscation(id,token,token_type){
    console.log('start get transcation')
    var url_user_transcation=url_transcation+String(id)+'/';
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    return this.http.get(url_user_transcation,httpHeader)
  }
  getPowerbank(id,token,token_type){
    var url_specific_powerbank=url_powerbank+id+'/';
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    return this.http.get(url_specific_powerbank,httpHeader)
  }

  postTranscation(data,id,token,token_type){
    var url_user_transcation=url_user+id+'/transcations/'
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    return this.http.post(url_user_transcation,data,httpHeader)
  }
  patchTranscation(data,id,token,token_type){
    console.log(data,'patch transcation')
    var url_specific_transcation=url_transcation+id+'/';
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    return this.http.patch(url_specific_transcation,data,httpHeader)
  }

  patchPowerbank(data,id,token_type,token){
    console.log(data,'patch')
    var url_specific_powerbank=url_powerbank+id+'/';
    var httpHeader = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json','Authorization':token_type+' '+token})
    };
    return this.http.patch(url_specific_powerbank,data,httpHeader)
  }



}
