// // src/hooks/useGeolocation.js
// import { useEffect, useState } from 'react'
//
// export function useGeolocation() {
//     const [position, setPosition] = useState(null) // { lat, lng }
//     const [error, setError] = useState(null)
//     const [loading, setLoading] = useState(true)
//
//     useEffect(() => {
//         if (!('geolocation' in navigator)) {
//             setError('Geolocation API недоступен')
//             setLoading(false)
//             return
//         }
//
//         const id = navigator.geolocation.watchPosition(
//             (pos) => {
//                 setPosition({
//                     lat: pos.coords.latitude,
//                     lng: pos.coords.longitude
//                 })
//                 setLoading(false)
//             },
//             (err) => {
//                 setError(err?.message || 'Не удалось получить местоположение')
//                 setLoading(false)
//             },
//             {
//                 enableHighAccuracy: true,
//                 maximumAge: 10_000,
//                 timeout: 8_000, // не висим вечно
//             }
//         )
//
//         return () => {
//             if (id != null) navigator.geolocation.clearWatch(id)
//         }
//     }, [])
//
//     return { position, error, loading }
// }

// src/hooks/useGeolocation.js
import { useEffect, useState } from 'react'

export function useGeolocation() {
    const [position, setPosition] = useState(null) // { lat, lng }
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setError('Geolocation API недоступен')
            setLoading(false)
            return
        }

        let cancelled = false

        const id = navigator.geolocation.watchPosition(
            (pos) => {
                if (cancelled) return
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                })
                setError(null)
                setLoading(false)
            },
            (err) => {
                if (cancelled) return
                setError(err?.message || 'Не удалось получить местоположение')
                setLoading(false)
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10_000,
                timeout: 8_000,
            }
        )

        return () => {
            cancelled = true
            if (id != null) navigator.geolocation.clearWatch(id)
        }
    }, [])

    return { position, error, loading }
}
