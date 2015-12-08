(function(){
var map, restaurantMarkers = [];
app.controller('IndexCtrl', [
    '$scope',
    '$http',
    IndexController
]);
function IndexController($scope, $http)
{
    screenSize();
    $scope.activePanel = "list";
    $scope.activeLocation = "address";
    $scope.starRatingSelected = 0;
    $scope.priceRatingSelected = 0;
    $scope.results = [];
    $scope.recResults = [];
    var coordsReturned = new CustomEvent("coordsReturned");
    var apiKey = "sk.eyJ1IjoibG9uZ3Vza2lraXJrIiwiYSI6IldCdUNJVzQifQ.GM8iiojBFuX8zvpnc1wHQA";
    navigator.geolocation.getCurrentPosition(function (location){
            var latitude = location.coords.latitude;
            var longitude = location.coords.longitude;
            mapping(latitude, longitude);
        },
        function(){
            var latitude = "27.3372";
            var longitude = "-82.5253";
            mapping(latitude, longitude);
        },{timeout:10000});
    function mapping(latitude, longitude)
    {
        L.mapbox.accessToken = "pk.eyJ1IjoibG9uZ3Vza2lraXJrIiwiYSI6ImtyZFBrcFUifQ._DzP89FxptJU7vnfbZJQnA";
        map = L.mapbox.map('map', 'longuskikirk.lckfjj05',{
            trackResize:false,
            inertiaDeceleration:2000,
            inertiaMaxSpeed:2000,
            zoomControl:false,
            options:{
                tileLayer:{
                    unloadInvisibleTiles:false,
                    updateWhenIdle:false,
                    reuseTiles:true,
                    tileSize:64
                }
            }
        });
        map.setView([latitude, longitude], 14);
        $scope.coords = {
            "latitude": latitude,
            "longitude": longitude
        };
        for(var mindex = 0; mindex < restaurantMarkers.length; mindex++)
        {
            restaurantMarkers[mindex].addTo(map);
        }
    }
    var url = "../restaurants";
    $http.get(url).success(function(data){
        console.log("success");
        $scope.results = (data);
        for(var rindex = 0; rindex < $scope.results.length; rindex++)
        {
            var res = $scope.results[rindex];
            var marker = L.marker([res.latitude,res.longitude],{"icon":icon()});
            marker.restaurant = res;
            marker.on("click", function(){
                console.log(this.restaurant);
            });
            restaurantMarkers.push(marker);
        }
        console.log($scope.results);
    });
    function icon(text, iconClass)
    {
        text = text ? text : "";
        iconClass = iconClass ? iconClass : "";
        return L.divIcon({
            className: 'css-icon ' + iconClass,
            html:"<span>"+ text +"</span>",
            iconSize: [30, 30]
        });
    }
    $scope.openTableRestaurants = function(parameterObject)
    {
        var url = "http://opentable.herokuapp.com/api/restaurants?";
        if(parameterObject.page == undefined)
        {
            parameterObject.page = 1;
        }
        for(var param in parameterObject)
        {
            if(parameterObject.hasOwnProperty(param))
            {
                url = url + "&" + param + "=" + parameterObject[param];
            }
        }
        console.log(url);
        $http.get(url).success(function(data){
            console.log(data);
        });

    };
    var Restaurant = function()
    {};
    $scope.starRating = function(rating)
    {
        if($scope.starRatingSelected == rating)
        {
            $scope.starRatingSelected = 0;
        }
        else
        {
            $scope.starRatingSelected = rating;
        }
    };
    $scope.priceRating = function(rating)
    {
        if($scope.priceRatingSelected == rating)
        {
            $scope.priceRatingSelected = 0;
        }
        else
        {
            $scope.priceRatingSelected = rating;
        }
    };
    $scope.range = function(n) {
        var ray = [];
        for(var it = 0; it < n; it++)
        {
            ray.push(it);
        }
        return ray;
    };
    $scope.restaurantSubmit = function(res)
    {
        //TODO add "touch for restaurant here" to app
        var rant = new Restaurant();
        rant.name = res.name;
        rant.type = res.type;
        rant.priceRate = $scope.priceRatingSelected;
        rant.starRate = $scope.starRatingSelected;
        if($scope.activeLocation == "address")
        {
            geoCodePlace(res.street, res.city, res.state, rant);
            document.addEventListener("coordsReturned", function(){
                restaurantMarker(rant.latitude,rant.longitude,rant);
                map.setView([rant.latitude,rant.longitude], map.getZoom());
                $scope.results.push(rant);
            });
        }
        else
        {
            restaurantMarker($scope.coords.latitude,$scope.coords.longitude,rant);
            $scope.results.push(rant);
        }
        $scope.activePanel = "list";
    };
    $scope.findRestaurant = function(res)
    {
        console.log(res);
        map.setView([res.latitude,res.longitude], map.getZoom());
    };
    $scope.newRestaurant = function(type)
    {
        $scope.activeLocation = type;
        $scope.activePanel = "new";
    };
    function restaurantMarker(lat, lng, res)
    {
        res.latitude = lat.toString();
        res.longitude = lng.toString();
        var marker = L.marker([res.latitude,res.longitude],{"icon":icon()});
        marker.restaurant = res;
        marker.addTo(map);
        marker.on("click", function(){
            console.log(this.restaurant);
        });
        restaurantMarkers.push(marker);
        postRestaurant(res);
    }
    function recToRestaurants(rec)
    {
        var res = new Restaurant();
        res.name = rec.name;
        res.priceRate = rec.price;
        res.starRate = 0;
        return res;
    }
    function postRestaurant(restaurant)
    {
        var url = "../restaurants";
        console.log(url);
        console.log(restaurant);
        $http.post("../restaurants",restaurant).success(function(data){
            console.log(data);
        });
    }
    function geoCodePlace(street, city, state, object)
    {
        var url = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/"+street+" "+city+" "+state+".json?access_token="+apiKey;

        $http.get(url).success(function(data){
            var coords = data.features[0].geometry.coordinates;
            var lat = coords[1].toString();
            var lng = coords[0].toString();
            object.latitude = lat;
            object.longitude = lng;
            document.dispatchEvent(coordsReturned);
        });
    }
}

})();