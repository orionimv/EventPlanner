// import React, { useEffect, useRef, useState } from "react";
// import mapboxgl from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
//
// const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";
//
// // не ставим токен, если пуст — иначе mapbox может выбросить исключение
// if (MAPBOX_TOKEN) {
//     mapboxgl.accessToken = MAPBOX_TOKEN;
// }
//
// export default function MapPicker({
//                                       center,            // { lat, lng } | undefined
//                                       onPick,            // (coords) => void
//                                       height = 400,
//                                   }) {
//     const mapContainer = useRef(null);
//     const mapRef = useRef(null);
//     const markerRef = useRef(null);
//     const [err, setErr] = useState(null);
//
//     // Безопасная инициализация карты
//     useEffect(() => {
//         // нет контейнера или карта уже создана
//         if (!mapContainer.current || mapRef.current) return;
//
//         // нет токена — показываем заглушку, но не падаем
//         if (!MAPBOX_TOKEN) {
//             setErr("Не задан токен Mapbox (VITE_MAPBOX_TOKEN). Карта отключена.");
//             return;
//         }
//
//         const hasCenter =
//             center && Number.isFinite(center.lat) && Number.isFinite(center.lng);
//
//         const initLngLat = hasCenter
//             ? [center.lng, center.lat]
//             : [30.5234, 50.4501]; // запасной дефолт (Киев)
//
//         try {
//             const map = new mapboxgl.Map({
//                 container: mapContainer.current,
//                 style: "mapbox://styles/mapbox/streets-v11",
//                 center: initLngLat,
//                 zoom: 10,
//             });
//             mapRef.current = map;
//
//             markerRef.current = new mapboxgl.Marker()
//                 .setLngLat(initLngLat)
//                 .addTo(map);
//
//             const handleClick = (e) => {
//                 const { lng, lat } = e.lngLat;
//                 markerRef.current?.setLngLat([lng, lat]);
//                 onPick?.({ lat, lng });
//             };
//
//             map.on("click", handleClick);
//
//             // cleanup
//             return () => {
//                 try {
//                     map.off("click", handleClick);
//                     map.remove();
//                 } catch {}
//                 mapRef.current = null;
//             };
//         } catch (e) {
//             console.error("Mapbox init error:", e);
//             setErr(e?.message || "Ошибка инициализации карты");
//         }
//     }, [center]); // создание — один раз; зависимость ок, т.к. есть guard
//
//     // Реакция на смену внешнего center (когда геолокация появится)
//     useEffect(() => {
//         const map = mapRef.current;
//         const marker = markerRef.current;
//         if (!map || !marker) return;
//
//         if (!center || !Number.isFinite(center.lat) || !Number.isFinite(center.lng)) {
//             return;
//         }
//
//         const lngLat = [center.lng, center.lat];
//         try {
//             marker.setLngLat(lngLat);
//             map.easeTo({ center: lngLat });
//         } catch (e) {
//             console.warn("Map recenter error:", e);
//         }
//     }, [center?.lat, center?.lng]);
//
//     if (err) {
//         // мягкая заглушка вместо падения приложения
//         return (
//             <div
//                 style={{
//                     width: "100%",
//                     height,
//                     borderRadius: 10,
//                     border: "1px solid #e5e7eb",
//                     display: "grid",
//                     placeItems: "center",
//                     background: "#f9fafb",
//                     color: "#b91c1c",
//                     fontSize: 13,
//                     textAlign: "center",
//                     padding: 12,
//                 }}
//             >
//                 {err}
//             </div>
//         );
//     }
//
//     return (
//         <div
//             ref={mapContainer}
//             style={{ width: "100%", height, borderRadius: 10 }}
//         />
//     );
// }

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || "";
if (MAPBOX_TOKEN) mapboxgl.accessToken = MAPBOX_TOKEN;

export default function MapPicker({
                                      center,                 // { lat, lng } | undefined
                                      onPick,                 // (coords) => void
                                      height = 400,
                                      readOnly = false,       // отключить клики, если нужно
                                      className = "",         // чтобы можно было докинуть классы снаружи
                                  }) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const [err, setErr] = useState(null);

    // Инициализация карты
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

    // Реакция на смену внешнего center (когда геолокация появится)
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
        // мягкая заглушка в стиле glass
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
