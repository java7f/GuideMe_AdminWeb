export class Location {
    id: string;
    name: string;
    userId: string;
    locationPhotoUrl: string;
    address: Address = new Address();
    locationPhotoFileBase64: string; //Encoded in base64
    locationPhotoFileName: string; //Name of file
}

export class Address {
    city: string;
    country: string;
    coordinates: Coordinate = new Coordinate();
}

export class Coordinate {
    latitude: number;
    longitude: number;
}