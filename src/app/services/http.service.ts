import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Injectable({
	providedIn: 'root'
})
export class HttpService {

	constructor(private http: HttpClient, private userService: UserService) { }

	createAuthorizationHeader() {

		let headers: HttpHeaders = new HttpHeaders();
		const authToken = this.userService.getToken();
		if (authToken) {
			headers = headers.append('Authorization', 'Basic ' + authToken);
		}

		return headers;
	}

	get(url: string, params?: any, responseType?: any) {
		const headers: any = this.createAuthorizationHeader();

		return this.http.get(url, {
			headers: headers,
			params: params ? params : null,
			responseType
		}).toPromise();
	}

	post(url: string, data: any) {

		const headers: any = this.createAuthorizationHeader();

		return this.http.post(url, data, {
			headers: headers
		}).toPromise();
	}

	handleResponse = (error: any) => {
		console.log('error in handler', error);
		return Promise.reject(error.error || error.message);
	}
}
