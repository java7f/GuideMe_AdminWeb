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

  /**
   * Signs in a user given its credentials
   * @param email The user email
   * @param password The user password
   */
  async signIn(email: string, password: string) {
    try {
      let user = await this.angularFireAuth.signInWithEmailAndPassword(email, password);
      this.router.navigateByUrl(Utils.LANDING_PAGE_URL)
    }
    catch(error: any) {
      console.error(error.message)
    }
  }

  async signOut() {
    try {
      await this.angularFireAuth.signOut();
      this.router.navigateByUrl(Utils.LOGIN_URL)
    }
    catch(error: any) {
      console.error(error.message)
    }
  }

  /**
   * Builds up the headers for an http request with the current 
   * user token
   * @returns Http header options
   */
  async getTokenHeader() {
    let currentUser = await this.angularFireAuth.currentUser;
    let userIdToken = await currentUser?.getIdToken();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + userIdToken
      }),
    };
    return httpOptions;
  }

  /**
   * Gets the current user id
   * @returns String Promise with the current user id
   */
  async getCurrentUserId(): Promise<string> {
    let currentUser = await this.angularFireAuth.currentUser
    let userId = currentUser?.uid;
    return userId ?? "";
  }
}
