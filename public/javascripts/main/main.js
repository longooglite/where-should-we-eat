var app = angular.module("wswe",['ui.router']);
app.config([
    "$stateProvider",
    "$urlRouterProvider",
    function($stateProvider, $urlRouterProivder)
    {
        $stateProvider
            .state('index',
                {
                    url:"/",
                    controller:"IndexCtrl"
                }
            );
        $urlRouterProivder.otherwise('index');
    }
]);