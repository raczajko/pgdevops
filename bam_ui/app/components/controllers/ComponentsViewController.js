angular.module('bigSQL.components').controller('ComponentsViewController', ['$scope', '$uibModal', 'PubSubService', '$state', 'UpdateComponentsService', '$filter', '$rootScope', '$timeout', '$window', 'bamAjaxCall', '$http', '$cookies', function ($scope, $uibModal, PubSubService, $state, UpdateComponentsService, $filter, $rootScope, $timeout, $window, bamAjaxCall, $http, $cookies) {

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
    $scope.currentHost;
    $scope.updateSettings;
    $scope.loading = true;
    $scope.retry = false;
    $scope.disableShowInstalled = false;
    $scope.extensionsList = [];

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

    $scope.getExtensions = function( comp, idx) {
        if ($scope.components[idx].extensionOpened) {
            $window.location = '#/details-pg/' + comp
        }
        $cookies.putObject('openedExtensions', {'component': comp, 'index': idx});
        for (var i = 0; i < $scope.components.length; i++) {
            $scope.components[i].extensionOpened = false;           
        }
        $scope.components[idx].extensionOpened = true;
        if ($scope.currentHost=="" || $scope.currentHost == 'localhost'){
            var extensionsList = bamAjaxCall.getCmdData('extensions/' + comp);
        } else{
            var extensionsList = bamAjaxCall.getCmdData('extensions/' + comp + '/' + $scope.currentHost);
        }
        // var extensionsList = bamAjaxCall.getCmdData('extensions/' + comp);
        extensionsList.then(function (argument) {
            if (argument[0].state != 'error') {
                $scope.extensionsList = argument;
                if ($scope.showInstalled) {
                    $scope.extensionsList = $($scope.extensionsList).filter(function(i,n){ return n.status != "NotInstalled" ;})   
                }
                for (var i = $scope.extensionsList.length - 1; i >= 0; i--) {
                    $scope.extensionsList[i].modifiedName = $scope.extensionsList[i].component.split('-')[0].replace(/[0-9]/g,'');
                }
            }
        })   
    }

    function getList(argument) {
        argument = typeof argument !== 'undefined' ? argument : "";
        $scope.currentHost = argument;
        if (argument=="" || argument == 'localhost'){
            var listData = bamAjaxCall.getCmdData('list');
        } else{
            var listData = bamAjaxCall.getCmdData('hostcmd/list/'+argument);
        }

        listData.then(function (data) {
            $rootScope.$emit('showUpdates');
            if(data == "error" || data[0].state == 'error'){
                $timeout(wait, 5000);
                $scope.loading = false;
                $scope.retry = true;
                $cookies.remove('remote_host');
            } else {
                $scope.nothingInstalled = false;
                data = $(data).filter(function(i,n){ return n.component != 'bam2' && n.component != 'pgdevops'});
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
                    $scope.components[i].extensionOpened = false;                    
                }
                var Checkupdates = 0;
                for (var i = 0; i < $scope.components.length; i++) {
                    Checkupdates += $scope.components[i].updates;
                } 
            }
            if($cookies.get('openedExtensions')){
                var extensionCookie = JSON.parse($cookies.get('openedExtensions'));
                $scope.getExtensions( extensionCookie.component, extensionCookie.index);
            }else{
                $scope.getExtensions( $scope.components[0].component, 0);                
            }
        });
    };

    getList($cookies.get('remote_host'));

    $rootScope.$on('updatePackageManager', function (argument) {
        getList($cookies.get('remote_host'));
    });

    $rootScope.$on('refreshData', function (argument, host) {
        $scope.loading = true;
        $scope.currentHost = host;
        getList(host);
    });

    $rootScope.$on('sessionCreated', function () {
        var sessPromise = PubSubService.getSession();
        sessPromise.then(function (sessParam) {
            session = sessParam;
        });
    });

    var sessionPromise = PubSubService.getSession();
    sessionPromise.then(function (val) {
        session = val;

        // session.call('com.bigsql.info');

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
                windowClass: 'comp-details-modal',
                controller: 'ComponentsUpdateController',
            });
        };

        $scope.openInitPopup = function (comp) {
            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/pgInitialize.html',
                controller: 'pgInitializeController',
            });
            modalInstance.component = comp;
            modalInstance.autoStartButton = true;
            modalInstance.dataDir = '';
            modalInstance.host = $scope.currentHost;

        };

        $scope.openDetailsModal = function (comp) {
            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/details.html',
                // windowClass: 'comp-details-modal',
                size: 'lg',
                controller: 'ComponentDetailsController',
                keyboard  : false,
                backdrop  : 'static',
            });
            modalInstance.component = comp;
            modalInstance.isExtension = true;
        };

        session.call('com.bigsql.getBamConfig', ['showInstalled']);
        session.subscribe("com.bigsql.onGetBamConfig", function (settings) {
           $scope.showInstalled = settings[0];
           $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });

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

        var infoData = bamAjaxCall.getCmdData('info');
        infoData.then(function (data) {
            $scope.machineInfo =  data[0];
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
        };

    });

    $scope.installedComps = function (event) {
        session.call('com.bigsql.setBamConfig',['showInstalled', $scope.showInstalled]);
        getList($scope.currentHost); 
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
        if (action == 'update' && compName == 'bam2') {
            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/bamUpdateModal.html',
                windowClass: 'bam-update-modal modal',
                controller: 'bamUpdateModalController',
            });
        } 
    };

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $rootScope.$on('initComp', function (event, comp) {
        currentComponent = getCurrentComponent(comp);
        currentComponent.init = true;
    });

    function wait() {
        $window.location.reload();
    };

    $timeout(function() {
        if ($scope.loading) {
            $window.location.reload();
        };
    }, 10000);

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });
}]);