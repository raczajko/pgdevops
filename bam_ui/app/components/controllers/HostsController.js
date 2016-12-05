angular.module('bigSQL.components').controller('HostsController', ['$scope', '$uibModal', 'PubSubService', '$state', 'UpdateComponentsService', '$filter', '$rootScope', '$timeout', '$window', '$http', '$location', 'bamAjaxCall', '$interval', function ($scope, $uibModal, PubSubService, $state, UpdateComponentsService, $filter, $rootScope, $timeout, $window, $http, $location, bamAjaxCall, $interval) {

    $scope.alerts = [];

    var subscriptions = [];
    $scope.components = {};

    var currentComponent = {};
    var parentComponent = {};
    var dependentCount = 0;
    var depList = [];
    var session;
    var pid;
    var stopStatusCall;
    var getListCmd = false;
    $scope.updateSettings;
    $scope.loading = true;
    $scope.retry = false;
    $scope.disableShowInstalled = false;

    $scope.statusColors = {
        "Stopped": "orange",
        "Not Initialized": "yellow",
        "Running": "green"
    };

    var apis = {
        "Stop": "com.bigsql.stop",
        "Restart": "com.bigsql.restart",
        "Initialize": "com.bigsql.init",
        "Start": "com.bigsql.start",
        "Remove": "com.bigsql.remove"
    };

    var host_info ;

    var getCurrentComponent = function (name, host) {
        for (var i = 0; i < $scope.hostsList.length; i++) {
            if($scope.hostsList[i].host == host){
                for (var j = 0; j < $scope.hostsList[i].comps.length; j++) {
                    if ($scope.hostsList[i].comps[j].component == name) {
                        currentComponent = $scope.hostsList[i].comps[j];
                        return currentComponent;
                    }
                }
            }
        }
    };

    function changePostgresOrder(data) {
        var comps = data;
        var pgComps = [];
        var nonPgComps = [];

        for (var i = 0; i < comps.length; i++) {
            if (comps[i]['category_desc'] == 'PostgreSQL') {
                pgComps.push(comps[i]);
            } else {
                nonPgComps.push(comps[i]);
            }
            ;
        }
        return pgComps.reverse().concat(nonPgComps);
    }

    $scope.updateComps =  function (idx) {
        var remote_host = $scope.hostsList[idx].host;
        var status_url = 'hostcmd/status/' + remote_host;

        if (remote_host == "localhost") {
            status_url = 'status';
            remote_host = "";
        }

        var statusData = bamAjaxCall.getCmdData(status_url);
        statusData.then(function(data) {
                $scope.hostsList[idx].comps = data;
                if ($scope.hostsList[idx].comps.length == 0) {
                    $scope.hostsList[idx].showMsg = true;
                } else {
                    $scope.hostsList[idx].showMsg = false;
                }
            });
    }

    $scope.loadHost = function (idx, refresh) {
        $interval.cancel(stopStatusCall);
        $scope.hostsList[idx].comps = '';
        var isOpened = false;
        if (typeof $scope.hostsList[idx].open == "undefined") {
            isOpened = true;

        } else if ($scope.hostsList[idx].open) {
            isOpened = false;

        } else {
            isOpened = true;
        }
        if (refresh) {
            isOpened = refresh;
        }

        if (isOpened) {
            var remote_host = $scope.hostsList[idx].host;
            var status_url = 'hostcmd/status/' + remote_host;

            if (remote_host == "localhost") {
                status_url = 'status';
                remote_host = "";
            }

            var statusData = bamAjaxCall.getCmdData(status_url);
            statusData.then(function(data) {
                    $scope.hostsList[idx].comps = data;
                    if ($scope.hostsList[idx].comps.length == 0) {
                        $scope.hostsList[idx].showMsg = true;
                    } else {
                        $scope.hostsList[idx].showMsg = false;
                    }
                });

            stopStatusCall = $interval(function (){$scope.updateComps(idx)}, 5000);
        }
    };

    $scope.loadHostsInfo = function (idx) {

            var remote_host = $scope.hostsList[idx].host;
            var info_url = 'hostcmd/info/' + remote_host;

            if (remote_host == "localhost") {
                info_url = 'info';
                remote_host = "";
            }

            var infoData = bamAjaxCall.getCmdData(info_url);
            infoData.then(function(data) {
                $scope.hostsList[idx].hostInfo = data[0];
            });
    };

    $scope.UpdateManager = function (idx) {
        var remote_host = $scope.hostsList[idx].host;
        if (remote_host == "localhost") {
            remote_host = "";
        }

        $rootScope.remote_host = remote_host;
        $location.path('/components/view');


    };

    $scope.deleteHost = function (idx) {
        var hostToDelete = $scope.hostsList[idx].host;
        session.call('com.bigsql.deleteHost', [$scope.hostsList[idx].host]);
        session.subscribe("com.bigsql.onDeleteHost", function (data) {
            getList();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });
    }

    function hostsInfo(){
        $scope.hostsInfoData = [];
        for (var i = $scope.hostsList.length - 1; i >= 0; i--) {
            $scope.loadHostsInfo(i);
        }
    }

    function getList(argument) {
        $http.get($window.location.origin + '/api/hosts')
            .success(function (data) {
                var localhost = [{"host": "localhost"}];


                //all_hosts.
                $scope.hostsList = data;
                $scope.nothingInstalled = false;
                $scope.loading = false;
                //hostsInfo();
            })
            .error(function (error) {
                $timeout(wait, 5000);
                $scope.loading = false;
                $scope.retry = true;
            });

    };

    getList();

    $rootScope.$on('addedHost', function () {
        getList();
    });

    $rootScope.$on('sessionCreated', function () {
        var sessPromise = PubSubService.getSession();
        sessPromise.then(function (sessParam) {
            session = sessParam;
        });
    });

    $scope.action = function ( event, host) {
        var showingSpinnerEvents = ['Initialize', 'Start', 'Stop'];
        if(showingSpinnerEvents.indexOf(event.target.innerText) >= 0 ){
            currentComponent = getCurrentComponent( event.currentTarget.getAttribute('value'), host);
            currentComponent.showingSpinner = true;
        }
        if (event.target.tagName == "A") {
            if(host == 'localhost'){
                session.call(apis[event.target.innerText], [event.currentTarget.getAttribute('value')]);
            }else{
                var cmd = event.target.innerText.toLowerCase();
                if( cmd == 'initialize'){
                    cmd = 'init';
                }
                var event_url = cmd + '/' + event.currentTarget.getAttribute('value') + '/' + host;
                var eventData = bamAjaxCall.getCmdData(event_url);
            }
        }
        ;
    };

    $scope.installedComps = function (event) {
        session.call('com.bigsql.setBamConfig', ['showInstalled', $scope.showInstalled]);
        getList();
    };


    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $timeout(function () {
        if ($scope.loading) {
            $window.location.reload();
        }
        ;
    }, 5000);

    function wait() {
        $window.location.reload();
    };

    $scope.open = function (idx) {
            $scope.editHost = '';
            if(idx){
                $scope.editHost = $scope.hostsList[idx];
            }

            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/addHostModal.html',
                windowClass: 'modal',
                controller: 'addHostController',
                scope: $scope,
            });
        };

    $scope.showTop = function (idx) {
        var remote_host = $scope.hostsList[idx].host;
        if (remote_host == "localhost") {
            remote_host = "";
        }

        $scope.top_host = remote_host;
        $scope.host_info = $scope.hostsList[idx].hostInfo;


        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/topModal.html',
            windowClass: 'modal',
            size: 'lg',
            controller: 'topController',
            scope : $scope
        });
    };

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });
}]);

