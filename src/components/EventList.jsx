// import React, { useMemo, useState } from 'react'
//
// export default function EventList({ events, onRemove, onToggleJoin, user }) {
//     const [q, setQ] = useState('')
//     const [cat, setCat] = useState('all')
//
//     const filtered = useMemo(() => {
//         return events.filter(ev => {
//             const matchQ = [ev.title, ev.location, ev.description].filter(Boolean).join(' ').toLowerCase().includes(q.toLowerCase())
//             const matchCat = cat === 'all' || ev.category === cat
//             return matchQ && matchCat
//         })
//     }, [events, q, cat])
//
//     return (
//         <div>
//             <div style={{ display:'flex', gap: 8, marginBottom: 8 }}>
//                 <input placeholder="Поиск..." value={q} onChange={(e)=>setQ(e.target.value)} />
//                 <select value={cat} onChange={(e)=>setCat(e.target.value)}>
//                     <option value="all">Все</option>
//                     <option value="meeting">Встречи</option>
//                     <option value="trip">Поездки</option>
//                     <option value="party">Вечеринки</option>
//                 </select>
//             </div>
//             <ul style={{ display:'grid', gap: 12, paddingLeft: 18 }}>
//                 {filtered.map(ev => (
//                     <li key={ev.id} style={{ border:'1px solid #e5e7eb', borderRadius: 12, padding: 12 }}>
//                         <div style={{ display:'flex', justifyContent:'space-between', gap: 8, alignItems:'center' }}>
//                             <div>
//                                 <div style={{ fontWeight: 700 }}>{ev.title}</div>
//                                 <div style={{ fontSize: 12, opacity:.75 }}>{new Date(ev.start).toLocaleString()} — {ev.location || '—'}</div>
//                             </div>
//                             <div style={{ display:'flex', gap: 8 }}>
//                                 <button onClick={()=>onToggleJoin(ev)}>
//                                     {ev.participants?.includes(user.uid) ? 'Покинуть' : 'Присоединиться'}
//                                 </button>
//                                 {ev.owner === user.uid && <button onClick={()=>onRemove(ev.id)} style={{ color:'crimson' }}>Удалить</button>}
//                             </div>
//                         </div>
//                         {ev.description && <div style={{ marginTop: 8, fontSize: 14, whiteSpace:'pre-wrap' }}>{ev.description}</div>}
//                         <div style={{ marginTop: 8, fontSize: 12, opacity:.75 }}>
//                             Участники: {ev.participants?.length || 0}
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//             {filtered.length === 0 && <div>Событий не найдено.</div>}
//         </div>
//     )
// }

// import React, { useMemo, useState } from 'react'
//
// export default function EventList({ events, onRemove, onToggleJoin, user }) {
//     const [q, setQ] = useState('')
//     const [cat, setCat] = useState('all')
//
//     const filtered = useMemo(() => {
//         return events.filter(ev => {
//             const matchQ = [ev.title, ev.location, ev.description]
//                 .filter(Boolean)
//                 .join(' ')
//                 .toLowerCase()
//                 .includes(q.toLowerCase())
//
//             const matchCat = cat === 'all' || ev.category === cat
//             return matchQ && matchCat
//         })
//     }, [events, q, cat])
//
//     return (
//         <div>
//             <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
//                 <input
//                     placeholder="Поиск..."
//                     value={q}
//                     onChange={(e) => setQ(e.target.value)}
//                 />
//                 <select value={cat} onChange={(e) => setCat(e.target.value)}>
//                     <option value="all">Все</option>
//                     <option value="meeting">Встречи</option>
//                     <option value="trip">Поездки</option>
//                     <option value="party">Вечеринки</option>
//                 </select>
//             </div>
//
//             <ul style={{ display: 'grid', gap: 12, paddingLeft: 18 }}>
//                 {filtered.map(ev => {
//                     let dateStr = '—'
//                     try {
//                         if (ev.start) {
//                             dateStr = new Date(ev.start).toLocaleString()
//                         }
//                     } catch {
//                         dateStr = 'Некорректная дата'
//                     }
//
//                     const isJoined = user?.uid && ev.participants?.includes(user.uid)
//                     const isOwner = user?.uid && ev.owner === user.uid
//
//                     return (
//                         <li
//                             key={ev.id}
//                             style={{
//                                 border: '1px solid #e5e7eb',
//                                 borderRadius: 12,
//                                 padding: 12
//                             }}
//                         >
//                             <div
//                                 style={{
//                                     display: 'flex',
//                                     justifyContent: 'space-between',
//                                     gap: 8,
//                                     alignItems: 'center'
//                                 }}
//                             >
//                                 <div>
//                                     <div style={{ fontWeight: 700 }}>{ev.title}</div>
//                                     <div style={{ fontSize: 12, opacity: 0.75 }}>
//                                         {dateStr} — {ev.location || '—'}
//                                     </div>
//                                 </div>
//
//                                 {user && (
//                                     <div style={{ display: 'flex', gap: 8 }}>
//                                         <button onClick={() => onToggleJoin(ev)}>
//                                             {isJoined ? 'Покинуть' : 'Присоединиться'}
//                                         </button>
//                                         {isOwner && (
//                                             <button
//                                                 onClick={() => onRemove(ev.id)}
//                                                 style={{ color: 'crimson' }}
//                                             >
//                                                 Удалить
//                                             </button>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//
//                             {ev.description && (
//                                 <div
//                                     style={{
//                                         marginTop: 8,
//                                         fontSize: 14,
//                                         whiteSpace: 'pre-wrap'
//                                     }}
//                                 >
//                                     {ev.description}
//                                 </div>
//                             )}
//
//                             <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
//                                 Участники: {ev.participants?.length || 0}
//                             </div>
//                         </li>
//                     )
//                 })}
//             </ul>
//
//             {filtered.length === 0 && <div>Событий не найдено.</div>}
//         </div>
//     )
// }
//

import React, { useMemo, useState } from 'react'
import {
    CalendarDaysIcon,
    ClockIcon,
    MapPinIcon,
    UserGroupIcon,
    TrashIcon,
} from '@heroicons/react/24/outline'

export default function EventList({ events, onRemove, onToggleJoin, user }) {
    const [q, setQ] = useState('')
    const [cat, setCat] = useState('all')

    const filtered = useMemo(() => {
        return events.filter(ev => {
            const haystack = [ev.title, ev.location, ev.description]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
            const matchQ = haystack.includes(q.toLowerCase())
            const matchCat = cat === 'all' || ev.category === cat
            return matchQ && matchCat
        })
    }, [events, q, cat])

    return (
        <div className="space-y-3">
            {/* Панель фильтров */}
            <div className="glass p-2 flex flex-col md:flex-row gap-2">
                <input
                    className="input flex-1"
                    placeholder="Поиск..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <select
                    className="input md:w-48"
                    value={cat}
                    onChange={(e) => setCat(e.target.value)}
                >
                    <option value="all">Все</option>
                    <option value="meeting">Встречи</option>
                    <option value="trip">Поездки</option>
                    <option value="party">Вечеринки</option>
                </select>
            </div>

            {/* Лента событий (как «календарь») */}
            <ul className="grid gap-3">
                {filtered.map((ev) => {
                    // безопасный вывод даты/времени
                    let dateStr = '—'
                    let timeStr = ''
                    try {
                        if (ev.start) {
                            const d = new Date(ev.start)
                            dateStr = d.toLocaleDateString()
                            timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                    } catch {
                        dateStr = 'Некорректная дата'
                    }

                    const isJoined = user?.uid && ev.participants?.includes(user.uid)
                    const isOwner = user?.uid && ev.owner === user.uid

                    return (
                        <li key={ev.id} className="list-card">
                            <div className="flex items-start justify-between gap-3">
                                {/* Левая часть: заголовок + мета */}
                                <div className="min-w-0">
                                    <div className="text-base font-bold truncate">{ev.title}</div>

                                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDaysIcon className="size-4 opacity-80" />
                        {dateStr}
                    </span>
                                        {timeStr && (
                                            <span className="inline-flex items-center gap-1">
                        <ClockIcon className="size-4 opacity-80" />
                                                {timeStr}
                      </span>
                                        )}
                                        <span className="inline-flex items-center gap-1">
                      <MapPinIcon className="size-4 opacity-80" />
                                            {ev.location || '—'}
                    </span>
                                        <span className="inline-flex items-center gap-1">
                      <UserGroupIcon className="size-4 opacity-80" />
                                            {ev.participants?.length || 0}
                    </span>
                                    </div>
                                </div>

                                {/* Правая часть: действия */}
                                {user && (
                                    <div className="flex shrink-0 items-center gap-2">
                                        <button
                                            className={`btn-ghost ${isJoined ? 'border-[#7c5cff] text-white' : ''}`}
                                            onClick={() => onToggleJoin(ev)}
                                            title={isJoined ? 'Покинуть' : 'Присоединиться'}
                                        >
                                            {isJoined ? 'Покинуть' : 'Присоединиться'}
                                        </button>

                                        {isOwner && (
                                            <button
                                                className="btn-danger"
                                                onClick={() => onRemove(ev.id)}
                                                title="Удалить"
                                            >
                                                <TrashIcon className="size-4 mr-1" />
                                                Удалить
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Описание */}
                            {ev.description && (
                                <div className="mt-2 text-sm text-slate-200 whitespace-pre-wrap">
                                    {ev.description}
                                </div>
                            )}
                        </li>
                    )
                })}
            </ul>

            {filtered.length === 0 && (
                <div className="glass p-4 text-sm text-slate-400">
                    Событий не найдено.
                </div>
            )}
        </div>
    )
}
