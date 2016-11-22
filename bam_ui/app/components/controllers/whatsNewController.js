angular.module('bigSQL.components').controller('whatsNewController', ['$scope','$rootScope', '$uibModalInstance', 'PubSubService', '$sce', 'bamAjaxCall', function ($scope, $rootScope, $uibModalInstance, PubSubService, $sce, bamAjaxCall) {

	$scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    var whatNew = bamAjaxCall.getCmdData('relnotes/' + $uibModalInstance.component )
    whatNew.then(function (data) {
        $scope.whatsNewText = $sce.trustAsHtml(data);
    });

}]);