import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { response } from "express";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";

@Injectable({providedIn: "root"})
export class AuthService {
  private isAuthenticated = false
  private token: string
  private tokenTimer : NodeJS.Timer
  private authStatusListenar = new Subject<boolean>();

  constructor (private http: HttpClient, private router: Router){}

  getToken(){
    return this.token
  }

  getIsAuth(){
    return this.isAuthenticated
  }
  getAuthStatusListenar() {
    return this.authStatusListenar.asObservable();
  }

  createUser(email:string,password:string){

    const authData : AuthData = {email: email, password: password}
    //console.log('CreateUser before sending post')
    //console.log(authData)
    this.http.post("http://localhost:3000/api/user/signup", authData).subscribe(()=> {
      this.router.navigate(["/"])
    },error => {
      this.authStatusListenar.next(false)
    })
  }


  login(email: string, password: string){
    // const authData : AuthData = {email: email, password: password}
    // console.log(authData)
    // this.http.post("http://localhost:3000/api/user/login", authData).subscribe( data =>{
    //   console.log(data)
    // })

    // this.router.navigate(['/'])
    const authData : AuthData = {email: email, password: password}
    this.http.post<{token: string, expiresIn: number}>("http://localhost:3000/api/user/login", authData)
   .subscribe(response => {
      //console.log(response)
      const token = response.token
      this.token = token
      if(token){
      const expiresInDuration = response.expiresIn
      console.log(expiresInDuration)
      this.setAuthTimer(expiresInDuration)
      this.isAuthenticated = true
      this.authStatusListenar.next(true)
      const now = new Date()
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
      console.log(expirationDate)
      this.saveAuthData(token,expirationDate)
      this.router.navigate(['/'])
      }

    },error=> {
      this.authStatusListenar.next(false)
    })
  }

  // automaticaly authenticate the user
  autoAuthUser(){
    const authInformation = this.getAuthData()
    if(!authInformation){
      return
    }
    const now = new Date()
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if(expiresIn > 0){
      this.token = authInformation.token
      this.isAuthenticated = true
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListenar.next(true)
    }
  }

  logout(){
    this.token = null
    this.isAuthenticated = false
    this.authStatusListenar.next(false)
    clearTimeout(this.tokenTimer)
    this.clearAuthData()
    this.router.navigate(['/'])

  }

  private setAuthTimer(duration:number){
    console.log('Setting timer: ' + duration)
    this.tokenTimer = setTimeout(()=> {
      this.logout()
    }, duration  * 1000 )

  }

  private saveAuthData(token:string, expirationDate: Date){
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())

  }

  private clearAuthData(){
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
  }

  private getAuthData(){
    const token = localStorage.getItem('token')
    const expirationDate = localStorage.getItem('expiration')
    if(!token || !expirationDate){
      return
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }
}
