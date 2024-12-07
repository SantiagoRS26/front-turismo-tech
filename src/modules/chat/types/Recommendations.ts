export interface Location {
	latitude: number;
	longitude: number;
}

export interface Hours {
	open: string;
	close: string;
}

export interface Place {
	name: string;
	rating: number;
	reviews: number;
	category: string;
	address: string;
	hours: Hours[];
	services: string[];
	location: Location;
	images: string[];
	google_maps_url: string;
}

export interface Recommendations {
	places: Place[];
}
