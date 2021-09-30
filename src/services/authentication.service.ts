import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

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
      console.log(user);
    }
    catch(error: any) {
      console.error(error.message)
    }
  }

}
