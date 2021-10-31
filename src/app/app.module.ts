import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AuthenticationService } from 'src/services/authentication.service';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { environment } from 'src/environments/environment';
import { LandingComponent } from './landing/landing.component';
import { LocationsService } from 'src/services/locations.service';
import { AddLocationComponent } from './add-location/add-location.component';

import { GoogleMapsModule } from '@angular/google-maps'
import { VimeModule } from '@vime/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingComponent,
    AddLocationComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    GoogleMapsModule,
    VimeModule,
    FontAwesomeModule
  ],
  providers: [
    AuthenticationService,
    LocationsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
