export class Url{
    URL_HOST:string = "https://pwrbus.com/";

    URL_POWERSTATION = this.URL_HOST.concat("boxes/");

    URL_CREATE_CARD = this.URL_HOST.concat("create-card");

    URL_CHARGE_CARD = this.URL_HOST.concat("charge");

    URL_CARD = this.URL_HOST.concat("cards/");

    URL_USER:string = this.URL_HOST.concat("users/");

    URL_CODE:string = this.URL_HOST.concat("codes/");

    URL_MOBILE_TOKEN: string = this.URL_HOST.concat("api-token-auth/");

    URL_REFRESH_TOKEN: string = this.URL_HOST.concat("api-token-refresh/");

    URL_FORCE_RENT:string = this.URL_HOST.concat("force-rent-request/");

    URL_FORCE_RETURN: string = this.URL_HOST.concat("force-return-request/");

    URL_STORE: string = this.URL_HOST.concat("shops/");

    URL_TRANSACTION: string = this.URL_HOST.concat("transcations/");

    URL_BOXES: string = this.URL_HOST.concat("boxes/");

    URL_ADS: string = this.URL_HOST.concat("ads/1");

    URL_PAY: string = this.URL_HOST.concat("charge-card")

    URL_VERSION: string = this.URL_HOST.concat("versions/3/");

    URL_USERID: string = this.URL_HOST.concat("user-id/") ;

    URL_POWERBANK: string = this.URL_HOST.concat("powerbanks/") ;

    URL_REFRESHVONVERTEDTOKEN: string = this.URL_HOST.concat("auth/token/") ;

    URL_UPDATEFREEPOWERBANK: string =this.URL_HOST.concat("updatefreepowerbank/");

    URL_BINDMOBILE: string = this.URL_HOST.concat("bind-mobile/");

    URL_CONVERT_TOKEN : string = this.URL_HOST.concat("auth/convert-token/") ;

    URL_ALIPAY : string = this.URL_HOST.concat("get-ali-source") ;
}