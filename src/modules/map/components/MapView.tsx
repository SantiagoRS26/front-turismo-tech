"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

interface MapViewProps {
  geoJSONData: any;
}

export default function MapView({ geoJSONData }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-74.2973, 4.5709], // Centro aproximado de Colombia
        zoom: 6
      });

      mapRef.current.on("load", () => {
        if (!mapRef.current) return;

        // Agregar fuente con datos
        mapRef.current.addSource("cities", {
          type: "geojson",
          data: geoJSONData
        });

        // Capa Heatmap
        mapRef.current.addLayer({
          id: "cities-heat",
          type: "heatmap",
          source: "cities",
          paint: {
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", "count"],
              0, 0.1,
              10, 1
            ],
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 1,
              9, 3
            ],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(0,0,255,0)",
              0.2, "rgb(65,105,225)",
              0.4, "rgb(0,255,0)",
              0.6, "rgb(255,255,0)",
              0.8, "rgb(255,165,0)",
              1, "rgb(255,0,0)"
            ],
            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 15,
              9, 30
            ],
            "heatmap-opacity": 0.9
          }
        });

        // Capa de puntos individuales
        mapRef.current.addLayer({
          id: "cities-point",
          type: "circle",
          source: "cities",
          minzoom: 7,
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["get", "count"],
              1, 8,
              10, 20
            ],
            "circle-color": "rgba(200,0,0,0.8)",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff"
          }
        });

        // Capa de texto para mostrar el número de turistas
        mapRef.current.addLayer({
          id: "cities-text",
          type: "symbol",
          source: "cities",
          minzoom: 5,
          layout: {
            "text-field": ["to-string", ["get", "count"]],
            "text-size": 12,
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-offset": [0, 1.2]
          },
          paint: {
            "text-color": "#000000",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1
          }
        });
      });
    }
  }, [geoJSONData]);

  return (
    <div className="w-full h-96 rounded shadow overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
