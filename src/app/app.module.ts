import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { UsernewPage } from '../pages/usernew/usernew';//登录注册
import { RegisterPage } from '../pages/register/register';//注册界面
import { LoginPage } from '../pages/login/login';//登录界面
import { PhoneregisterPage } from '../pages/phoneregister/phoneregister';//号码注册
import { PhoneloginPage } from '../pages/phonelogin/phonelogin';      //电话号码登录界面
import { PowermapPage } from '../pages/powermap/powermap';    //地图界面
import { CallerlocPage } from '../pages/callerloc/callerloc'; //选择号码归属地
import { SlidesPage } from '../pages/slides/slides'; //引导页
import { OrderhistoryPage } from '../pages/orderhistory/orderhistory'; //订单记录
import { OrderfeedbackPage } from '../pages/orderfeedback/orderfeedback'; //订单问题反馈
import { RentPage } from '../pages/rent/rent'; //租借界面
import { ReturnPage} from '../pages/return/return'; //返还界面
import { StorelistPage} from '../pages/storelist/storelist'; //店铺列表
import { WalletPage} from '../pages/wallet/wallet'; //钱包
import { PaymentPage} from '../pages/payment/payment'; //信用卡界面
import { AddcardPage} from '../pages/addcard/addcard';
import { ScanPage} from '../pages/scan/scan'; //绑定信用卡界面
import { Stripe } from '@ionic-native/stripe';
import { PayServiceProvider } from '../providers/pay-service/pay-service';
import { HttpClientModule ,HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginServiceProvider } from '../providers/login-service/login-service'; 
import { AngularInterceptor } from '../providers/staticVariable/http-interceptor'; 
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { ShopServiceProvider } from '../providers/shop-service/shop-service';
import { Diagnostic } from '@ionic-native/diagnostic';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
//import { timeout } from 'rxjs/operators';
import {GoogleMaps} from "@ionic-native/google-maps"
import { NativeMapPage } from '../pages/native-map/native-map';
import { RentServiceProvider } from '../providers/rent-service/rent-service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Facebook } from '@ionic-native/facebook';
import { QRScanner } from '@ionic-native/qr-scanner';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ScanPage,
    UsernewPage,       //登录注册
    RegisterPage,      //注册界面
    LoginPage,         //登录界面
    PhoneregisterPage, //号码注册
    PhoneloginPage,   //电话号码登录界面
    PowermapPage,  //地图界面
    CallerlocPage, //选择号码归属地
    SlidesPage ,//引导页
    OrderhistoryPage,//订单列表
    OrderfeedbackPage,//订单问题反馈
    RentPage,//租借界面
    ReturnPage,//返还界面
    StorelistPage,//店铺列表
    WalletPage,//钱包
    PaymentPage,//信用卡界面
    AddcardPage,//绑定信用卡
    NativeMapPage,
  ], 
  imports: [
    BrowserModule,HttpClientModule,HttpModule ,
    IonicModule.forRoot(MyApp,{
      mode: 'ios'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NativeMapPage,
    HomePage,
    UsernewPage,
    RegisterPage,
    LoginPage,
    ScanPage,
    PhoneregisterPage,
    PhoneloginPage,
    PowermapPage,
    CallerlocPage,
    SlidesPage,
    OrderhistoryPage,
    OrderfeedbackPage,
    RentPage,
    ReturnPage,
    StorelistPage,
    WalletPage,
    PaymentPage,
    AddcardPage
  ],
  providers: [
    QRScanner ,
    CallNumber,
    Facebook,
    InAppBrowser,
    GoogleMaps,
    Diagnostic,
    OpenNativeSettings,
    Geolocation,
     { provide: HTTP_INTERCEPTORS, useClass: 
      AngularInterceptor, multi: true } ,
    Stripe,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PayServiceProvider,
    LoginServiceProvider,
    ShopServiceProvider,
    RentServiceProvider
  ]
})
export class AppModule {}


