angular.module('bigSQL.components').controller('usersController', ['$scope', '$uibModalInstance', 'PubSubService', 'UpdateComponentsService', 'MachineInfo', '$http', '$window', function ($scope, $uibModalInstance, PubSubService, UpdateComponentsService, MachineInfo, $http, $window) {

    var session;
    var subscriptions = [];
    $scope.components = {};

    var updateSelectedList = [];
    var currentComponent = {};
    var checkUpdates;

    // new user url = /admin/user_management/user/
    // post data format {email: "test@test.com", active: true, role: "2", newPassword: "password", confirmPassword: "password"}
    // reponse : {"active": true, "role": 2, "id": 4, "email": "tt@tt.com"}

    //delete a user : http://localhost:8050/admin/user_management/user/4
    // responce : {"info": "User Deleted.", "errormsg": "", "data": {}, "result": null, "success": 1}

    //update password : /admin/user_management/user/1
    // request method : PUT
    // data for password : {id: 1, newPassword: "123456", confirmPassword: "123456"}
    // data for status change : {id: 2, active: false}
    // data for role change : {id: 2, role: "1"}
    //response {"active": true, "role": 1, "id": 1, "email": "mahesh.balumuri@openscg.com"}

    function getList() {

        $scope.loadingSpinner = true;
        $scope.body = false;

        $http.get($window.location.origin + '/admin/user_management/role/')
            .success(function (data) {
                $scope.roles = data;

            });

        $http.get($window.location.origin + '/admin/user_management/user/')
            .success(function (data) {
                $scope.users = data;

            });

        $scope.loadingSpinner = false;
        $scope.body = true;

    }

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');

    };

    $scope.addAuserForm = function () {

    };

    $scope.deleteUser = function (user_id) {

        var delete_url = $window.location.origin + '/admin/user_management/user/' + user_id;

        $http.delete(delete_url)
            .success(function (data) {

            })
            .error(function (data, status, header, config) {

            });

    };

    $scope.updateUser = function (user_id) {

        var url = $window.location.origin + '/admin/user_management/user/' + user_id;
        var userData = {};

        $http.put(url, userData)
            .success(function (data) {

            })
            .error(function (data, status, header, config) {

            });

    };

    $scope.saveUser = function () {

        var userData = {};
        userData.email = "";
        userData.active = true;
        userData.role = 2;
        userData.newPassword = "";
        userData.confirmPassword = "";

        var res = $http.post($window.location.origin + '/admin/user_management/user/', userData);
        res.success(function (data, status, headers, config) {

            $scope.alerts.push({
                msg: data.email + " has been added sucessfully."
            });

        });

        res.error(function (data, status, headers, config) {

            $scope.alerts.push({
                msg: JSON.stringify({data: data})

            });

        });

    };

    var sessionPromise = PubSubService.getSession();

    sessionPromise.then(function (val) {
        getList();
    });

    /**
     Unsubscribe to all the apis on the template and scope destroy
     **/
    $scope.$on('$destroy', function () {

        for (var i = 0; i < subscriptions.length; i++) {
            session.unsubscribe(subscriptions[i]);
        }

    });

}]);
