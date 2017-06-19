angular.module('bigSQL.components').controller('ComponentsBackupRestoreController', ['$rootScope', '$scope', '$uibModal', 'PubSubService', 'MachineInfo', 'UpdateComponentsService', '$window', 'bamAjaxCall', '$cookies', '$sce', 'htmlMessages','$http', function ($rootScope, $scope, $uibModal, PubSubService, MachineInfo, UpdateComponentsService, $window, bamAjaxCall, $cookies, $sce, htmlMessages,$http) {
    var subscriptions = [];
    $scope.backup = {};
    $scope.backup.format = 'c';
    $scope.restore = {};
    $scope.restore.format = 'c'
    $scope.alerts = [];
    $scope.showBackupBgProcess = false;
    $scope.backup.advoptions = "-v"
    $scope.restore.advoptions = "-v"
    var session;

    var hostsList = bamAjaxCall.getCmdData('hosts');
    hostsList.then(function (data) {
        if (data.length > 0 && data[0].status == "error") {
            $scope.hosts = [];
        } else {
            $scope.hosts = data;
            if(data.length > 0){
                if(data[0].name != null){
                    $scope.backup.sshserver = data[0].name;
                    $scope.restore.sshserver = data[0].name;
                    $scope.onSSHServerChange(data[0].name,'backup');
                }
                else{
                    $scope.backup.sshserver = data[0].host;
                    $scope.restore.sshserver = data[0].host;
                    $scope.onSSHServerChange(data[0].host,'backup');
                }
            }
        }
     });

     $scope.onPGCChange = function (pgc,b_type) {
        if(pgc){
            var i;
            for(i = 0; i < $scope.pgListRes.length; i++){
                if($scope.pgListRes[i].host == pgc && b_type == 'backup'){
                    $scope.dbHostName = $scope.pgListRes[i].host;
                    $scope.dbPort = $scope.pgListRes[i].port;
                    $scope.dbName = $scope.pgListRes[i].db;
                    $scope.dbUser = $scope.pgListRes[i].db_user;
                }
                else if($scope.pgListRes[i].host == pgc && b_type == 'restore'){
                    $scope.restore.hostname = $scope.pgListRes[i].host;
                    $scope.restore.port = $scope.pgListRes[i].port;
                    $scope.restore.dbname = $scope.pgListRes[i].db;
                    $scope.restore.user = $scope.pgListRes[i].db_user;
                }
            }
        }else{

        }
     };

     $scope.onSSHServerChange = function(sshServer,b_type){
        if(sshServer){
            if(b_type == 'backup'){
                var cookieVal = $cookies.get('directory_'+sshServer);
                if(cookieVal){
                    $scope.backup.directory = cookieVal;
                }else{
                    $scope.backup.directory = "";
                }
            }
            else if(b_type == 'restore'){
                var cookieVal = $cookies.get('directory_'+sshServer);
                if(cookieVal){
                    $scope.restore.directory = cookieVal;
                }else{
                    $scope.restore.directory = "";
                }
            }
        }
     };

     $scope.restoreDataBaseClick = function(){
        $scope.onPGCChange($scope.restore.pgc,'restore');
        $scope.onSSHServerChange($scope.restore.sshserver,'restore');
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
            $scope.pgListRes = data;
            if(data.length > 0){
                $scope.dbPGC = data[0].host;
                $scope.restore.pgc = data[0].host;
                $scope.onPGCChange($scope.dbPGC,'backup');
                $scope.$apply();
            }
        }).then(function (subscription) {
            subscriptions.push(subscription);
        });
        });

        $scope.startBackup = function(){
            $cookies.put('directory_'+$scope.backup.sshserver,$scope.backup.directory);
            var args = {
                "action":"backup",
                "host":$scope.dbHostName,
                "dbName":$scope.dbName,
                "port":$scope.dbPort,
                "username":$scope.dbUser,
                "sshServer":$scope.backup.sshserver,
                "backupDirectory":$scope.backup.directory,
                "fileName":$scope.backup.filename,
                "format":$scope.backup.format,
                "advOptions":$scope.backup.advoptions
            };
            if($scope.backup.password){
                args["password"] = $scope.backup.password;
            }
            var backupDb = $http.post($window.location.origin + '/api/backup_restore_db', args);
            backupDb.then(function (argument) {
                $scope.showBackupBgProcess = true;
                $rootScope.$emit('backgroundProcessStarted', argument.data.process_log_id);
                $scope.backupDbSpinner = false;
            });
            $scope.backup.password = "";
            $scope.backup.filename = "";
        };

        $scope.startRestore = function(){
            $cookies.put('directory_'+$scope.restore.sshserver,$scope.restore.directory);
            var args = {
                "action":"restore",
                "host":$scope.restore.hostname,
                "dbName":$scope.restore.dbname,
                "port":$scope.restore.port,
                "username":$scope.restore.user,
                "sshServer":$scope.restore.sshserver,
                "backupDirectory":$scope.restore.directory,
                "fileName":$scope.restore.filename,
                "format":$scope.restore.format,
                "advOptions":$scope.restore.advoptions
            };
            if($scope.restore.password){
                args["password"] = $scope.restore.password;
            }
            var backupDb = $http.post($window.location.origin + '/api/backup_restore_db', args);
            backupDb.then(function (argument) {
                $scope.showBackupBgProcess = true;
                $rootScope.$emit('backgroundProcessStarted', argument.data.process_log_id);
                $scope.backupDbSpinner = false;
            });
            $scope.restore.password = "";
            $scope.restore.filename = "";
        };

        $rootScope.$on('hidebgProcess', function (argument) {
            $scope.showBackupBgProcess = false;
        });

        //need to destroy all the subscriptions on a template before exiting it
        $scope.$on('$destroy', function () {
            for (var i = 0; i < subscriptions.length; i++) {
                session.unsubscribe(subscriptions[i])
            }
        });
}]);