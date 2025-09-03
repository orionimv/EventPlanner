import React, { useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import { useEvents } from './hooks/useEvents'
import EventForm from './components/EventForm'
import EventList from './components/EventList'
import Recommendations from './components/Recommendations'
import { useGeolocation } from './hooks/useGeolocation'
import { requestFcmPermissionAndToken, onFcmMessage } from './firebase'
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from './firebase'
import Auth from './components/Auth'   // ✅ теперь импорт
import Login from "./components/Login";

export default function App() {
    const { user, loading, loginEmail, registerEmail, loginGoogle, logout } = useAuth()
    const { events, addEvent, removeEvent } = useEvents(user?.uid)
    const { position } = useGeolocation()

    useEffect(() => {
        if (!user) return
        async function run() {
            const token = await requestFcmPermissionAndToken()
            if (token) {
                try {
                    const ref = doc(db, 'users', user.uid)
                    await updateDoc(ref, { fcmTokens: arrayUnion(token) }).catch(() => {})
                } catch {}
            }
        }
        run()
        const unsub = onFcmMessage((payload) => {
            console.log('Сообщение FCM:', payload)
        })
        return () => unsub && unsub()
    }, [user])

    async function handleToggleJoin(ev) {
        const ref = doc(db, 'events', ev.id)
        const isIn = ev.participants?.includes(user.uid)
        await updateDoc(ref, {
            participants: isIn ? arrayRemove(user.uid) : arrayUnion(user.uid),
        })
    }

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50">
                <div className="text-slate-600 animate-pulse">Загрузка...</div>
            </div>
        )

    if (!user)
        return (
            <Auth
                onEmailLogin={loginEmail}
                onEmailRegister={registerEmail}
                onGoogle={loginGoogle}
            />
        )

    const hasCoords = Number.isFinite(position?.lat) && Number.isFinite(position?.lng)

    return (

        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center p-4">

            <header
                className="sticky top-0 z-10 glass px-4 py-3 mb-4 max-w-4xl w-full flex justify-between items-center">
                <div className="font-extrabold text-lg flex items-center gap-2">📍 Event Planner</div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">{user.email}</span>
                    <button onClick={logout} className="btn-ghost text-sm px-3 py-1.5">Выйти</button>
                </div>
            </header>

            <main className="grid gap-6 max-w-4xl w-full">

                <section className="card">
                    <h2 className="title">Создать событие</h2>
                    <EventForm user={user} onCreate={addEvent}/>
                </section>

                <section className="card">
                    <h2 className="title">Места поблизости</h2>
                    <div className="text-xs text-slate-500 mb-2">
                        {hasCoords
                            ? `Ваше местоположение: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
                            : 'Определяю местоположение...'}
                    </div>
                    {hasCoords && <Recommendations coords={position}/>}
                </section>

                <section className="card">
                    <h2 className="title">Мои события</h2>
                    <EventList
                        events={events}
                        onRemove={removeEvent}
                        onToggleJoin={handleToggleJoin}
                        user={user}
                    />
                </section>
            </main>
        </div>
    )
}
