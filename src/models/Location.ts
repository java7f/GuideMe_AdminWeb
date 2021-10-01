export class Location {
    id: string;
    name: string;
    userId: string;
    locationPhotoUrl: string;
    coordinates: Coordinate = new Coordinate();
    locationPhotoFileBase64: string; //Encoded in base64
    locationPhotoFileName: string; //Name of file
}

export class Coordinate {
    latitude: number;
    longitude: number;
}