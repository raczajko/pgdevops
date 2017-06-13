angular.module('bigSQL.components').controller('ComponentsBackupRestoreController', ['$rootScope', '$scope', '$uibModal', 'PubSubService', 'MachineInfo', 'UpdateComponentsService', '$window', 'bamAjaxCall', '$cookies', '$sce', 'htmlMessages', function ($rootScope, $scope, $uibModal, PubSubService, MachineInfo, UpdateComponentsService, $window, bamAjaxCall, $cookies, $sce, htmlMessages) {
    var subscriptions = [];
    $scope.alerts = [];
    $scope.dbBackupFormat = 'c';
    var session;
    var hostsList = bamAjaxCall.getCmdData('hosts');
    hostsList.then(function (data) {
        if (data.length > 0 && data[0].status == "error") {
            $scope.hosts = [];
        } else {
            $scope.hosts = data;
        }
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
            $scope.pgListRes = data;
            $scope.$apply();
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });
        });

        //need to destroy all the subscriptions on a template before exiting it
        $scope.$on('$destroy', function () {
            for (var i = 0; i < subscriptions.length; i++) {
                session.unsubscribe(subscriptions[i])
            }
        });

        $scope.onSelectChange = function (pgc) {
            if(pgc){
                debugger
                $scope.dbHostName=pgc.server_name;
            }else{

            }
        };

        $scope.startBackup = function(){
            var args = {
                'host':$scope.dbHostName,
                'dbName':$scope.dbName,
                'port':$scope.dbPort,
                'username':$scope.dbUser,
                'password':$scope.dbPassword,
                'sshServer':$scope.selecthost,
                'directory':$scope.dbBackupDirectory,
                'fileName':$scope.dbBackupFileName,
                'format':$scope.dbBackupFormat
            };
            var backupDb = $http.post($window.location.origin + '/api/backup_database', args);
            backupDb.then(function (argument) {
                $scope.backupDbSpinner = false;
            });
            debugger
        }
}]);