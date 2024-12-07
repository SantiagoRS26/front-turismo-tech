export interface Location {
	latitude: string;
	longitude: string;
}

export interface Place {
	name: string;
	rating: string;
	reviews: string;
	category: string;
	address: string;
	hours: string;
	services: string;
	location: Location;
	images: string;
	google_maps_url: string;
}

export interface Recommendations {
	places: Place[];
}
