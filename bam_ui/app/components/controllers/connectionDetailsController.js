angular.module('bigSQL.components').controller('connectionDetailsController', ['$scope', '$stateParams', 'PubSubService', '$rootScope', '$interval', 'MachineInfo', '$window', 'bamAjaxCall', '$uibModal', '$sce', '$cookies', '$http', function ($scope, $stateParams, PubSubService, $rootScope, $interval, MachineInfo, $window, bamAjaxCall, $uibModal, $sce, $cookies, $http) {

    $scope.alerts = [];
    var subscriptions = [];
    var session = PubSubService.getSession();
    $scope.loading = true;

    $scope.tpsGraph = {open:true} ;
    $scope.connGraph = {open:true};
    $scope.rowsGraph = {open:false};    

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
    });

    $rootScope.$on('navToPwd', function (argument) {
        
    })
    
    $scope.connChange = function (argument) {
        if (!argument && !localStorage.getItem('selectedConnection')) {
            argument = $scope.pgList[0].server_name;
        }else if( !argument && localStorage.getItem('selectedConnection')){
            argument = localStorage.getItem('selectedConnection');
        }
        $scope.selectConn = argument;
        $scope.loading = true;
        for (var i = $scope.pgList.length - 1; i >= 0; i--) {
            if($scope.pgList[i].server_name == argument){
                localStorage.setItem('selectedConnection', argument);
                $scope.loading = false;
                $scope.connData = $scope.pgList[i];
                $rootScope.$emit('getDBstatus', $scope.pgList[i].sid, $scope.pgList[i].gid, '');
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

    $rootScope.$on('sessionCreated', function () {
        var sessPromise = PubSubService.getSession();
        sessPromise.then(function (sessParam) {
            session = sessParam;
            $rootScope.$emit('topMenuEvent');
        });
    });

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
            $scope.connChange($rootScope.connection_comp);
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

    //need to destroy all the subscriptions on a template before exiting it
    $scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    });

}]);