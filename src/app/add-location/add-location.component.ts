import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { Audioguide } from 'src/models/Audioguide';
import { Address, Coordinate, Location } from 'src/models/Location';
import { LocationsService } from 'src/services/locations.service';
import { Location as LocationNav } from '@angular/common';
import { faEdit, faTrash, faSave } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-add-location',
    templateUrl: './add-location.component.html',
    styleUrls: ['./add-location.component.css']
})
export class AddLocationComponent implements OnInit {

    @ViewChild('mapSearchField') searchField: ElementRef;
    @ViewChild(GoogleMap) map: GoogleMap;
    markerOptions: google.maps.MarkerOptions = {draggable: false};
    markerPosition: google.maps.LatLngLiteral;

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
    editAudiofile: Audioguide = new Audioguide();
    audioguideList: Audioguide[] = [];
    locationId: string;

    // icons
    faEdit = faEdit;
    faTrash = faTrash;
    faSave = faSave;

    errorStatus: number;
    locationSavedStatus: string;

    constructor(
        private locationService: LocationsService,
        private route: ActivatedRoute,
        private location: LocationNav
    ) { }

    ngOnInit() {
        this.locationId = this.route.snapshot.paramMap.get('id')!;
        if (this.locationId) {
            this.getLocation()
            this.getAudioguides()
        }
    }

    ngAfterViewInit() {
        const searchBox = new google.maps.places.SearchBox(this.searchField.nativeElement);
        this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.searchField.nativeElement);

        searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();
            if (places.length === 0) {
                return;
            }
            const bounds = new google.maps.LatLngBounds();
            places.forEach(place => {
                if (!place.geometry || !place.geometry.location) {
                    return;
                }
                if (place.geometry.viewport) {
                    // only geocodes have viewport
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }

                this.locationInfo.address = this.buildLocationAddress(place);
            });
            this.map.fitBounds(bounds);
            this.setLocationMarkerInMap();
        })
    }

    onFileChanged(event: any) {
        if (!event.target.files[0] || event.target.files[0].length == 0) {
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
            let url = reader.result;
            this.audioguide.audioFileBase64 = url!.toString().split(',')[1];
            this.audioguide.audioFileName = event.target.files[0].name;

            if (url != null || url != "") {
                this.status = true;
            }
        }

        this.audiomsg = "";
    }

    ngOnDestroy() {
    }

    async saveLocation() {
        this.errorStatus = 0;

        try {
            if(!this.locationId) {
                await this.locationService.insertLocation(this.locationInfo);
                this.locationSavedStatus = "saved";
            }
            else {
                await this.locationService.updateLocation(this.locationInfo);
                this.locationSavedStatus = "edited";
            }
        }
        catch (error: any) {
            console.log(error);
            this.errorStatus = error.status;
        }
    }

    async getLocation() {
        try {
            this.locationInfo = await this.locationService.getLocation(this.locationId);
            this.url = this.locationInfo.locationPhotoUrl;
            this.initLocationMapPosition();
        }
        catch (error: any) {
            console.log(error.message);
        }
    }

    async saveAudiofile() {
        try {
            this.audioFileSaved = "notyet"
            await this.locationService.insertAudioguide(this.audioguide);
            this.status = false;
            this.audioguideList = await this.locationService.getAllAudioguidesForLocation(this.locationId);
            this.audioFileSaved = "yes";
        }
        catch (error: any) {
            this.audioFileSaved = "no";
            console.log(error);
        }
    }

    async editAudioguide(audioguideId: string) {
        try {
            this.editAudiofile = await this.locationService.getAudioguide(audioguideId);
        }
        catch (error: any) {
            console.log(error.message);
        }
    }

    async saveEditAudioguide() {
        try {
            console.log(this.editAudiofile);
            await this.locationService.updateAudioguide(this.editAudiofile);
            this.audioguideList = await this.locationService.getAllAudioguidesForLocation(this.locationId);
        } 
        catch (error: any) {
            console.log(error.message);
        }
    }

    async getAudioguides() {
        try {
            this.audioguideList = await this.locationService.getAllAudioguidesForLocation(this.locationId);
        }
        catch (error: any) {
            console.log(error.message);
        }
    }

    async deleteAudioguide(audioguideid: string) {
        try {
            await this.locationService.deleteAudioguide(audioguideid);
            this.audioguideList = await this.locationService.getAllAudioguidesForLocation(this.locationId);
        }
        catch (error: any) {
            console.log(error.message);
        }
    }

    cancel() {
        this.location.back()
    }

    private buildLocationAddress(place: google.maps.places.PlaceResult): Address {
        let countryInfo: string = "";
        let cityInfo: string = "";
        place.address_components?.forEach(addressComp => {

            if (addressComp.types.includes("locality")){
                cityInfo = addressComp.long_name;
            }
        
            if (addressComp.types.includes("country")){ 
                countryInfo = addressComp.long_name;
            }
        })

        return <Address> {
            country: countryInfo,
            city: cityInfo,
            coordinates: <Coordinate> {
                latitude: place.geometry?.location.lat(),
                longitude: place.geometry?.location.lng(),
            }
        }
    }

    private setLocationMarkerInMap() {
        this.markerPosition = {lat: this.locationInfo.address.coordinates.latitude, lng: this.locationInfo.address.coordinates.longitude}
    }

    private initLocationMapPosition() {
        if(this.locationInfo) {
            const bounds = new google.maps.LatLngBounds();
            const locationLatLng = new google.maps.LatLng(this.locationInfo.address.coordinates.latitude, this.locationInfo.address.coordinates.longitude)
            bounds.extend(locationLatLng);
            this.map.fitBounds(bounds);
            this.setLocationMarkerInMap();
        }
    }
}
