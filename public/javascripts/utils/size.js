function screenSize(mobile, smallDesktop, medDesktop)
{
    var mobileSize = mobile == undefined ? 980 : mobile;
    var desktopSmall = smallDesktop == undefined ? 1000 : smallDesktop;
    var desktopMed = medDesktop == undefined ? 1500 : medDesktop;
    var size = "", type = "";
    var body = document.getElementsByTagName('body')[0];
    var width = body.offsetWidth;
    if(width <= mobileSize) type = "mobile";
    else
    {
        type = "desktop";
        if(width < desktopMed)
        {
            if(width < desktopSmall) size = "small-screen";
            else size = "med-screen";
        }
        else size = "large-screen";
    }
    body.className = body.className + " " + type + " " + size;
}