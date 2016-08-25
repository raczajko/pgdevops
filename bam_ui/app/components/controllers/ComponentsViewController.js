angular.module('bigSQL.components').controller('ComponentsViewController', ['$scope', '$uibModal', 'PubSubService', '$state', 'UpdateComponentsService', '$filter', '$rootScope', '$timeout', '$window', '$http', function ($scope, $uibModal, PubSubService, $state, UpdateComponentsService, $filter, $rootScope, $timeout, $window, $http) {

    $scope.alerts = [];

    var subscriptions = [];
    $scope.components = {};

    var currentComponent = {};
    var parentComponent = {};
    var dependentCount = 0;
    var depList = [];
    var session;
    var pid;
    var getListCmd = false;
    $scope.updateSettings;
    $scope.loading = true;
    $scope.retry = false;
    $scope.disableShowInstalled = false;

    var getCurrentComponent = function (name) {
        for (var i = 0; i < $scope.components.length; i++) {
            if ($scope.components[i].component == name) {
                currentComponent = $scope.components[i];
                return currentComponent;
            }
        }
    };

    function changePostgresOrder(data) {
        var comps = data;
        var pgComps = [];
        var nonPgComps = [];

        for (var i = 0; i < comps.length; i++) {
            if(comps[i]['category_desc'] == 'PostgreSQL'){
                pgComps.push(comps[i]);
            }else{
                nonPgComps.push(comps[i]);
            };
        }
        return  pgComps.reverse().concat(nonPgComps);
    }

    function getList(argument) {
        $http.get($window.location.origin + '/api/list')
        .success(function(data) {
            $scope.nothingInstalled = false;
            if ($scope.showInstalled) {
                $scope.components = changePostgresOrder($(data).filter(function(i,n){ return n.status != "NotInstalled" ;}));
                if($scope.components.length == 0){
                    $scope.components = [];
                    $scope.nothingInstalled = true;
                }
            } else{
                    $scope.components = changePostgresOrder(data);
            }
            $scope.loading = false;
            for (var i = 0; i < $scope.components.length; i++) {
                $scope.components[i].progress = 0;
            }
            var Checkupdates = 0;
            for (var i = 0; i < $scope.components.length; i++) {
                Checkupdates += $scope.components[i].updates;
            }
        })
        .error(function(error) {
            $timeout(wait, 5000);
            $scope.loading = false;
            $scope.retry = true;
        });
    };

    function callInfo(argument) {
        $http.get($window.location.origin + '/api/info')
        .success(function(data) {
            $scope.pgcInfo = data[0];
        });
    }


    callInfo();

    getList();

    $rootScope.$on('sessionCreated', function () {
        var sessPromise = PubSubService.getSession();
        sessPromise.then(function (sessParam) {
            session = sessParam;
        });
    });

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;

        session.call('com.bigsql.info');

        $scope.open = function (manual) {

            try {
                UpdateComponentsService.set(this.c);
            } catch (err) {};

            if (manual == "manual") {
                UpdateComponentsService.setCheckUpdatesManual();
            } else {
                UpdateComponentsService.setCheckUpdatesAuto();
            }
            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/updateModal.html',
                controller: 'ComponentsUpdateController',
            });
        };

        session.call('com.bigsql.getBamConfig', ['showInstalled']);
        session.subscribe("com.bigsql.onGetBamConfig", function (settings) {
           $scope.showInstalled = settings[0];
           $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        // session.call('com.bigsql.list').then(
        //     function (subscribe) {
        //         $rootScope.$emit('topMenuEvent');
        //     }, function (error) {
        //         $timeout(wait, 5000);
        //         $scope.loading = false;
        //         $scope.retry = true;
        //     }
        // );

        session.call('com.bigsql.getTestSetting');
        session.subscribe("com.bigsql.onGetTestSetting", function (settings) {
            if(settings[0] == "test"){
               $scope.isList = true;
            }else{
                $scope.isList = false;
            }
           $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        function wait() {
            $window.location.reload();
        };

        session.subscribe("com.bigsql.onList", function (components) {
            $scope.nothingInstalled = false;
            if ($scope.showInstalled) {
                $scope.components = $(JSON.parse(components[0][0])).filter(function(i,n){ return n.status != "NotInstalled" ;});
                if($scope.components.length == 0){
                    $scope.components = [];
                    $scope.nothingInstalled = true;
                }
            } else{
                $scope.components = JSON.parse(components[0][0]);                
            }
            $scope.loading = false;
            for (var i = 0; i < $scope.components.length; i++) {
                $scope.components[i].progress = 0;
            }
            var Checkupdates = 0;
            for (var i = 0; i < $scope.components.length; i++) {
                Checkupdates += $scope.components[i].updates;
            }
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        session.subscribe("com.bigsql.onInfo", function (machineInfo) {
            $scope.machineInfo = JSON.parse(machineInfo[0][0]);
            var myDate = new Date();
            var previousDay = new Date(myDate);
            previousDay.setDate(myDate.getDate() - 7);
            $scope.prevWeek = $filter('date')(previousDay, 'yyyy-MM-dd');
            for (var i = 0; i < $scope.machineInfo.length; i++) {
                if ($scope.machineInfo[i].interval == null) {
                    if ($scope.machineInfo[i].last_update_utc == null || $scope.machineInfo[i].last_update_utc < $scope.prevWeek) {
                        $scope.updateBtn = true;
                    }
                }
            }
            if ($scope.machineInfo.interval == null || !$scope.machineInfo.interval) {
                $scope.updateSettings = 'manual'; 
            } else {
                $scope.updateSettings = 'auto';
            }
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        session.subscribe('com.bigsql.onInit', function (data) {
            var res = JSON.parse(data[0])[0];
            if(res['status'] == 'error'){
                $scope.alerts.push({
                    msg: res['msg'],
                    type: "danger"
                });
                delete currentComponent.init;
                $scope.disableShowInstalled = false;
            } else {
                $scope.alerts.push({
                    msg: res['msg']
                });
                currentComponent = getCurrentComponent(res['component']);
                currentComponent.status = "Installed";
                currentComponent.init = false;
                $scope.disableShowInstalled = false;
                $scope.compAction('start', res['component']);
            }
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });
    
        $scope.setTest = function (event) {
            var param;
            if($scope.isList){
                param = 'test';
            }else{
                param = 'prod'
            }
            session.call('com.bigsql.setTestSetting',[param]);
            getList();
            // session.call('com.bigsql.list');
        }

        session.subscribe("com.bigsql.onInstall", function (installStream) {

            var data = JSON.parse(installStream[0])[0];
            if (data.state == "deplist") {
                if (data.deps.length > 1) {
                    parentComponent = getCurrentComponent(data.component[0]);
                    parentComponent.installationDependents = data;
                    dependentCount = data.deps.length;
                    depList = data.deps;
                    currentComponent.installation = true;
                    parentComponent.installation = true;
                }
            } else if (data.status == "start") {
                currentComponent = getCurrentComponent(data.component);
                currentComponent.installationStart = data;
                currentComponent.installation = true;
                if (depList[depList.length-1] == currentComponent.component) {
                    delete parentComponent.installationDependents;
                }
            } else if (data.status == "wip") {
                currentComponent.installationRunning = data;
                currentComponent.progress = data.pct;
            } else if (data.status == "complete" || data.status == "cancelled") {
                if (data.state == 'unpack' && data.status == "complete") {
                    if(["pg96","pg95","pg94","pg93","pg92"].indexOf(data.component) >= 0){
                        currentComponent.status = 'NotInitialized';
                        getList();
                        $scope.compAction('init', data.component);
                        // session.call('com.bigsql.list');
                    }else{
                        currentComponent.status = 'Installed';
                    }
                } 
                if(data.state == "install"){
                    currentComponent = getCurrentComponent(data.component);
                } 
                if (data.status == "cancelled") {

                    if (dependentCount == 0) {
                         $scope.alerts.push({
                            msg: data.component +" "+data.msg,
                            type: "danger"
                        });
                    } else {
                        delete parentComponent.installation;
                        $scope.alerts.push({
                            msg: parentComponent.component +" >>  "+data.msg,
                            type: "danger"
                        });
                    }
                    dependentCount = 0;
                }
                
                delete currentComponent.installationStart;
                delete currentComponent.installationRunning;
                // delete currentComponent.installation;
                $scope.disableShowInstalled = false;
                if (data.state == "update") {
                    currentComponent.updates -= 1;
                    getList();
                    // session.call('com.bigsql.list');
                };


            } 
            // Need to be status here
            if (data.state == "error") {
                $scope.alerts.push({
                    msg: data.msg,
                    type: 'danger'
                });
                delete parentComponent.installationDependents;
                delete currentComponent.installationStart;
                delete currentComponent.installationRunning;
                delete currentComponent.installation;
                $scope.disableShowInstalled = false;
            }
            else if (data.state == "locked") {
                $scope.alerts.push({
                    msg: data.msg,
                    type: 'danger'
                });
            }
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        var onRemove = function (response) {
            var data = JSON.parse(response[0])[0];

            if (data.status == "error" || data.state == "locked") {
                delete currentComponent.removing;
                $scope.disableShowInstalled = false;
                $scope.alerts.push({
                    msg: data.msg,
                    type: "danger"
                });
            }
            if (data.status == "complete") {
                delete currentComponent.removing;
                currentComponent.status = "NotInstalled";
                $scope.disableShowInstalled = false;
                getList();
                // session.call('com.bigsql.list');
            }
            $scope.$apply();
        };


        session.subscribe('com.bigsql.onRemove', onRemove).then(
            function (subscription){
                subscriptions.push(subscription);
            });

    });

    $scope.installedComps = function (event) {
        session.call('com.bigsql.setBamConfig',['showInstalled', $scope.showInstalled]);
        getList(); 
        // session.call('com.bigsql.list');
    }

    $scope.compAction = function (action, compName) {
        var sessionKey = "com.bigsql." + action;
        $scope.disableShowInstalled = true;
        if(action == "init"){
            currentComponent = getCurrentComponent(compName);
            currentComponent.init = true;
        } else if(action == "remove"){
            currentComponent = getCurrentComponent(compName);
            currentComponent.removing = true;
        }
        session.call(sessionKey, [compName]);
        if (action == 'update' && compName == 'bam2') {
            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/bamUpdateModal.html',
                controller: 'bamUpdateModalController',
            });
        }

    };

    $scope.cancelInstallation = function (action) {
        session.call("com.bigsql.cancelInstall");
    }

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $timeout(function() {
        if ($scope.loading) {
            $window.location.reload();
        };
    }, 5000);

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });
}]);