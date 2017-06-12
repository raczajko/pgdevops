angular.module('bigSQL.components').controller('connectionDetailsController', ['$scope', '$stateParams', 'PubSubService', '$rootScope', '$interval', 'MachineInfo', '$window', 'bamAjaxCall', '$uibModal', '$sce', '$cookies', '$http', function ($scope, $stateParams, PubSubService, $rootScope, $interval, MachineInfo, $window, bamAjaxCall, $uibModal, $sce, $cookies, $http) {

    $scope.alerts = [];
    var subscriptions = [];
    var session = PubSubService.getSession();
    $scope.loading = true;

    $scope.tpsGraph = {open:true} ;
    $scope.connGraph = {open:true};
    $scope.rowsGraph = {open:false}; 
    $scope.connectionStatus = false;   

    $scope.statusColors = {
        "Stopped": "orange",
        "NotInitialized": "yellow",
        "Running": "green"
    };

    $scope.optionList = [
        {label: "Off", value: "0"},
        {label: "5", value: ""},
        {label: "10", value: "10000"},
        {label: "15", value: "15000"},
        {label: "30", value: "30000"}
    ]

    $scope.opt = {
        interval: ''
    }

    $rootScope.$on('updateVersion', function (argument, ver) {
        $scope.connVersion = ver;
        $scope.connectionStatus = true;
    });

    $scope.openPasswordModal = function (argument) {
        var modalInstance = $uibModal.open({
            templateUrl: '../app/components/partials/passwordModal.html',
            controller: 'passwordModalController'
        });
        modalInstance.sid = $scope.connData.sid;
        modalInstance.gid = $scope.connData.gid;
    }

    function checkConnection(sid, gid) {
        var connect_api_url = "/pgstats/conn_status/";
        var data = {
             sid:sid,
             gid:gid,
            };
        $scope.loading = true;
        var connStatus = bamAjaxCall.getData(connect_api_url, data);
        connStatus.then(function (data) {
            if (data.state == 'success') {
                $rootScope.$emit('getDBstatus', $scope.connData.sid, $scope.connData.gid, '');
            }else{
                var statusData = bamAjaxCall.getData("/pgstats/disconnectall/");
                statusData.then(function (data){
                    $scope.loading = false;
                    $scope.connVersion = '';
                    $scope.connectionStatus = false;
                    $rootScope.$emit('clearDBGraphs');
                    if ($scope.connData.has_pwd) {
                        $rootScope.$emit('getDBstatus', $scope.connData.sid, $scope.connData.gid, '');
                    }else{
                        $scope.openPasswordModal();
                    }
                });
            }
        })
    }
    
    $scope.connChange = function (argument) {
            if (!argument && !localStorage.getItem('selectedConnection')) {
                argument = $scope.pgList[0].server_name;
            }else if( !argument && localStorage.getItem('selectedConnection')){
                argument = localStorage.getItem('selectedConnection');
            }
            $scope.selectConn = argument;
            for (var i = $scope.pgList.length - 1; i >= 0; i--) {
                if($scope.pgList[i].server_name == argument){
                    localStorage.setItem('selectedConnection', argument);
                    $scope.loading = false;
                    $scope.connData = $scope.pgList[i];
                    checkConnection($scope.pgList[i].sid, $scope.pgList[i].gid);
                    $scope.activeOverview = true;
                }
            }
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

    var sessionPromise = PubSubService.getSession();

    sessionPromise.then(function (val) {
        session = val;

        var userInfoData = bamAjaxCall.getCmdData('userinfo');
        userInfoData.then(function(data) {
            $scope.userInfo = data;
            session.call('com.bigsql.pgList', [$scope.userInfo.email]);
        });

        session.subscribe("com.bigsql.onPgList", function (data) {
            var data = JSON.parse(data);
            $scope.pgList = data;
            $scope.connChange($cookies.get('openConnection'));
            $scope.loading = false;
            $scope.$apply();

        }).then(function (subscription) {
            subscriptions.push(subscription);
        });
    });

    $scope.statusColors = {
        "Stopped": "orange",
        "NotInitialized": "yellow",
        "Running": "green"
    };
    
    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $rootScope.$on('initComp', function (event, comp) {
        $scope.component.spinner = 'Initializing..';
    });


    $scope.configureTabEvent = function () {
        var data = {
             sid:$scope.connData.sid,
             gid:$scope.connData.gid
            };
        var configureData = bamAjaxCall.getData("/pgstats/config/", data);
        configureData.then(function (data) {
            if (data.state == 'error') {
                $scope.configureTabError = data.msg;
                $scope.errorOnConfig = true;
            }else{
                $scope.errorOnConfig = false;
                $scope.settingsData = data.settings;
                $scope.gridSettings = {
                    expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height: 140px"></div>',
                };

                $scope.gridSettings.columnDefs = [
                    {field: "name", displayName: 'Category'}
                ];

                $scope.gridSettings.enableColumnMenus = false;

                data = data.settings;
                for (var i = 0; i < data.length; i++) {
                    data[i].subGridOptions = {
                        columnDefs: [
                            {
                                field: "name",
                                displayName: "Parameter",
                                cellTemplate: '<div class="ui-grid-cell-contents" title="{{row.entity.short_desc}}"><a>{{ COL_FIELD }}</a></div>'
                            },
                            {field: "setting", displayName: "value"},
                            {field: "short_desc", visible: false}],
                        data: data[i].settings,
                        enableColumnMenus: false
                    }
                }
                $scope.gridSettings.data = data;
            }

        })
    }

    $scope.dataBaseTabEvent = function () {
        var data = {
             sid:$scope.connData.sid,
             gid:$scope.connData.gid
            };
        var databaseData = bamAjaxCall.getData("/pgstats/db_list/", data);
        databaseData.then(function (data) {
            if (data.state == 'error') {
                $scope.databaseTabError = data.msg;
                $scope.errorOnDatabase = true;
            }else{
                $scope.errorOnDatabase = false;
                $scope.myData = data.activity;
                $scope.gridOptions = {
                    data: 'myData', columnDefs: [{
                        field: "datname", displayName: "Database"
                    }, {
                        field: 'owner', displayName: "Owner"
                    }, {
                        field: 'size',
                        displayName: "Size (MB)",
                        cellClass: 'numberCell',
                        headerTooltip: 'This is the total disk space used by the database, which includes all the database objects like Tables and Indexes within that database',
                        sort: {direction: 'desc', priority: 0}
                    }], enableColumnMenus: false
                };
            }
        })
    }

    $scope.activityTabEvent = function () {
        var data = {
             sid:$scope.connData.sid,
             gid:$scope.connData.gid
            };
        var activityData = bamAjaxCall.getData("/pgstats/activity/", data);
        activityData.then(function (data) {
            if (data.state == 'error') {
                $scope.activityTabError = data.msg;
                $scope.errorOnActivity = true;
            }else{
                $scope.errorOnActivity = false;
                var parseData = data.activity;
                if (parseData === undefined || parseData.length == 0) {
                    $scope.activities = '';
                    $scope.noActivities = true;
                    activityTab.empty();
                } else {
                    $scope.noActivities = false;
                    $scope.activities = parseData;
                }
            }
        })
    }

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
        var statusData = bamAjaxCall.getData("/pgstats/disconnectall/");
        statusData.then(function (argument) {
        })
    });

}]);