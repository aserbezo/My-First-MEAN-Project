import {Component, OnDestroy, OnInit} from '@angular/core'
import { NgForm } from '@angular/forms'
import { Subscription } from 'rxjs'
import { AuthService } from '../auth.service'

@Component({

  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit , OnDestroy{
   isLoading = false
   private authStatusSub: Subscription

   constructor (public authService: AuthService) {}

  ngOnInit(): void {
      this.authStatusSub = this.authService.getAuthStatusListenar().subscribe(
        authStatus => {
          this.isLoading = false
        }
      )

  }

   onSignup(form: NgForm){
     //console.log(form.value)
     if(form.invalid){
       return
     }
     this.isLoading = true
     this.authService.createUser(form.value.email, form.value.password)
     //console.log(this.authService)
   }
   ngOnDestroy(): void {
       this.authStatusSub.unsubscribe()
   }
}
