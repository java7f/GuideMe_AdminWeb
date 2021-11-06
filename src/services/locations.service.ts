import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Audioguide } from 'src/models/Audioguide';
import { buildRequestWithFile, Utils } from 'src/models/Utils';
import { Location } from 'src/models/Location';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient
  ) { }

  //-------------------------------- LOCATIONS --------------------------------//

  public async getLocation(locationId: string): Promise<Location> {
    let headerOptions = await this.authenticationService.getTokenHeader();
    return await this.http.get<Location>(`${Utils.LOCATION_API_URL}/${locationId}`, headerOptions).toPromise();
  } 
  
  public async getAllLocations(): Promise<Location[]> {
    let headerOptions = await this.authenticationService.getTokenHeader();
    let userId = await this.authenticationService.getCurrentUserId();
    return await this.http.get<Location[]>(`${Utils.LOCATION_API_URL}/all/${userId}`, headerOptions).toPromise();
  }
  
  public async insertLocation(location: Location): Promise<void> {
    let headerOptions = await this.authenticationService.getTokenHeader();
    location.userId = await this.authenticationService.getCurrentUserId();
    await this.http.post<void>(`${Utils.LOCATION_API_URL}`, location, headerOptions).toPromise();
  }
  
  public async updateLocation(location: Location): Promise<void> {
    let headerOptions = await this.authenticationService.getTokenHeader();
    await this.http.put<void>(`${Utils.LOCATION_API_URL}`, location, headerOptions).toPromise();
  }
  
  public async deleteLocation(locationId: string): Promise<boolean> {
    let headerOptions = await this.authenticationService.getTokenHeader();
    return await this.http.delete<boolean>(`${Utils.LOCATION_API_URL}/${locationId}`, headerOptions).toPromise();
  }

  //-------------------------------- AUDIOGUIDES --------------------------------//

  public async getAllAudioguidesForLocation(locationId: string): Promise<Audioguide[]> {
    let headerOptions = await this.authenticationService.getTokenHeader();
    return await this.http.get<Audioguide[]>(`${Utils.AUDIOGUIDES_API_URL}/${locationId}`, headerOptions).toPromise();
  }
  
  public async insertAudioguide(audioguide: Audioguide): Promise<void> {
    let headerOptions = await this.authenticationService.getTokenHeader();
    await this.http.post<void>(`${Utils.AUDIOGUIDES_API_URL}`, audioguide, headerOptions).toPromise();
  }

  public async deleteAudioguide(audioguideId: string): Promise<boolean> {
    let headerOptions = await this.authenticationService.getTokenHeader();
    return await this.http.delete<boolean>(`${Utils.AUDIOGUIDES_API_URL}/${audioguideId}`, headerOptions).toPromise();
  }

  public async updateAudioguide(audioguide: Audioguide): Promise<void> {
    let headerOptions = await this.authenticationService.getTokenHeader();
    await this.http.put<void>(`${Utils.AUDIOGUIDES_API_URL}`, audioguide, headerOptions).toPromise();
  }

  public async getAudioguide(audioguideId: string): Promise<Audioguide> {
    let headerOptions = await this.authenticationService.getTokenHeader();
    return await this.http.get<Audioguide>(`${Utils.AUDIOGUIDES_API_URL}/getAudioguide/${audioguideId}`, headerOptions).toPromise();
  }
}
