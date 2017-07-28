angular.module('bigSQL.components').controller('bamLoading', ['$scope', 'PubSubService', '$rootScope', '$window', '$timeout', 'bamAjaxCall', '$http', '$uibModal', function ($scope, PubSubService, $rootScope, $window, $timeout, bamAjaxCall, $http, $uibModal) {

	$scope.bamLoading = true;
	var subscriptions = [];
	var session;
  $scope.showSplash = false;

  var getLablist = bamAjaxCall.getCmdData('lablist');
  getLablist.then(function function_name(lablist) {
      for (var i = lablist.length - 1; i >= 0; i--) {
          if (lablist[i].lab == 'aws' && lablist[i].enabled == 'on') {
              var checkInitLogin = $http.get($window.location.origin + '/check_init_login')
              checkInitLogin.then(function (arg) {
                if (arg.data) {
                  $scope.showSplash = true;
                }
              })
          }
      }
  })

  var sessPromise = PubSubService.getSession();
  sessPromise.then(function (sessPram) {
  	session = sessPram;
  	session.call('com.bigsql.serverStatus');
      session.subscribe("com.bigsql.onServerStatus", function (args) {
      	$scope.bamLoading = false;
        $window.location.href = "#/"
        $scope.$apply();
   			var components = $(JSON.parse(args[0])).filter(function(i,n){ return n.category === 1;});
    		if(components.length != 0){
    			$scope.pgComp = components;
    		}
    }).then(function (subscription) {
        subscriptions.push(subscription);
    });
  });

  $scope.hideBackupRestore = false;
  var getLablist = bamAjaxCall.getCmdData('lablist');
  getLablist.then(function (argument) {
    for (var i = argument.length - 1; i >= 0; i--) {
            if (argument[i].lab == 'dumprest' && argument[i].enabled == 'on') {
                $scope.hideBackupRestore = true;
            }
        }
  });

  $rootScope.$on('hideBackupRestoreNav', function (event, value) {
      if (value == 'on') {
        $scope.hideBackupRestore = true;
      }else{
        $scope.hideBackupRestore = false;
      }
    });

	$timeout(function() {
        if ($scope.bamLoading) {
            $window.location.reload();
        };
    }, 10000);

	$scope.$on('$destroy', function () {
        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }
    });

}]);