/**
 * Created by wangzhiwei on 16/11/25.
 */
app.directive('checkbox', function () {
    return {
        restrict: 'AE',
        scope: {
            loadData: '=loadData',//数据源 可以是对象和url
            icons: '=icons'//图标类集合
        },
        template: '<ul>' +
        '<li ng-repeat="item in data.list">' +
        '<i ng-click="item.switch=!item.switch" ng-class="{true:\'switch-icon \'+icons.open,false:\'switch-icon \'+icons.close}[item.switch==true]" ng-if="existChild(item)" ></i>' +
        '<div class="check-item">' +
        '<i ng-class="{true:\'icon-check\',false:\'icon-uncheck\'}[changeSelf(item)]"  ng-click="checkItem(item,1)"></i>' +
        '<span class="content" ng-click="checkItem(item,2)">{{item.content}}</span>' +
        '</div>' +
        '<checkbox ng-if="item.switch" load-data="item.child" icons="icons"></checkbox>' +
        '</li>' +
        '</ul>',
        replace: true,
        link: function (scope, attr, ele) {
            scope.data = scope.loadData;
            /**
             *判断当前选择框模式
             * @returns {boolean} false:单选,true 多选
             */
            scope.isRadioModel = function () {
                return scope.data.checkedBox;//checkedBox:false(单选模式),true(全选模式)
            };

            if(!scope.isRadioModel()){//单选模式
                scope.currentChecked=scope.data.list[0];//默认选中第一个
            }
            
            /**
             * 触发点击,改变当前元素选中状态
             * 存在下级,改变本身选中状态,控制下级开合,级联改变下级状态
             * 不存在下级,直接改变选中状态
             * @param item 当前元素
             * @param type 1(图标选中),2(内容选中)
             */
            scope.checkItem = function (item, type) {
                if(!scope.isRadioModel()){//单选模式
                    scope.currentChecked=item;//设置当前选中
                }else{//多选模式,级联选中
                    if (scope.existChild(item)) {//存在下级
                        if (type == 2) {//点击内容只进行开合
                            item.switch = !item.switch;
                        } else {//点击图标,进行选中,并且级联选中所有下级,打开所有下级
                            item.switch = true;

                            item.checked = !item.checked;
                            scope.changeChild(item);//级联选择

                        }
                    } else {//不存在下级,直接选中
                        item.checked = !item.checked;
                    }
                }


            };

            scope.existChild = function (item) {
                if (!item.child) {
                    return false;
                } else {
                    if (item.child.length == 0) {
                        return false;
                    } else {
                        return true;
                    }
                }
            };
            scope.isCurrent = function (item, current) {//判断两个元素是否相等
                var back = true;
                for (var index in current) {
                    if (current[index] !== item[index]) {
                        back = false;
                        break;
                    }
                }
                return back;
            };
            scope.changeChild = function (parent) {//级联选择/取消
                var list = parent.child.list;
                for (var index in list) {
                    list[index].checked = parent.checked;
                    if (scope.existChild(list[index])) {
                        list[index].switch = parent.switch;
                        scope.changeChild(list[index]);
                    }
                }
            };
            scope.changeSelf = function (item) {//修改本身的图标状态
                if (!scope.isRadioModel()) {//如果是单选模式
                    if (scope.isCurrent(item, scope.currentChecked)) {//当前元素是选中
                        item.checked = true;
                    } else {//其它元素不选中
                        item.checked = false;
                    }
                } else {
                    /**
                     * 判断当前元素是否存在子集
                     *  存在子集,并且子集全部选中,
                     *  当前元素选中
                     */
                    if (scope.existChild(item)) {
                        var list = item.child.list;
                        var tmp = true;
                        if (item.child.checkedBox) {
                            for (var child in list) {
                                if (!list[child].checked) {
                                    tmp = false;
                                    break;
                                }
                            }
                        }
                        item.checked = tmp;
                    }

                }

                return item.checked;
            }
        }
    }
});