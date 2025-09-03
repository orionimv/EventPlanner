// export async function getWeatherByCoords(lat, lon) {
//     const key = import.meta.env.VITE_OPENWEATHER_KEY // API ключ берём из .env
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${key}`
//     const res = await fetch(url)
//     if (!res.ok) throw new Error('Ошибка получения погоды: ' + res.status)
//     return await res.json()
// }
export async function getWeatherByCoords(lat, lon) {
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!key) throw new Error("Нет ключа VITE_OPENWEATHER_API_KEY в .env");

    if (typeof lat !== "number" || typeof lon !== "number") {
        throw new Error("Некорректные координаты для погоды");
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${key}`;

    const res = await fetch(url);
    if (!res.ok) {
        let details = "";
        try {
            const data = await res.json();
            details = data?.message ? `: ${data.message}` : "";
        } catch {}
        throw new Error("Ошибка получения погоды " + res.status + details);
    }

    return res.json();
}
