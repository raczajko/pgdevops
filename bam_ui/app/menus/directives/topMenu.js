angular.module('bigSQL.menus').component('topMenu', {
    bindings: {},
    controller: function ($rootScope, $scope, $uibModal, UpdateComponentsService, bamAjaxCall, $cookies) {

        /**Below function is for displaying update badger on every page.
         **/

        $scope.hideUpdates = false;
        $scope.currentHost = $cookies.get('remote_host');
        function callList(argument) {
            argument = typeof argument !== 'undefined' ? argument : "";

            $scope.currentHost = argument;
            // var listData = bamAjaxCall.getCmdData('list');
            if (argument=="" || argument == 'localhost'){
                var listData = bamAjaxCall.getCmdData('list');
            } else{
                var listData = bamAjaxCall.getCmdData('hostcmd/list/'+argument);
            }
            listData.then(function(data) {
                var Checkupdates = 0;
                $scope.components = data;
                $scope.pgdevopsUpdate = false;
                for (var i = 0; i < $scope.components.length; i++) {
                    if ($scope.components[i].component != 'pgdevops') {
                        Checkupdates += $scope.components[i].updates;
                    }
                    if ($scope.components[i].component == 'pgdevops' && $scope.components[i].updates == 1) {
                        $scope.pgdevopsUpdate = true;
                    }
                }
                if(!$scope.hideUpdates){
                    $scope.updates = Checkupdates;
                }else{
                    $scope.updates = '';
                }
            });
        }
        
        callList($scope.currentHost);

        $rootScope.$on('refreshData', function (argument, host) {
            callList(host);
        });

        $rootScope.$on('updatesCheck', function (argument, host) {
            callList(host);
        });

        $rootScope.$on('hideUpdates', function (argument, host) {
            $scope.hideUpdates = true;
            callList($scope.currentHost);
        });

        // $rootScope.$on('showUpdates', function (argument) {
        //     $scope.hideUpdates = false; 
        //     callList($scope.currentHost);   
        // });

        var infoData = bamAjaxCall.getCmdData('info');
        infoData.then(function(data) {
            $scope.pgcInfo = data[0];
        });

        var userInfoData = bamAjaxCall.getCmdData('userinfo');
        userInfoData.then(function(data) {
            $scope.userInfo = data;
        });

        $scope.open = function () {

            UpdateComponentsService.setCheckUpdatesAuto();

            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/updateModal.html',
                // windowClass: 'bam-update-modal modal',
                windowClass: 'comp-details-modal',
                controller: 'ComponentsUpdateController',
            });
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
            modalInstance.component = 'pgdevops';
            modalInstance.isExtension = true;
        };

        $scope.usersPopup = function () {

            UpdateComponentsService.setCheckUpdatesAuto();

            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/usersModal.html',
                windowClass: 'modal',
                size: 'lg',
                controller: 'usersController',
            });
        };

    },
    templateUrl: "../app/menus/partials/topMenu.html"
});