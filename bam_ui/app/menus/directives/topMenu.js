angular.module('bigSQL.menus').component('topMenu', {
    bindings: {},
    controller: function ($rootScope, $scope, PubSubService, $uibModal, UpdateComponentsService, MachineInfo, $http, $window) {

        var subscriptions = [];

        /**Below function is for displaying update badger on every page.
         **/
        
        // $rootScope.$on('topMenuEvent',function () {

            var sessPromise = PubSubService.getSession();

            sessPromise.then(function (session) {
                $http.get($window.location.origin + '/api/list')
                .success(function(data) {
                    var Checkupdates = 0;
                    $scope.components = data;
                    for (var i = 0; i < $scope.components.length; i++) {
                        if ($scope.components[i].component != 'bam2') {
                            Checkupdates += $scope.components[i].updates;
                        }
                    }
                    $scope.updates = Checkupdates;
                });

                $http.get($window.location.origin + '/api/info')
                .success(function(data) {
                    $scope.pgcInfo = data[0];
                });

                $http.get($window.location.origin + '/api/userinfo')
                .success(function(data) {
                        $scope.userInfo = data;
                });


            });

            $scope.open = function () {

                UpdateComponentsService.setCheckUpdatesAuto();

                var modalInstance = $uibModal.open({
                    templateUrl: '../app/components/partials/updateModal.html',
                    controller: 'ComponentsUpdateController',
                });
            };
        // });
    },
    templateUrl: "../app/menus/partials/topMenu.html"
});