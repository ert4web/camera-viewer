import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	userData: any = {};

	constructor() { }

	setToken(token) {
		this.userData.authToken = token;
		console.log('token set');
	}

	getToken() {
		console.log('set token called', this.userData);
		if (this.userData && this.userData.authToken) {
			return this.userData.authToken;
		}
		return '';
	}
}
