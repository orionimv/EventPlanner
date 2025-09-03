import React, { useEffect, useState } from 'react'
import MapPicker from './MapPicker'
import MarkdownEditor from './MarkdownEditor'
import { googleCalendarUrl, downloadICS } from '../utils/ics'
import { useGeolocation } from '../hooks/useGeolocation'

const DEFAULT_CENTER = { lat: 50.4501, lng: 30.5234 } // запасной центр

export default function EventForm({ user, onCreate }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [start, setStart] = useState('')
    const [end, setEnd] = useState('')
    const [center, setCenter] = useState(null) // {lat,lng} или null
    const [placeText, setPlaceText] = useState('')

    const { position, loading: geoLoading, error: geoError } = useGeolocation()
    const hasGeo = Number.isFinite(position?.lat) && Number.isFinite(position?.lng)

    useEffect(() => {
        if (hasGeo && !center) setCenter(position)
    }, [hasGeo, position, center])

    async function submit(e) {
        e.preventDefault()
        if (!title || !start) {
            alert('Название и дата/время обязательны')
            return
        }
        const ev = {
            title,
            description,
            start: new Date(start).toISOString(),
            end: end ? new Date(end).toISOString() : null,
            location: placeText,
            center: center || position || DEFAULT_CENTER, // всегда сохраняем координаты
            owner: user.uid,
            participants: [user.uid],
            category: 'meeting'
        }
        await onCreate(ev)
        setTitle(''); setDescription(''); setStart(''); setEnd('')
        setPlaceText(''); setCenter(null)
    }

    const exportObj = { title, description, start: start || new Date().toISOString(), end: end || start, location: placeText }
    const centerToUse = center || position || DEFAULT_CENTER

    return (
        <form onSubmit={submit} className="grid gap-3">
            <input
                className="input"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                placeholder="Название события"
                required
            />

            <div className="field-row">
                <input
                    className="input"
                    type="datetime-local"
                    value={start}
                    onChange={(e)=>setStart(e.target.value)}
                    required
                />
                <input
                    className="input"
                    type="datetime-local"
                    value={end}
                    onChange={(e)=>setEnd(e.target.value)}
                />
            </div>

            <input
                className="input"
                value={placeText}
                onChange={(e)=>setPlaceText(e.target.value)}
                placeholder="Адрес/место (текст)"
            />

            <div className="relative rounded-xl overflow-hidden border border-white/10">
                <MapPicker center={centerToUse} onPick={setCenter} />
                {(geoLoading || geoError) && (
                    <div className="absolute inset-0 grid place-items-center pointer-events-none text-slate-400 text-sm">
                        {geoLoading ? 'Определяю местоположение…' : 'Геолокация недоступна — выберите точку на карте'}
                    </div>
                )}
            </div>

            <div className="glass p-0">
                <MarkdownEditor value={description} onChange={setDescription} />
            </div>

            <div className="flex flex-wrap gap-2">
                <button type="submit" className="btn-primary">Создать событие</button>

                <a
                    href={googleCalendarUrl(exportObj)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost"
                >
                    Добавить в Google Calendar
                </a>

                <button type="button" className="btn-ghost" onClick={()=>downloadICS(exportObj)}>
                    Скачать .ics
                </button>
            </div>
        </form>
    )
}
