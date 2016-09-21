angular.module('bigSQL.components').controller('ComponentsUpdateController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$window', 'bamAjaxCall', '$rootScope', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $window, bamAjaxCall, $rootScope) {

    var session;
    var subscriptions = [];
    $scope.components = {};

    var updateSelectedList = [];
    var currentComponent = {};
    var checkUpdates;   

    function getList(argument) {
        var listData = bamAjaxCall.getCmdData('list')
        listData.then(function(data) {
            $scope.noUpdates = true;
            $scope.components = data;
            $scope.hideLatestInstalled = false;


            for (var i = 0; i < $scope.components.length; i++) {
                if($scope.components[i].is_current == 0 && $scope.components[i].current_version){
                    $scope.noUpdates = false;
                }
                if($scope.components[i].is_new == 1){
                    $scope.hideNewComponents = true;
                }
                if($scope.components[i].is_updated == 1){
                    $scope.hideLatestInstalled = false;
                }
                try{
                    if (UpdateComponentsService.get().component == $scope.components[i].component) {
                        $scope.components[i]['selected'] = true;
                    } else {
                        $scope.components[i]['selected'] = false;
                    }
                } catch(err){}

                if ($scope.noUpdates) {
                    $scope.uibStatus = {
                        newComponents : true,
                        installedComponents : true
                    }
                }else{
                    $scope.uibStatus = {
                        newComponents : false,
                        installedComponents : false
                    }
                }
            }
        });
    };

    if (UpdateComponentsService.get()) {
        $scope.selectedComp = UpdateComponentsService.get();
    }
    ;

    if (UpdateComponentsService.getCheckUpdates()) {
        checkUpdates = true;
    } else {
        checkUpdates = false;
    }
    
    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        $scope.updateSettings = MachineInfo.getUpdationMode();
        session = val;
        if (!checkUpdates) {
            $scope.body = true;
            getList();
        } else {
            $scope.loadingSpinner = true;
            $scope.body = false;
            session.call('com.bigsql.updatesCheck').then(
                function (sub) {
                    $scope.loadingSpinner = false;
                    $scope.body = true;
                    getList();
                });
        }

        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        var getCurrentComponent = function (name) {
            for (var i = 0; i < $scope.components.length; i++) {
                if ($scope.components[i].component == name) {
                    currentComponent = $scope.components[i];
                    return currentComponent;
                }
            }
        };

        session.subscribe("com.bigsql.onInstall", function (installStream) {
            var data = JSON.parse(installStream[0])[0];
            if (data.status == "start") {
                currentComponent = getCurrentComponent(data.component);
                currentComponent.installationStart = data;
                currentComponent.installation = true;
            } else if (data.status == "wip") {
                currentComponent = getCurrentComponent(data.component);
                currentComponent.installationRunning = data;
                currentComponent.progress = data.pct;
            } else if (data.status == "complete" && data.state == "download") {
                currentComponent = getCurrentComponent(data.component);
                delete currentComponent.installationStart;
                delete currentComponent.installationRunning;
                delete currentComponent.installation;
            } else if (data.status == "complete" && data.state == "update") {
                delete currentComponent.installationStart;
                delete currentComponent.installationRunning;
                delete currentComponent.installation;
                angular.element(document.querySelector('#' + currentComponent.component)).remove();
                if (selUpdatedComp.length > 0) {
                    var popListComp = selUpdatedComp.pop();
                    $scope.compAction('update', popListComp.component);
                } else {
                    session.call("com.bigsql.getBamConfig");
                    $uibModalInstance.dismiss('cancel');
                }
            }
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        $scope.compAction = function (action, compName) {
            var sessionKey = "com.bigsql." + action;
            session.call(sessionKey, [compName]);
        };

        var selUpdatedComp = [];

        $scope.selectedUpdate = function (val) {
            for (var i = 0; i < $scope.components.length; i++) {
                if ($scope.components[i].selected && $scope.components[i].current_version) {
                    selUpdatedComp.push($scope.components[i]);
                }
            }
            if (selUpdatedComp.length > 1) {
                var popComp = selUpdatedComp.pop().component;
                $scope.compAction('update', popComp);
            } else {
                session.call('com.bigsql.update', [selUpdatedComp[0].component]).then(function (sub) {
                    $uibModalInstance.dismiss('cancel');
                }, function (err) {
                    throw new Error('failed to update comp', err);
                });
            }
        };

    });

    $scope.cancelInstallation = function (action) {
        session.call("com.bigsql.cancelInstall");
    }

    /**
     Unsubscribe to all the apis on the template and scope destroy
     **/
    $scope.$on('$destroy', function () {
        $rootScope.$emit('topMenuEvent');
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }

    });

}]);
