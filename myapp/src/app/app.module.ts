// angular inputs
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// we can change from template driven appoach to Reactive with replacing FormsModule with ReactiveFormsModule

import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';



// app imports
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {MatIconModule,MatIconRegistry} from '@angular/material/icon';

import { AuthInterceptor } from './auth/auth-interceptor';
import { AngularMaterialModule } from './angular-material.module';
import { PostModule } from './post/post_module';
import { ErrorIntercepter } from './error-interceptor';
import {MatDialogModule} from '@angular/material/dialog';
import { ErrorComponet } from './error/error.componet';
//import { AuthModule } from './auth/auth.module';







@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponet


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostModule,
    MatDialogModule,
    MatIconModule,
   // AuthModule

  ],
  providers: [
    {provide:HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide:HTTP_INTERCEPTORS, useClass: ErrorIntercepter, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponet]
})
export class AppModule { }
