angular.module('bigSQL.menus').component('topMenu', {
    bindings: {},
    controller: function ($rootScope, $scope, $uibModal, UpdateComponentsService, bamAjaxCall) {

        /**Below function is for displaying update badger on every page.
         **/

        function callList(argument) {
            var listData = bamAjaxCall.getCmdData('list');
            listData.then(function(data) {
                var Checkupdates = 0;
                $scope.components = data;
                for (var i = 0; i < $scope.components.length; i++) {
                    if ($scope.components[i].component != 'bam2') {
                        Checkupdates += $scope.components[i].updates;
                    }
                }
                $scope.updates = Checkupdates;
            });
        }
        
        callList();

        $rootScope.$on('topMenuEvent', function () {
            callList();
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