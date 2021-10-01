import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from 'src/models/Location';
import { Utils } from 'src/models/Utils';
import { AuthenticationService } from 'src/services/authentication.service';
import { LocationsService } from 'src/services/locations.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  locations: Location[] = [];

  constructor(
    private locationService: LocationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getLocations();
  }

  async getLocations() {
    try {
      this.locations = await this.locationService.getAllLocations();
    }
    catch(error: any) {console.error(error.message)}
  }

  editLocation(locationId: string) {
    this.router.navigateByUrl(`${Utils.EDIT_ADD_LOCATION_URL}/${locationId}`);
  }

}
