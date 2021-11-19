export class Utils {

    //-------------------------------- API URLS --------------------------------//

    public static BASE_API_URL = 'https://guidemeapi.azure-api.net'
    //'http://localhost:5001/api' //Change this to use localhost or Azure hosted instance
    public static LOCATION_API_URL = `${Utils.BASE_API_URL}/Locations/location`
    public static AUDIOGUIDES_API_URL = `${Utils.BASE_API_URL}/Locations/audioguide`

    //------------------------ ROUTES ------------------------//
    public static LANDING_PAGE_URL = "landing";
    public static EDIT_ADD_LOCATION_URL = "location";
    public static LOGIN_URL = "login";
}


export function buildRequestWithFile(model: any): FormData {
    const formData = new FormData();
    for(const prop in model) {
        if (!model.hasOwnProperty(prop)) { continue; }
        formData.append(prop, model[prop]);
    }
    return formData;
}