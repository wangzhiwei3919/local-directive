/**
 * Created by wangzhiwei on 16/11/24.
 */
app.directive('loopimage', function () {
    return {
        restrict: 'AE',
        scope: {
            loadData: '=loadData',//数据源
            currentImage: '=currentImage'
        },
        template: '<div class="loop-image">' +
        '<i ng-hide="currentIndex==0 && !loop" ng-click="loopLeft()" class="icon-left"></i>' +
        '<i ng-hide="currentIndex==(imageList.length-1) && !loop" ng-click="loopRight()" class="icon-right"></i>' +
        '<div class="image-list">' +
        '<img ng-repeat="item in imageList" ng-show="isCurrent(item,currentImage)" ng-src="{{item[key]}}" alt=""/>' +
        '</div>' +
        '</div>',
        replace: true,
        link: function (scope, element, attr) {
            scope.imageList = scope.loadData.imageList;
            scope.key = scope.loadData.key;
            scope.loop=scope.loadData.loop;
            if (!scope.currentImage) {
                scope.currentImage = scope.imageList[0];
                scope.currentIndex = 0;
            }
            scope.isCurrent = function (item,currentImage) {//控制当前显示图片
                var back = true;
                for (var index in currentImage) {
                    if (currentImage[index] !== item[index]) {
                        back = false;
                        break;
                    }
                }
                if(back){
                    scope.currentIndex = scope.getListIndex(currentImage, scope.imageList);
                    console.log(scope.currentIndex);
                }
                return back;
            };
            scope.loopLeft = function () {
                var index = scope.getListIndex(scope.currentImage, scope.imageList);
                if (index == 0) {
                    scope.currentImage = scope.imageList[scope.imageList.length - 1];
                } else {
                    scope.currentImage = scope.imageList[index - 1];
                }
            };
            scope.loopRight = function () {
                var index = scope.getListIndex(scope.currentImage, scope.imageList);
                if (index == (scope.imageList.length - 1)) {
                    scope.currentImage = scope.imageList[0];
                } else {
                    scope.currentImage = scope.imageList[index + 1];
                }
            };
            scope.getListIndex = function (item, list) {//获取元素在数值中下标
                for (var index = 0; index < list.length; index++) {
                    var tmp = list[index];
                    var back = true;
                    for (var i in item) {
                        if (item[i] !== tmp[i]) {
                            back = false;
                            break;
                        }
                    }
                    if (back) {
                        return index;
                    }
                }
                return -1;
            }
        }
    }

})
;