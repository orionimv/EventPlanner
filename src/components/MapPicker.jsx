import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";
if (MAPBOX_TOKEN) mapboxgl.accessToken = MAPBOX_TOKEN;

export default function MapPicker({
                                      center,
                                      onPick,
                                      height = 400,
                                      readOnly = false,
                                      className = "",
                                  }) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [err, setErr] = useState(null);

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        if (!MAPBOX_TOKEN) {
            setErr("Не задан токен Mapbox (VITE_MAPBOX_TOKEN). Карта отключена.");
            return;
        }

        const hasCenter = center && Number.isFinite(center.lat) && Number.isFinite(center.lng);
        const initLngLat = hasCenter ? [center.lng, center.lat] : [30.5234, 50.4501]; // Киев — дефолт

        try {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/streets-v11",
                center: initLngLat,
                zoom: 10,
            });
            mapRef.current = map;

            markerRef.current = new mapboxgl.Marker().setLngLat(initLngLat).addTo(map);

            const handleClick = (e) => {
                if (readOnly) return;
                const { lng, lat } = e.lngLat;
                markerRef.current?.setLngLat([lng, lat]);
                onPick?.({ lat, lng });
            };

            map.on("click", handleClick);

            return () => {
                try {
                    map.off("click", handleClick);
                    map.remove();
                } catch {}
                mapRef.current = null;
            };
        } catch (e) {
            console.error("Mapbox init error:", e);
            setErr(e?.message || "Ошибка инициализации карты");
        }
    }, [center, readOnly, onPick]);

    useEffect(() => {
        const map = mapRef.current;
        const marker = markerRef.current;
        if (!map || !marker) return;
        if (!center || !Number.isFinite(center.lat) || !Number.isFinite(center.lng)) return;

        const lngLat = [center.lng, center.lat];
        try {
            marker.setLngLat(lngLat);
            map.easeTo({ center: lngLat });
        } catch (e) {
            console.warn("Map recenter error:", e);
        }
    }, [center?.lat, center?.lng]);

    if (err) {
        return (
            <div
                className={`glass border border-white/10 rounded-xl grid place-items-center text-rose-300 text-sm text-center p-3 ${className}`}
                style={{ height }}
            >
                {err}
            </div>
        );
    }

    return (
        <div
            ref={mapContainer}
            className={`rounded-xl overflow-hidden border border-white/10 ${className}`}
            style={{ height }}
        />
    );
}
