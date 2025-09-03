
export async function getNearbyPlaces({
                                          lat,
                                          lon,
                                          keyword = '',
                                          type = 'restaurant',
                                          radius = 2000
                                      }) {
    const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!API_KEY) throw new Error('Нет VITE_GOOGLE_PLACES_API_KEY');

    const r = Math.max(50, Math.min(Number(radius) || 2000, 50000));

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
