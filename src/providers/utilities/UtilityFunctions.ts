

export class UtilityFunctions{
    public getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var month_str = String(month);
        var strDate = date.getDate();
        var strDate_s = String(strDate);
        var h_str = String(date.getHours());
        var m_str = String(date.getMinutes());
        var s_str = String(date.getSeconds());
        if (month >= 1 && month <= 9) {
            month_str = String("0" + month);
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate_s = String("0" + strDate);
        }
        if(date.getHours()<=9){
            h_str = "0"+date.getHours();
        }
        if(date.getMinutes()<=9)
            m_str = "0"+date.getMinutes();
        if(date.getSeconds()<=9)
            s_str = "0"+date.getSeconds();
        var currentdate = date.getFullYear() + seperator1 + month_str + seperator1 + strDate_s
                + "T" + h_str + seperator2 + m_str
                + seperator2 + s_str+"Z";
        return currentdate;
    }  

}