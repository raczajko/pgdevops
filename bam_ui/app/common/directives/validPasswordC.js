angular.module('bigSQL.common').directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.initForm.password.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
}).directive('validPort', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var invalidLen = parseInt(viewValue) < 1000 || parseInt(viewValue) > 9999
                ctrl.$setValidity('invalidLen', !invalidLen)
                scope.portGood = !invalidLen
            })
        }
    }
});