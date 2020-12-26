import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    ValueComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent
   ],
  imports: [
    BsDropdownModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule

  ],
  providers: [
    AuthService,
    ErrorInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
