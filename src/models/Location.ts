export class Location {
    id: string;
    name: string;
    userId: string;
    locationPhotoUrl: string;
    coordinates: Coordinate = new Coordinate();
    locationPhotoFile: File;
}

export class Coordinate {
    latitude: number;
    longitude: number;
}