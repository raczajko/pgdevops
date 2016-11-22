angular.module('bigSQL.components').controller('ComponentDetailsController', ['$scope', '$stateParams', 'PubSubService','$rootScope', '$window', '$interval', 'bamAjaxCall', '$sce', function ($scope, $stateParams, PubSubService, $rootScope, $window, $interval, bamAjaxCall, $sce) {

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
        if(action == 'start'){
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
        var remote_host = $rootScope.remote_host;
        remote_host = typeof remote_host !== 'undefined' ? remote_host : "";

        if (remote_host == "" || remote_host == "localhost") {
            var infoData = bamAjaxCall.getCmdData('info/' + $stateParams.component);
        } else {
            var infoData = bamAjaxCall.getCmdData('info/' + $stateParams.component + "/" + remote_host);
        }

        //var infoData = bamAjaxCall.getCmdData('info/' + $stateParams.component);
        infoData.then(function(data) {
            if(window.location.href.split('/').pop(-1) == data[0].component){
                $scope.component = data[0];
                var relnotes = bamAjaxCall.getCmdData('relnotes/' + $stateParams.component + '/' +$scope.component.version)
                relnotes.then(function (data) {
                    $scope.relnotes = $sce.trustAsHtml(data);
                });
            }
        });
    };

    function callStatus(argument) {
        var statusData = bamAjaxCall.getCmdData('status')
        statusData.then(function(data) {
            componentStatus = getCurrentObject($stateParams.component);
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

        $scope.action = function (event) {
            if (event.target.tagName === "A") {
                if(event.target.attributes.action.value == 'start'){
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