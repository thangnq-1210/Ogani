import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = "http://localhost:8080/api/auth/";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }

  register(username: string, email: string, password: string):Observable<any>{
    return this.http.post(AUTH_API + 'register',{username,email,password},httpOptions);
  }

  login(email: string,password: string):Observable<any>{
    return this.http.post(AUTH_API+ "login",{email,password},httpOptions);
  }

  logout():Observable<any>{
    return this.http.post(AUTH_API + "logout",{},httpOptions);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(AUTH_API + 'forgot-password', { email }, httpOptions);
  }  

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.put(AUTH_API + 'reset-password', { token, newPassword }, httpOptions);
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(AUTH_API + 'confirm', {params: { token }});    
  }
}
