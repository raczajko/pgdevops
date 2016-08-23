angular.module('bigSQL.components').controller('ComponentDetailsController', ['$scope', '$stateParams', 'PubSubService','$rootScope', '$http', '$window', '$interval', function ($scope, $stateParams, PubSubService, $rootScope, $http, $window, $interval) {

    var subscriptions = [];
    var session;

    var dependentCount = 0;

    var componentStatus = 0;

    $scope.alerts = [];

    $scope.statusColors = {
        "Stopped": "orange",
        "NotInitialized": "yellow",
        "Running": "green"
    }

    var getCurrentObject = function (list, name) {
        var currentObject;
        for (var i = 0; i < list.length; i++) {
            if (list[i].component == name) {
                currentObject = list[i];
                return currentObject;
            }
        }
    };

    function compAction(action) {
            if(action == 'init'){
                $scope.component.spinner = 'Initializing..';
            }else if(action == 'start'){
                $scope.component.spinner = 'Starting..';
            }else if(action == 'stop'){
                $scope.component.spinner = 'Stopping..';
            }else if(action == 'remove'){
                $scope.component.spinner = 'Removing..';
            }else if(action == 'restart'){
                $scope.component.spinner = 'Restarting..';
            }
            var sessionKey = "com.bigsql." + action;
            session.call(sessionKey, [$scope.component.component]);
    };

    function callInfo(argument) {
        $http.get($window.location.origin + '/api/info/' + $stateParams.component)
        .success(function(data) {
            if(data[0]['autostart']== "on" ){
                data[0]['autostart']=true;
            }else{
                data[0]['autostart']=false;
            }
            if(window.location.href.split('/').pop(-1) == data[0].component){
                $scope.component = data[0];
                if($scope.component.status != "Running"){
                    $scope.uibStatus = {
                        tpsChartCollapsed : false,
                        rpsChartCollapsed : false,
                        diskChartCollapsed : true,
                        cpuChartCollapsed : true,
                        connectionsCollapsed : false
                    };
                } else {
                    $scope.uibStatus = {
                        tpsChartCollapsed : true,
                        rpsChartCollapsed : true,
                        diskChartCollapsed : false,
                        cpuChartCollapsed : true,
                        connectionsCollapsed : false
                    };
                }
            }
        });
    };

    function callStatus(argument) {
        $http.get($window.location.origin + '/api/status')
        .success(function(data) {
            componentStatus = getCurrentObject(data, $stateParams.component);
            $rootScope.$emit('componentStatus', componentStatus);
            if (componentStatus.state != $scope.component.status) {
                callInfo();
            }
        });
    }

    callInfo();
    callStatus();

    $interval(callStatus, 5000);

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;
        $scope.component = {};
        // session.call('com.bigsql.infoComponent', [$stateParams.component]);

        // session.subscribe('com.bigsql.status', function (data) {
        //     var list = JSON.parse(data[0]);
        //     componentStatus = getCurrentObject(list, $stateParams.component)
        //     if (componentStatus.state != $scope.component.status) {
        //         session.call('com.bigsql.infoComponent', [$stateParams.component]);
        //     }
        // }).then(function (sub) {
        //     subscriptions.push(sub);
        // });

        var onRemove = function (response) {
            var data = JSON.parse(response[0])[0];
            if (data.status == "error") {
                var alertObj = {
                    msg: data.msg,
                    type: "danger"
                }
                $scope.alerts.push(alertObj);
                $scope.$apply();
            }
            if (data.status == "complete") {
                // session.call('com.bigsql.infoComponent', [$stateParams.component]);
                callInfo();
            }
        };

        session.subscribe('com.bigsql.onRemove', onRemove).then(
            function (sub) {
                subscriptions.push(sub);
            });

        session.subscribe('com.bigsql.onInit', function (data) {
            var res = JSON.parse(data[0])[0];
            if(res['status'] == 'error'){
                $scope.alerts.push({
                    msg: res['msg'],
                    type: "danger"
                });
            } else {
                $scope.alerts.push({
                    msg: res['msg']
                });
                $scope.component.spinner = res['msg'];
                compAction('start');
            }
            $scope.$apply();
        }).then(function (sub) {
            subscriptions.push(sub);
        });
        
        session.subscribe('com.bigsql.onInfoComponent', function (args) {
            var jsonD = JSON.parse(args[0][0]);
            if(window.location.href.split('/').pop(-1) == jsonD[0].component){
                $scope.component = jsonD[0];
                $scope.$apply();
            }
        }).then(function (sub) {
            $rootScope.$emit('topMenuEvent');
            subscriptions.push(sub);
        });
        $scope.isCollapsed2 = true;

        $scope.action = function (event) {
            if (event.target.tagName === "A") {
                if(event.target.attributes.action.value == 'init'){
                    $scope.component.spinner = 'Initializing..';
                }else if(event.target.attributes.action.value == 'start'){
                    $scope.component.spinner = 'Starting..';
                }else if(event.target.attributes.action.value == 'stop'){
                    $scope.component.spinner = 'Stopping..';
                }else if(event.target.attributes.action.value == 'remove'){
                    $scope.component.spinner = 'Removing..';
                }
                var sessionKey = "com.bigsql." + event.target.attributes.action.value;
                session.call(sessionKey, [$scope.component.component]);
            }
        };

        session.subscribe('com.bigsql.onInstall', function (response) {
            var data = JSON.parse(response[0])[0];

            if (data.state == "deplist") {
                if (data.deps.length > 1) {
                    dependentCount = data.deps.length;
                    $scope.component.installationDependents = true;
                }
            } else if (data.status == "start") {
                $scope.component.installationStart = data;
                $scope.component.installation = true;
                if ($stateParams.component == data.component) {
                    delete $scope.component.installationDependents;
                } else {
                    $scope.component.installationDependents = true;   
                }
            } else if (data.status == "wip") {
                $scope.component.installationRunning = data;
                $scope.component.progress = data.pct;
            } else if (data.status == "complete" || data.status == "cancelled") {
                
                if (data.state == 'unpack') {
                    // session.call('com.bigsql.infoComponent', [$stateParams.component])
                    callInfo();
                    compAction('init');
                } 
                if (data.status == "cancelled") {
                        $scope.alerts.push({
                            msg:  data.msg,
                            type: 'danger'
                        });
                }

                delete $scope.component.installationStart;
                delete $scope.component.installationRunning;
                // delete $scope.component.installation;

            }

            if (data.state == "error") {
                $scope.alerts.push({
                    msg: data.msg,
                    type: 'danger'
                });
                delete $scope.component.installation;
            }
            $scope.$apply();
        }).then(function (sub) {
            subscriptions.push(sub);
        });

    });

    $scope.cancelInstallation = function (action) {
        session.call("com.bigsql.cancelInstall");
    }

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    });

}]);