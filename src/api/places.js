// /**
//  * Google Places API (New) Nearby Search
//  * Endpoint: POST https://places.googleapis.com/v1/places:searchNearby
//  * Make sure to enable API and restrict key appropriately.
//  */
// export async function getNearbyPlaces({ lat, lon, keyword = '', type = 'restaurant', radius = 2000 }) {
//     const key = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
//     const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${API_KEY}&location=...&radius=1500`;
//     const body = {
//         includedTypes: [type],
//         maxResultCount: 10,
//         locationRestriction: {
//             circle: {
//                 center: { latitude: lat, longitude: lon },
//                 radius: radius
//             }
//         },
//         rankPreference: "PROBABILITY"
//     }
//     if (keyword) body['textQuery'] = keyword
//
//     const res = await fetch(`${url}?key=${key}`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(body)
//     })
//     if (!res.ok) throw new Error('Places API error')
//     const payload = await res.json()
//     return payload.places || []
// }
// places.js
/**
 * Google Places API (New)
 * - Nearby: POST https://places.googleapis.com/v1/places:searchNearby
 * - Text:   POST https://places.googleapis.com/v1/places:searchText
 */
export async function getNearbyPlaces({
                                          lat,
                                          lon,
                                          keyword = '',
                                          type = 'restaurant',
                                          radius = 2000
                                      }) {
    const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!API_KEY) throw new Error('Нет VITE_GOOGLE_PLACES_API_KEY');

    // radius: метры, разумные границы
    const r = Math.max(50, Math.min(Number(radius) || 2000, 50000));

    // Чуть подробней field mask
    const FIELD_MASK = [
        'places.id',
        'places.displayName',
        'places.formattedAddress',
        'places.location',
        'places.rating',
        'places.types',
        'places.googleMapsUri',
        'places.photos' // на случай, если захочешь картинки
    ].join(',');

    const isTextSearch = Boolean(keyword && keyword.trim());

    const url = isTextSearch
        ? 'https://places.googleapis.com/v1/places:searchText'
        : 'https://places.googleapis.com/v1/places:searchNearby';

    const body = isTextSearch
        ? {
            textQuery: keyword.trim(),
            maxResultCount: 10,
            locationBias: {
                circle: {
                    center: { latitude: lat, longitude: lon },
                    radius: r
                }
            },
            includedTypes: type ? [type] : undefined
        }
        : {
            includedTypes: type ? [type] : undefined,
            maxResultCount: 10,
            locationRestriction: {
                circle: {
                    center: { latitude: lat, longitude: lon },
                    radius: r
                }
            }
            // rankPreference часто игнорят/меняют — оставим дефолт
        };

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': API_KEY,
            'X-Goog-FieldMask': FIELD_MASK
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        let details = '';
        try {
            const j = await res.json();
            details = j?.error?.message ? `: ${j.error.message}` : '';
        } catch {}
        throw new Error('Places API error' + details);
    }

    const payload = await res.json();
    return payload.places || [];
}
