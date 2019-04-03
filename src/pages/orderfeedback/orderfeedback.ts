import { Component , ViewChild, ElementRef, ComponentFactoryResolver} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UtilityFunctions } from '../../providers/utilities/UtilityFunctions';
import { RentServiceProvider } from '../../providers/rent-service/rent-service';
/**
 * Generated class for the OrderfeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-orderfeedback',
  templateUrl: 'orderfeedback.html',
})
export class OrderfeedbackPage {
  timer:any;
  current_plan:any=3;
  current_time:any;
  current_bankId:any;
  current_bank:any;
  current_transcationId:any=878;
  current_transcation:any;
  TOKEN:any;
  ID:any;
  @ViewChild('map') mapElement: ElementRef;
  constructor(public rentService:RentServiceProvider ,public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderfeedbackPage');

  }

  getPowerbank(){
    this.rentService.getPowerbank(this.current_bankId,this.TOKEN.token,'JWT').subscribe(
      (result)=>{
        console.log(result)
        this.current_bank=result;
      },
      (error)=>{
        console.log(error)
      }
    )
  }
  getTranscation(){
    this.rentService.getTranscation(this.current_transcationId,this.TOKEN.token,'JWT').subscribe(
      (result)=>{
        console.log(result)
        this.current_transcation=result;
        console.log(this.current_transcation)
        var context=this;
        console.log(context.current_transcation)
        this.startTimerForLeftTime(context);
      },
      (error)=>{
        console.log(error)
      }
    )
  }
  getLeftTime(context){
    console.log(context.current_transcation)
    let d_start = new Date(context.current_transcation.startTime);
    let d_now = new Date(new UtilityFunctions().getNowFormatDate());
    console.log(d_now,d_start);
    let currentDuration = d_now.getTime()-d_start.getTime();
    console.log(currentDuration);
    let endDuration=context.current_plan*1000*3600;
    let leftDuration=endDuration-currentDuration;
    let h,m,h_str,m_str;
    if (leftDuration<=0){
      h=0;
      m=0;
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
    document.getElementById("btn_time").innerHTML = h_str+"h "+m_str+"m";
  }

  startTimerForLeftTime(context){
    this.timer=setInterval(context.getLeftTime,60000,context)
  }
  stopTimerForLeftTime(context){
    clearInterval(context.timer);
  }

}
