"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import { useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import { Place } from "@/modules/chat/types/Recommendations";

interface MapProps {
	places: Place[];
}

export default function MapContainer({ places }: MapProps) {
	const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

	const initialViewState = {
		longitude: places.length > 0 ? places[0].location.longitude : -74.5,
		latitude: places.length > 0 ? places[0].location.latitude : 40,
		zoom: 12,
	};

	const getMarkerIcon = (category: string) => {
		return `/marketIcons/${category.toLowerCase()}.png`;
	};

	return (
		<div className="h-full w-full">
			<Map
				initialViewState={initialViewState}
				style={{ width: "100%", height: "100%" }}
				mapStyle="mapbox://styles/mapbox/streets-v11"
				mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}>
				<NavigationControl position="top-left" />

				{places.map((place, index) => (
					<Marker
						key={index}
						longitude={place.location.longitude}
						latitude={place.location.latitude}
						anchor="bottom"
						onClick={(e) => {
							e.originalEvent.stopPropagation();
							setSelectedPlace(place);
						}}>
						<img
							src={getMarkerIcon(place.category)}
							alt={`Marcador de ${place.category}`}
							className="cursor-pointer"
							style={{ width: "30px", height: "30px" }}
						/>
					</Marker>
				))}

{selectedPlace && (
  <Popup
    longitude={selectedPlace.location.longitude}
    latitude={selectedPlace.location.latitude}
    onClose={() => setSelectedPlace(null)}
    closeOnClick={false}
    maxWidth="400px">
    <div className="popup-content bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-gray-800">{selectedPlace.name}</h3>
      <p className="text-sm text-gray-600 mt-2">
        <strong className="font-semibold">Categoría:</strong> {selectedPlace.category}
      </p>
      <p className="text-sm text-gray-600">
        <strong className="font-semibold">Dirección:</strong> {selectedPlace.address}
      </p>
      <p className="text-sm text-gray-600">
        <strong className="font-semibold">Calificación:</strong> {selectedPlace.rating} (
        {selectedPlace.reviews} reseñas)
      </p>

      <p className="text-sm font-semibold mt-2">Servicios:</p>
      <ul className="list-disc list-inside text-sm text-gray-600">
        {selectedPlace.services.map((service, idx) => (
          <li key={idx}>{service}</li>
        ))}
      </ul>

      {selectedPlace.hours && selectedPlace.hours.length > 0 && (
        <>
          <p className="text-sm font-semibold mt-2">Horarios:</p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            {selectedPlace.hours.map((hour, idx) => (
              <li key={idx}>
                {hour.open} - {hour.close}
              </li>
            ))}
          </ul>
        </>
      )}

      <a
        href={selectedPlace.google_maps_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline block mt-2 hover:text-blue-700">
        Ver en Google Maps
      </a>

      <div className="mt-2 flex flex-wrap">
        {selectedPlace.images.map((image, idx) => (
          <img
            key={idx}
            src={image}
            alt={`${selectedPlace.name} imagen ${idx + 1}`}
            width={100}
            height={75}
            className="object-cover rounded-lg hover:scale-105 transition-transform duration-200 mr-2 mb-2"
          />
        ))}
      </div>
    </div>
  </Popup>
)}

			</Map>
		</div>
	);
}
