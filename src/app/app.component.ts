import { Component } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'guideme-admin-web';

  constructor(
    private authenticationService: AuthenticationService
  ) {}

  signOut() {
    this.authenticationService.signOut();
  }
}