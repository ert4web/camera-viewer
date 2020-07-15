// https://orchid.ipconfigure.com/api/

console.log('App started');
var config = {
	timer: 5000
}

var apiUrls = {
	createSession: 'https://orchid.ipconfigure.com/service/sessions/user',
	getFrame: 'https://orchid.ipconfigure.com/service/streams/ID/frame'
}
var cred = {
	"username": "liveviewer",
	"password": "tpain",
	"expiresIn": 0,
	"cookie": "session"
}

var app = angular.module("cameraApp", []);


app.controller("cameraCtrl", function ($scope, $http) {
	console.log("cameraCtrl loaded");
	var cameraCtrl = this;
	cameraCtrl.$scope = $scope;
	cameraCtrl.$http = $http;
	$scope.loadTimer = true;
	$scope.defaultImg = 'camera.jpg';

	console.log('cameraCtrl', cameraCtrl);

	// create session
	cameraCtrl.createSession = function (data) {
		$http.post(apiUrls.createSession, data).then((responseData) => {
			return responseData.data
		})
			.then((responseData) => {
				console.log('responseData', responseData);
				if (responseData && responseData.id) {
					cameraCtrl.userId = responseData.id

					cameraCtrl.auth = btoa(`${cred.username}:${cred.password}`);


					// initial time of camera
					var sendData = {
						time: 1594769451,
						width: 100,
						height: 100,
						fallback: true
					}

					cameraCtrl.getCameraFrames(sendData);
				}
				console.log('cameraCtrl updated', cameraCtrl);
			}, (errData) => {
				console.log('err', errData);
			});
	}

	cameraCtrl.getCameraFrames = function (data) {
		var url = apiUrls.getFrame
		url.replace('ID', data.id);
		var apiConfig = {
			params: {
				time: data.time,
				width: data.width,
				height: data.height,
				fallback: data.fallback
			},
			headers: {
				'Authorization': 'Basic ' + cameraCtrl.auth
			}
		}

		$http.get(url, apiConfig).then((responseData) => {
			return responseData.data
		}).then((responseData) => {
			console.log('camera data with frame', responseData);

			// uncomment code accordingly
			// don't know which in which format is response
			// $scope.imgsrc = 'data:image/png;base64, ' + responseData // if its base64
			// $scope.imgsrc = responseData // if its url


			if ($scope.loadTimer) {
				$scope.loadTimer = false
				cameraCtrl.setTimer();
			}

		}, (errData) => {
			console.log('err', errData);
		});
	}


	cameraCtrl.setTimer = function () {

		$scope.timer = setInterval(() => {
			console.log('getting new frame');

			// time prop with increased time logic goes here
			var passedTime = 1594769451;

			var sendData = {
				time: passedTime,
				width: 100,
				height: 100,
				fallback: true
			}

			cameraCtrl.getCameraFrames(sendData)
			// api call
		}, config.timer);
	}

	cameraCtrl.clearTimer = function () {
		clearInterval($socpe.timer);
	}

	cameraCtrl.createSession(cred);


});
