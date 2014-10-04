/**
 * Created by Derek on 2014/9/30.
 */
// TODO: reques timeout
// TODO: spinner可以被cancel (目前的會block住整個screen)

angular.module('starter.controllers')

//.constant('server', 'http://192.168.11.2:7070')
//.constant('server', 'http://localhost:7070')
.constant('server', 'http://220.134.121.195/wifisvc')

.controller('StatusCtrl', function($scope, $http, $ionicLoading, $ionicScrollDelegate, server) {
    $scope.data = { connectionList: [], error: null };

    $scope.refresh = function() {
        $scope.startSpinner();

        var url = server + '/api/getconnectionlist';

        $http.get(url)
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
