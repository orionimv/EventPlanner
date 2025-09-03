import React, { useEffect, useRef, useState } from "react"
import { getWeatherByCoords } from "../api/weather"

function Recommendations({ coords }) {
    const [weather, setWeather] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const reqIdRef = useRef(0)

    const hasCoords =
        coords &&
        Number.isFinite(coords.lat) &&
        Number.isFinite(coords.lng)

    useEffect(() => {
        if (!hasCoords) return

        const myId = ++reqIdRef.current
        setLoading(true)
        setError(null)
        setWeather(null)

        getWeatherByCoords(coords.lat, coords.lng)
            .then((data) => {
                if (reqIdRef.current !== myId) return
                setWeather(data)
            })
            .catch((err) => {
                if (reqIdRef.current !== myId) return
                setError(err?.message || "Не удалось получить погоду")
            })
            .finally(() => {
                if (reqIdRef.current !== myId) return
                setLoading(false)
            })
    }, [coords?.lat, coords?.lng, hasCoords])

    return (
        <section className="card mt-4">
            <h2 className="title">Рекомендации</h2>

            {!hasCoords && (
                <p className="text-sm text-slate-400">
                    Координаты ещё не получены. Разреши доступ к геолокации или выбери точку на карте.
                </p>
            )}

            {error && (
                <p className="text-sm text-rose-400" aria-live="assertive">
                    Ошибка: {error}
                </p>
            )}

            {loading && (
                <p className="text-sm text-slate-400" aria-live="polite">
                    Загрузка погоды…
                </p>
            )}

            {weather && (
                <div className="mb-3">
                    <h3 className="font-semibold mb-1">Погода</h3>
                    <p className="text-sm text-slate-200">
                        {/* город, если вернулся */}
                        {weather?.name ? `${weather.name}: ` : null}
                        {Number.isFinite(weather?.main?.temp) ? Math.round(weather.main.temp) : "—"}°C
                        {", "}
                        {weather?.weather?.[0]?.description || "нет данных"}
                    </p>
                </div>
            )}

            <div>
                <h3 className="font-semibold mb-1">Советы</h3>
                <ul className="list-disc list-inside text-sm text-slate-300">
                    <li>Запланируй встречу на свежем воздухе, если погода хорошая.</li>
                    <li>Если дождь — захвати зонт и выбери кафе поблизости.</li>
                </ul>
            </div>
        </section>
    )
}

export default Recommendations
