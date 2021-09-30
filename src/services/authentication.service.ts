import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Utils } from 'src/models/Utils';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private angularFireAuth: AngularFireAuth,
    public router: Router
  ) { }

  async signIn(email: string, password: string) {
    try {
      let user = await this.angularFireAuth.signInWithEmailAndPassword(email, password);
      this.router.navigateByUrl(Utils.LANDING_PAGE_URL)
    }
    catch(error: any) {
      console.error(error.message)
    }
  }

  async getTokenHeader() {
    let token = await this.angularFireAuth.idToken.toPromise();
    if(token) {
      let tokenHeader = new HttpHeaders({
        'Authorization': token
      });
      tokenHeader.append('Content-Type', 'application/json');
      const tokenOptions = {
        headers: tokenHeader
      };
      return tokenOptions;
    }
    else {return {
      headers: new HttpHeaders()
    }}
  }

  async getCurrentUserId(): Promise<string> {
    let currentUser = await this.angularFireAuth.currentUser
    let userId = currentUser?.uid;
    return userId ?? "";
  }
}
