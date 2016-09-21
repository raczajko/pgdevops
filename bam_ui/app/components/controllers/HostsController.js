angular.module('bigSQL.components').controller('HostsController', ['$scope', '$uibModal', 'PubSubService', '$state', 'UpdateComponentsService', '$filter', '$rootScope', '$timeout', '$window', '$http', function ($scope, $uibModal, PubSubService, $state, UpdateComponentsService, $filter, $rootScope, $timeout, $window, $http) {

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

    $scope.statusColors = {
        "Stopped": "orange",
        "Not Initialized": "yellow",
        "Running": "green"
    };


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
            if (comps[i]['category_desc'] == 'PostgreSQL') {
                pgComps.push(comps[i]);
            } else {
                nonPgComps.push(comps[i]);
            }
            ;
        }
        return pgComps.reverse().concat(nonPgComps);
    }

    $scope.loadHost = function (idx, refresh) {
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
            console.log("opened");

            $http.get($window.location.origin + '/api/hostcmd/info/' + $scope.hostsList[idx].host)
                .success(function (data) {
                    console.log(data[0]);
                    $scope.hostsList[idx].hostInfo = data[0];

                })
                .error(function (error) {
                });


            $http.get($window.location.origin + '/api/hostcmd/status/' + $scope.hostsList[idx].host)
                .success(function (data) {
                    $scope.hostsList[idx].comps = data;
                    if ($scope.hostsList[idx].comps.length == 0) {
                        $scope.hostsList[idx].showMsg = true;
                    } else {
                        $scope.hostsList[idx].showMsg = false;
                    }
                });


        }
    };


    function getList(argument) {
        $http.get($window.location.origin + '/api/hosts')
            .success(function (data) {
                $scope.hostsList = data;
                $scope.nothingInstalled = false;
                $scope.loading = false;
            })
            .error(function (error) {
                $timeout(wait, 5000);
                $scope.loading = false;
                $scope.retry = true;
            });

    };

    function callInfo(argument) {
        $http.get($window.location.origin + '/api/info')
            .success(function (data) {
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


    $scope.installedComps = function (event) {
        session.call('com.bigsql.setBamConfig', ['showInstalled', $scope.showInstalled]);
        getList();
        // session.call('com.bigsql.list');
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

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i])
        }
    });
}]);
