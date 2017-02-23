angular.module('bigSQL.components').controller('ComponentDetailsController', ['$scope', '$stateParams', 'PubSubService','$rootScope', '$window', '$interval', 'bamAjaxCall', '$sce', '$cookies', '$uibModalInstance', function ($scope, $stateParams, PubSubService, $rootScope, $window, $interval, bamAjaxCall, $sce, $cookies, $uibModalInstance) {

    var subscriptions = [];
    var session;
    $scope.loading = true;
    var dependentCount = 0;
    $scope.currentHost;

    var componentStatus = 0;

    $scope.alerts = [];

    $scope.statusColors = {
        "Stopped": "orange",
        "NotInitialized": "yellow",
        "Running": "green"
    }

    $scope.cancel = function () {
        $rootScope.$emit('updatePackageManager');
        $uibModalInstance.dismiss('cancel');
    };

    $scope.currentComponent = $uibModalInstance.component;

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
        var remote_host = $cookies.get('remote_host');
        $scope.currentHost = remote_host;
        remote_host = typeof remote_host !== 'undefined' ? remote_host : "";
        $scope.currentHost = remote_host;
        if (remote_host == "" || remote_host == "localhost") {
            $scope.currentHost = "localhost";
            // var infoData = bamAjaxCall.getCmdData('info/' + $scope.currentComponent);
            var infoData = bamAjaxCall.getCmdData('relnotes/info/' + $scope.currentComponent);
        } else {
            var infoData = bamAjaxCall.getCmdData('relnotes/info/' + $scope.currentComponent + "/" + remote_host);
        }

        //var infoData = bamAjaxCall.getCmdData('info/' + $scope.currentComponent);
        infoData.then(function(data) {
            $scope.loading = false;
            if($scope.currentComponent == data[0].component){
                $scope.component = data[0];
                $scope.component.componentImage = $scope.component.component.split('-')[0].replace(/[0-9]/g,'');
                $scope.component.release_date = new Date($scope.component.release_date).toString().split(' ',[4]).splice(1).join(' ');
                $scope.component.release_date = $scope.component.release_date.split(' ')[0] + ' ' + $scope.component.release_date.split(' ')[1].replace(/^0+/, '') + ', ' + $scope.component.release_date.split(' ')[2];
                if($scope.component.install_date){
                    $scope.component.install_date = new Date($scope.component.install_date + " UTC").toString().split(' ',[4]).splice(1).join(' ');
                    $scope.component.install_date = $scope.component.install_date.split(' ')[0] + ' ' + $scope.component.install_date.split(' ')[1].replace(/^0+/, '') + ', ' + $scope.component.install_date.split(' ')[2];
                }
                $scope.rel_notes = $sce.trustAsHtml($scope.component.rel_notes);
                // var relnotes = bamAjaxCall.getCmdData('relnotes/info/' + $scope.currentComponent )
                // relnotes.then(function (data) {
                //     var data = JSON.parse(data)[0];
                //     $scope.relnotes = $sce.trustAsHtml(data.text);
                // });
            }
        });
    };

    function callStatus(argument) {
        var statusData = bamAjaxCall.getCmdData('status')
        statusData.then(function(data) {
            componentStatus = getCurrentObject($scope.currentComponent);
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
                // session.call('com.bigsql.infoComponent', [$scope.currentComponent]);
                var alertObj = {
                    msg: data.msg,
                    type: "danger"
                }
                $scope.alerts.push(alertObj);
                callInfo();
            }
        };

        session.subscribe('com.bigsql.onRemove', onRemove).then(
            function (sub) {
                subscriptions.push(sub);
            });

        $scope.action = function (event) {
            if (event.target.tagName === "A" && event.target.attributes.action != undefined) {
                if(event.target.attributes.action.value == 'start'){
                    $scope.component.spinner = 'Starting..';
                }else if(event.target.attributes.action.value == 'stop'){
                    $scope.component.spinner = 'Stopping..';
                }else if(event.target.attributes.action.value == 'remove'){
                    $scope.component.spinner = 'Removing..';
                }
                // var sessionKey = "com.bigsql." + event.target.attributes.action.value;
                // session.call(sessionKey, [$scope.component.component]);
                if($scope.currentHost == 'localhost'){
                    var sessionKey = "com.bigsql." + event.target.attributes.action.value;
                    session.call(sessionKey, [$scope.component.component]);
                }else {
                    if(event.target.attributes.action.value == 'install'){
                        $scope.component.spinner = 'installing..';
                    }
                    var event_url = event.target.attributes.action.value + '/' + $scope.component.component + '/' + $scope.currentHost ;
                    var eventData = bamAjaxCall.getCmdData(event_url);
                    eventData.then(function(data) {
                        callInfo($scope.currentHost);
                    });
                }
            }
        };

        session.subscribe('com.bigsql.onInstall', function (response) {
            var data = JSON.parse(response[0])[0];
            // if ($scope.currentComponent == data.component || $scope.currentComponent == data.component[0]) {
            if (data.state == "deplist") {
                if (data.deps.length > 1) {
                    dependentCount = data.deps.length;
                    $scope.component.installationDependents = true;
                }
            } else if (data.status == "start") {
                $scope.component.installationStart = data;
                $scope.component.installation = true;
                if ($scope.currentComponent == data.component) {
                    delete $scope.component.installationDependents;
                } else {
                    $scope.component.installationDependents = true;   
                }
            } else if (data.status == "wip") {
                $scope.component.installationRunning = data;
                $scope.component.progress = data.pct;
            } else if (data.status == "complete" || data.status == "cancelled") {
                if (data.state == 'unpack' || data.state == 'update' || data.state == 'install') {
                    // session.call('com.bigsql.infoComponent', [$scope.currentComponent])
                    $scope.alerts.push({
                            msg:  data.msg,
                            type: 'success'
                        });
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
                delete $scope.component.installation;

            }

            if (data.state == "error") {
                $scope.alerts.push({
                    msg: data.msg,
                    type: 'danger'
                });
                delete $scope.component.installation;
            }
            $scope.$apply();
        // }
        }).then(function (sub) {
            subscriptions.push(sub);
        });
    });

    $rootScope.$on('refreshData', function (argument, host) {
        $scope.loading = true;
        callInfo(host);
    });

    $scope.cancelInstallation = function (action) {
        session.call("com.bigsql.cancelInstall");
    }

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        if($scope.component == 'pgbadger'){
            $rootScope.$on('refreshPgbadger');
        }
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    });

}]);