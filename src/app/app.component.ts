import { Component, OnInit } from '@angular/core';
import { AppConfig } from './app.config';
import { HttpService } from './services/http.service';
import { UserService } from './services/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	title = 'cctv';

	userId: any = '';
	loadTimer = true;
	timer: any = '';
	auth: any = '';
	defaultImg = 'camera.jpg';
	appConfig = AppConfig;

	activeStream: any = 1;
	imgsrc: any = '';

	constructor(private http: HttpService, private userService: UserService, private sanitizer: DomSanitizer) {
		console.log('cameraCtrl loaded');

	}

	ngOnInit(): void {
		this.createSession(this.appConfig.cred);
	}

	// create session
	createSession(data) {
		console.log('createSession called');
		this.http.post(this.appConfig.apiUrls.createSession, data)
			.then((responseData: any) => {
				console.log('responseData', responseData);
				if (responseData && responseData.id) {
					this.userId = responseData.id;

					this.auth = btoa(`${this.appConfig.cred.username}:${this.appConfig.cred.password}`);

					this.userService.setToken(this.auth);
					this.getStreams();
				}
			}, (errData) => {
				console.log('err in creating session', errData);
			});
	}


	getStreams() {
		console.log('getStreams called');
		this.http.get(this.appConfig.apiUrls.getStreams).then((responseData: any) => {
			console.log('stream data with frame', responseData);

			const streams = responseData.streams;

			// get single stream
			const stream = streams.filter(e => e.id == this.activeStream)[0];
			console.log('wathc stream', stream);


			if (stream) {
				// @todo initial time of camera
				var initialTime = 1594769451;
				var sendData = {
					time: initialTime,
					width: 100,
					height: 100,
					fallback: true,
					id: stream.id
				}

				this.getCameraFrames(sendData);
			}
		}, (err) => {
			console.log('err in getting stream data', err);
		})

	}

	sanitize(url: string) {
		return this.sanitizer.bypassSecurityTrustUrl(url);
	}

	getCameraFrames(data) {
		console.log('getCameraFrames called');
		let url = this.appConfig.apiUrls.getFrame
		url = url.replace('ID', data.id);
		const params = {
			time: data.time,
			width: data.width,
			height: data.height,
			fallback: data.fallback
		}

		this.http.get(url, params, 'blob').then((responseData: any) => {
			console.log('camera data with frame', responseData);

			var img = window.URL.createObjectURL(responseData)
			console.log('img', img);

			// @todo
			// uncomment code accordingly
			// don't know which in which format is response
			// $scope.imgsrc = 'data:image/png;base64, ' + responseData // if its base64
			this.imgsrc = img // if its url


			if (this.loadTimer) {
				this.loadTimer = false
				this.setTimer();
			}

		}, (errData) => {
			console.log('err in getting stream frame', errData);
		});
	}


	setTimer() {

		this.timer = setInterval(() => {
			console.log('getting new frame');

			// @todo
			// time prop with increased time logic goes here
			let passedTime = 1594769451;

			const sendData = {
				time: passedTime,
				width: 100,
				height: 100,
				fallback: true
			}

			this.getCameraFrames(sendData)
			// api call
		}, this.appConfig.timer);
	}

	clearTimer() {
		clearInterval(this.timer);
	}

}
