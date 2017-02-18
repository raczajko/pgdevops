angular.module('bigSQL.components').controller('ComponentsUpdateController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$window', 'bamAjaxCall', '$rootScope', '$cookies', '$uibModal', '$sce', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $window, bamAjaxCall, $rootScope, $cookies, $uibModal, $sce) {

    var session;
    var subscriptions = [];
    $scope.components = {};

    var updateSelectedList = [];
    var currentComponent = {};
    var checkUpdates;
    $scope.currentHost = $cookies.get('remote_host');

    function getList(argument) {
        argument = typeof argument !== 'undefined' ? argument : "";
        $scope.currentHost = argument;
        if (argument=="localhost" || argument == ''){
            var listData = bamAjaxCall.getCmdData('list');
        } else{
            var listData = bamAjaxCall.getCmdData('hostcmd/list/'+argument);
        }
        listData.then(function(data) {
            $scope.loadingSpinner = false;
            $scope.body = true;
            $scope.noUpdates = true;
            $scope.hideLatestInstalled = true;
            $scope.allComponents = data;
            for (var i = 0; i < $scope.allComponents.length; i++) {
                if($scope.allComponents[i].is_new == 1){
                    $scope.hideNewComponents = true;
                }
                console.log($scope.allComponents[i].component);
                if($scope.allComponents[i].is_updated == 1){
                    $scope.hideLatestInstalled = false;
                }
            }

            $scope.components = $(data).filter(function(i,n){ return n.updates>0 ;});

            for (var i = 0; i < $scope.components.length; i++) {
                // $scope.components[i].componentImage = $scope.components[i].component.split('-')[0].replace(/[0-9]/g,'')
                // console.log($scope.components[i].componentImage);
                if($scope.components[i].is_current == 0 && $scope.components[i].current_version){
                    $scope.noUpdates = false;
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
                var relnotes = bamAjaxCall.getCmdData('relnotes/' + $scope.components[i].component + '/' +$scope.components[i].current_version)
                relnotes.then(function (data) {
                    var data = JSON.parse(data)[0];
                    for (var i = $scope.components.length - 1; i >= 0; i--) {
                        if($scope.components[i].component == data.component){
                            $scope.components[i].relnotes = $sce.trustAsHtml(data.text);
                        }
                    }
                });
            }
        });
    };

    var hostsList = bamAjaxCall.getCmdData('hosts');

    hostsList.then(function (data) {
        if (data.length > 0 && data[0].status == "error") {
            $scope.hosts = [];
        } else {
            $scope.hosts = data;
        }
    });

    var remote_host = $cookies.get('remote_host');
    remote_host = typeof remote_host !== 'undefined' ? remote_host : "";
    if (remote_host == "" || remote_host == undefined) {
        $scope.selecthost = 'localhost';    
    } else {
        $scope.selecthost = remote_host;
    }

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
            getList($scope.currentHost);
        } else {
            $scope.loadingSpinner = true;
            $scope.body = false;
            session.call('com.bigsql.updatesCheck').then(
                function (sub) {
                    $scope.loadingSpinner = false;
                    $scope.body = true;
                    getList($scope.currentHost);
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
                selUpdatedComp.splice(0,1);
                if (selUpdatedComp.length > 0) {
                    $scope.compAction('update', selUpdatedComp[0].component);
                }else{
                    // session.call("com.bigsql.getBamConfig");
                    $uibModalInstance.dismiss('cancel');
                    $rootScope.$emit('updatesCheck');
                }
            }
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

        $scope.compAction = function (action, compName) {
            var sessionKey = "com.bigsql." + action;
            if($scope.currentHost == 'localhost' || $scope.currentHost == ''){
                session.call(sessionKey, [compName]);
            }else {
                currentComponent = getCurrentComponent(compName);
                currentComponent.init = true;
                var event_url = action + '/' + compName + '/' + $scope.currentHost ;
                var eventData = bamAjaxCall.getCmdData(event_url);
                eventData.then(function(data) {
                    getList($scope.currentHost);
                });
            }
        };

        var selUpdatedComp = [];

        $scope.selectedUpdate = function (comp) {
            if (comp) {
                selUpdatedComp.push(comp);
            }else{
                for (var i = 0; i < $scope.components.length; i++) {
                    if ($scope.components[i].current_version) {
                        selUpdatedComp.push($scope.components[i]);
                    }
                }
            }
            if (selUpdatedComp.length > 1) {
                var popComp = selUpdatedComp[0].component;
                $scope.compAction('update', popComp);
            } else{
                $scope.compAction('update', selUpdatedComp[0].component);
            }
        };

    });
    
    $scope.openDetailsModal = function (comp) {
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/details.html',
            windowClass: 'comp-details-modal',
            controller: 'ComponentDetailsController',
            keyboard  : false,
            backdrop  : 'static',
        });
        modalInstance.component = comp;
        modalInstance.isExtension = true;
    };

    $scope.hostChange = function (host) {
        $scope.loadingSpinner = true;
        $scope.body = false;
        getList(host);
    };

    $scope.cancelInstallation = function (action) {
        session.call("com.bigsql.cancelInstall");
        getList($scope.currentHost);
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
