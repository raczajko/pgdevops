angular.module('bigSQL.menus').component('bamUpdate', {
    bindings: {},
    controller: function ($rootScope, $scope, PubSubService, MachineInfo, $uibModal, UpdateComponentsService, UpdateBamService) {

        var subscriptions = [];

        var session;

        /**Below function is for displaying update badger on every page.
         **/
        function updateComponents(sessParam) {
            var bamUpdatePromise = UpdateBamService.getBamUpdateInfo();
            bamUpdatePromise.then(function (info) {
                if ( info.component == "bam2" && info.is_current == 0 && info.current_version ) {
                    $scope.bamUpdate = true;
                } else {
                    $scope.bamUpdate = false;
                }
            }, function () {
                throw new Error('failed to subscribe to topic updateComponents', err);
            })


        }


        $rootScope.$on('topMenuEvent', function () {
            var sessPromise = PubSubService.getSession();
            sessPromise.then(function (sessionParam) {
                updateComponents(sessionParam);
            });
        });


        $scope.open = function () {

            var modalInstance = $uibModal.open({
                templateUrl: '../app/components/partials/bamUpdate.html',
                windowClass: 'bam-update-modal modal',
                controller: 'ComponentBamUpdateController',
            });
        };

        /**
         Unsubscribe to all the apis on the template and scope destroy
         **/
        $scope.$on('$destroy', function () {
            for (var i = 0; i < subscriptions.length; i++) {
                session.unsubscribe(subscriptions[i]);
            }
        });


    },
    templateUrl: "../app/menus/partials/bamHeaderUpdate.html"
});