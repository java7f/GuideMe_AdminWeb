import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import { Audioguide } from 'src/models/Audioguide';
import { Location } from 'src/models/Location';
import { LocationsService } from 'src/services/locations.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css']
})
export class AddLocationComponent implements OnInit {

  @ViewChild('mapSearchField') searchField: ElementRef;
  @ViewChild(GoogleMap) map: GoogleMap;

  isCollapsed = true;

  url: any;
  msg: string = "";
  
  audioFile: File;
  audiomsg: string = "";
  audiourl: any;
  status: boolean = false;
  audioFileSaved: string = "notYet";

  locationInfo: Location = new Location();
  audioguide: Audioguide = new Audioguide();
  audioguideList: Audioguide[] = [];
  locationId: string;

  constructor(
    private locationService: LocationsService,
    private route: ActivatedRoute 
  ) {}

  ngOnInit() {
    this.locationId = this.route.snapshot.paramMap.get('id')!;
    if(this.locationId) {
      this.getLocation()
      this.getAudioguides()
    }
  }

  ngAfterViewInit() {
    const searchBox = new google.maps.places.SearchBox(this.searchField.nativeElement);
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.searchField.nativeElement);

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if(places.length === 0) {
        return;
      }
      const bounds = new google.maps.LatLngBounds();
      places.forEach(place => {
        if(!place.geometry || !place.geometry.location) {
          return;
        }
        if(place.geometry.viewport) {
          // only geocodes have viewport
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
        this.locationInfo.coordinates.latitude = place.geometry.location.lat();
        this.locationInfo.coordinates.longitude = place.geometry.location.lng();
      });
      this.map.fitBounds(bounds);
    })
  }

  onFileChanged(event: any) {
    if(!event.target.files[0] || event.target.files[0].length == 0) {
			this.msg = 'You must select an image';
			return;
		}

    var mimeType = event.target.files[0].type;
		
		if (mimeType.match(/image\/*/) == null) {
			this.msg = "Only images are supported";
			return;
		}
		
		var reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		
		reader.onload = (_event) => {
      this.msg = "";
			this.url = reader.result;
      this.locationInfo.locationPhotoFileBase64 = this.url.toString().split(',')[1]; 
      this.locationInfo.locationPhotoFileName = event.target.files[0].name;
		}
  }

  handleFileInput(event: any) {
    var mimeType = event.target.files[0].type;
		if (mimeType.match(/audio\/*/) == null) {
			this.audiomsg = "Only audios are supported";
			return;
		}

    this.audioFile = event.target.files[0];
    this.audiourl = URL.createObjectURL(event.target.files[0]);

    this.audioguide.name = this.audioFile.name;
    this.audioguide.locationId = this.locationId;

    var reader = new FileReader();
		reader.readAsDataURL(this.audioFile);
		
		reader.onload = (_event) => {
			let url  = reader.result;
      this.audioguide.audioFileBase64 = url!.toString().split(',')[1]; 
      this.audioguide.audioFileName = event.target.files[0].name;

      if(url != null || url != ""){
        this.status = true;
      } 
		}

    this.audiomsg = "";
  }

  ngOnDestroy() {
  }

  async saveLocation() {
    try {
      console.log(this.locationInfo);
      await this.locationService.insertLocation(this.locationInfo);
    }
    catch(error: any) {
      console.log(error.message);
    }
  }

  async getLocation() {
    try {
      this.locationInfo = await this.locationService.getLocation(this.locationId);
    }
    catch(error: any) {
      console.log(error.message);
    }
  }

  async saveAudiofile() {
    this.audioFileSaved = "notyet"
    try {
      await this.locationService.insertAudioguide(this.audioguide);
      this.status = false;
      this.audioFileSaved = "yes";
      this.audioguideList = await this.locationService.getAllAudioguidesForLocation(this.locationId);
    }
    catch(error: any) {
      this.audioFileSaved = "no";
      console.log(error.message);
    }
  }

  async getAudioguides() {
    try {
      this.audioguideList = await this.locationService.getAllAudioguidesForLocation(this.locationId);
      console.log(this.audioguideList)
    }
    catch(error: any) {
      console.log(error.message);
    }
  }
}
