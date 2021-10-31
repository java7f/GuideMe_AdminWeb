import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AddLocationComponent } from './add-location/add-location.component';
import { LoginComponent } from './login/login.component';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToLanding = () => redirectLoggedInTo(['landing']);

const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: "login", component: LoginComponent, ...canActivate(redirectLoggedInToLanding) }, // login
  { path: "landing", component: LandingComponent, ...canActivate(redirectUnauthorizedToLogin) }, // login
  { path: "location/:id", component: AddLocationComponent, ...canActivate(redirectUnauthorizedToLogin) }, // edit locations
  { path: "location", component: AddLocationComponent, ...canActivate(redirectUnauthorizedToLogin) } // add locations
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
