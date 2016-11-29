angular.module('bigSQL.menus').component('topMenu', {
    bindings: {},
    controller: function ($rootScope, $scope, $uibModal, UpdateComponentsService, bamAjaxCall) {

        /**Below function is for displaying update badger on every page.
         **/

        $scope.currentHost = '';
        function callList(argument) {
            argument = typeof argument !== 'undefined' ? argument : "";
            $scope.currentHost = argument;
            // var listData = bamAjaxCall.getCmdData('list');
            if (argument==""){
                var listData = bamAjaxCall.getCmdData('list');
            } else{
                var listData = bamAjaxCall.getCmdData('hostcmd/list/'+argument);
            }
            listData.then(function(data) {
                var Checkupdates = 0;
                $scope.components = data;
                for (var i = 0; i < $scope.components.length; i++) {
                    if ($scope.components[i].component != 'devops') {
                        Checkupdates += $scope.components[i].updates;
                    }
                }
                $scope.updates = Checkupdates;
            });
        }
        
        callList($rootScope.remote_host);

        $rootScope.$on('refreshData', function (argument, host) {
            callList(host);
        });

        $rootScope.$on('updatesCheck', function (argument, host) {
            callList(host);
        });

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
                windowClass: 'bam-update-modal modal',
                controller: 'ComponentsUpdateController',
            });
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