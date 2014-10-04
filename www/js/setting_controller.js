/**
 * Created by Derek on 2014/9/30.
 */

// TODO: reques timeout
// TODO: spinner可以被cancel (目前的會block住整個screen)

angular.module('starter.controllers')

//.constant('server', 'http://192.168.11.2:7070')
//.constant('server', 'http://localhost:7070')
.constant('server', 'http://220.134.121.195/wifisvc')

.controller('SettingCtrl', function($scope, $http, $ionicLoading, $ionicPopup, $ionicScrollDelegate, server) {
    $scope.data = {deviceList: [], filterMode: -1, error: null};

    $scope.refresh = function() {
        $scope.startSpinner();

        var url = server + '/api/getmacfilterlist2';

        $http.get(url)
            .success(function(result) {
                $scope.data.deviceList = result.deviceList;
                $scope.data.filterMode = result.filterMode;
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

    $scope.getConnectionStatusIconClass = function(device) {
        if (device.enable)
            return "icon ion-wifi positive";
        else
            return "icon ion-close-round assertive";
    };

    $scope.toggleConnectionStatus = function(device) {

        function getChangeConnectionStatusConfirmUI(item) {
            if (item.enable) {
                return "";
            }
            else {
                // disable -> enable
                //
                return "<label class='item item-input'><span class='input-label'>自動關閉時間(分鐘):</span><input ng-model='confirmdata.autorevert' type='text'></label>";
            }
        }

        $scope.confirmdata = {autorevert: 0};

        $ionicPopup.confirm(
            {
                title: device.enable ? "確認要關閉 Wifi ?" : "確認要開啟 Wifi ?",
                template : getChangeConnectionStatusConfirmUI(device),
                scope: $scope
            }
        ).then(function(result) {
            if (result) {
                $scope.enableConnectionStatus(device, !device.enable, $scope.confirmdata.autorevert);
            }
        });
    };

    $scope.enableConnectionStatus = function(device, enable, autorevert) {
        $scope.startSpinner();

        var urlFormat = server + '/api/enablemacfilter?mac=%s&enable=%d&autorevert=%d';
        var url = sprintf(urlFormat, device.mac, enable ? 1:0, autorevert);

        $http.get(url)
            .success(function(result) {
                $scope.stopSpinner();
                $scope.showWaitMsg();
            })
            .error(function(data, status) {
                $scope.data.error = 'StatusCode=' + status;
                $scope.stopSpinner();
            });
    };

    $scope.toggleFilterMode = function() {

        $ionicPopup.confirm(
            {
                title: $scope.data.filterMode == 1 ? "確認要啟動開放連線模式 ?" : "確認要啟動限制連線模式 ?"
            }
        ).then(function(result) {
            if (result) {
                var url = server + '/api/setmacfiltermode?mode=' + ($scope.data.filterMode == 1 ? '0':'1');

                $http.get(url)
                    .success(function(result) {
                        $scope.stopSpinner();
                        $scope.showWaitMsg();
                    })
                    .error(function(data, status) {
                        $scope.data.error = 'StatusCode=' + status;
                        $scope.stopSpinner();
                    });
            }
        });
    };

    $scope.showWaitMsg = function() {
        $ionicPopup.alert(
            {
                title: '設定完成, 請等待一段時間後按Refresh確認狀態.'
            }
        ).then(function(result) {});
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


