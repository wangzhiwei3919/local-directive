var app = angular.module('app',[]);
/**
 * 配置域名访问地址
 * */
app.factory('webRoot',['$location',function ($location) {
    return 'http://'+$location.host()+':'+$location.port()+'/local-directive/allDemo';
}]);
