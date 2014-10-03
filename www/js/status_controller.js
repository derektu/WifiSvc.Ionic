/**
 * Created by Derek on 2014/9/30.
 */

angular.module('starter.controllers').controller('StatusCtrl', function($scope, $http, $ionicLoading, $ionicScrollDelegate) {
    $scope.data = { connectionList: [], error: null };

    $scope.refresh = function() {
        $scope.startSpinner();

        var url = 'http://192.168.11.2:7070/api/getconnectionlist?callback=JSON_CALLBACK';

        // TODO: add user/password auth header
        //
        $http.jsonp(url)
            .success(function(connectionList) {
                $scope.data.connectionList = connectionList;
                $scope.data.error = null;
                $scope.stopSpinner();
                $ionicScrollDelegate.scrollTop();
            })
            .error(function(data, status) {
                $scope.data.error = 'StatusCode=' + status;
                $scope.stopSpinner();
                $ionicScrollDelegate.scrollTop();
            });

    };

    $scope.startSpinner = function() {
        $ionicLoading.show({
            template: '資料查詢中...'
        });
    };

    $scope.stopSpinner = function() {
        $ionicLoading.hide();
    };

    // kick off the first-time refresh
    $scope.refresh();

});
