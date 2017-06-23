angular.module('bigSQL.components').controller('browseModalController', ['$scope', '$uibModalInstance', 'PubSubService', '$rootScope', '$uibModal', 'bamAjaxCall', '$http', '$window', '$interval', '$timeout', function ($scope, $uibModalInstance, PubSubService, $rootScope, $uibModal, bamAjaxCall, $http, $window, $interval, $timeout) {

    $scope.directory = $uibModalInstance.directory;
    $scope.title = $uibModalInstance.title;
    $scope.type = $uibModalInstance.b_type;
    $scope.remoteHost = $uibModalInstance.remote_host;
    $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
    };
    if(!$scope.directory){
        $scope.directory = "/Users/naveen/sql/"
    }
    $scope.backLink = $scope.directory;
    $scope.currentPath = $scope.directory;

    if(!$scope.directory.endsWith('/')){
        $scope.directory = $scope.directory + '/';
    }
    $scope.directory = $scope.directory + "*"
    if($scope.type == 'backup'){
        $scope.directory = $scope.directory + "/"
    }
    var args = {
       "baseDir": $scope.directory,
       "pgcHost":$scope.remoteHost
    };

    var dirlist = $http.post($window.location.origin + '/api/dirlist', args);
    dirlist.then(function (argument) {
        $scope.files = argument.data[0].data;
    });

    $scope.getFiles = function(filename,type){
        if(type == 'd'){
            if(!filename.endsWith('/')){
                var temp_filename = filename + "/*";
            }
            else{
                var temp_filename = filename + "*";
            }
           if($scope.type == 'backup'){
            temp_filename = temp_filename + "/";
           }
           var args = {
               "baseDir": temp_filename,
               "pgcHost":$scope.remoteHost
            };
            var dirlist = $http.post($window.location.origin + '/api/dirlist', args);
            dirlist.then(function (argument) {
                $scope.files = argument.data[0].data;
                $scope.currentPath = filename;
            });
        }
        else{
            $rootScope.$emit("fillFileName",$scope.type,filename);
            $scope.cancel();
        }
    };

    $scope.selectFile = function(filename){
        $rootScope.$emit("fillFileName",$scope.type,filename);
        $scope.cancel();
    };

    $scope.navigateBack = function(index,currentPath){
        var path = currentPath.split('/').slice(1,index+1).join('/');
        $scope.getFiles('/'+path+'/','d');
    };

    $scope.getName = function(filename){
        if(filename.endsWith('/')){
            filename = filename.substring(0, filename.length - 1);
        }
        return filename.split('/').pop();
    }
}]);