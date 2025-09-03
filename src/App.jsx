// import React, { useEffect } from 'react'
// import { useAuth } from './hooks/useAuth'
// import { useEvents } from './hooks/useEvents'
// import EventForm from './components/EventForm'
// import EventList from './components/EventList'
// import Recommendations from './components/Recommendations'
// import { useGeolocation } from './hooks/useGeolocation'
// import { requestFcmPermissionAndToken, onFcmMessage } from './firebase'
// import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
// import { db } from './firebase'
// import MapPicker from './components/MapPicker'
//
// export default function App() {
//     const { user, loading, loginEmail, registerEmail, loginGoogle, logout } = useAuth()
//     const { events, addEvent, removeEvent } = useEvents(user?.uid)
//     const { position } = useGeolocation()
//
//     // FCM
//     useEffect(() => {
//         if (!user) return
//         async function run() {
//             const token = await requestFcmPermissionAndToken()
//             if (token) {
//                 try {
//                     const ref = doc(db, 'users', user.uid)
//                     await updateDoc(ref, { fcmTokens: arrayUnion(token) }).catch(() => {})
//                 } catch {}
//             }
//         }
//         run()
//         const unsub = onFcmMessage((payload) => {
//             console.log('Сообщение FCM:', payload)
//         })
//         return () => unsub && unsub()
//     }, [user])
//
//     async function handleToggleJoin(ev) {
//         const ref = doc(db, 'events', ev.id)
//         const isIn = ev.participants?.includes(user.uid)
//         await updateDoc(ref, {
//             participants: isIn ? arrayRemove(user.uid) : arrayUnion(user.uid)
//         })
//     }
//
//     if (loading) return <div style={page}><div>Загрузка...</div></div>
//     if (!user) return <Auth onEmailLogin={loginEmail} onEmailRegister={registerEmail} onGoogle={loginGoogle} />
//
//     const hasCoords = Number.isFinite(position?.lat) && Number.isFinite(position?.lng)
//
//     return (
//         <div style={page}>
//             <header style={header}>
//                 <div style={{ fontWeight: 800, fontSize: 18 }}>📍 Event Planner</div>
//                 <div style={{ display:'flex', gap: 8, alignItems:'center' }}>
//                     <span style={{ fontSize: 12, opacity:.75 }}>{user.email}</span>
//                     <button onClick={logout}>Выйти</button>
//                 </div>
//             </header>
//
//             <main style={{ display:'grid', gridTemplateColumns:'1fr', gap: 16, maxWidth: 980, width: '100%' }}>
//                 <section style={card}>
//                     <h2 style={h2}>Создать событие</h2>
//                     <EventForm user={user} onCreate={addEvent} />
//                 </section>
//
//                 <section style={card}>
//                     <h2 style={h2}>Места поблизости</h2>
//                     <div style={{ fontSize: 12, opacity:.8, marginBottom: 8 }}>
//                         {hasCoords
//                             ? `Ваше местоположение: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
//                             : 'Определяю местоположение...'}
//                     </div>
//                     {hasCoords && <Recommendations coords={position} />}
//                 </section>
//
//                 {/*<section style={card}>*/}
//                 {/*    <h2 style={h2}>Моя карта</h2>*/}
//                 {/*    {hasCoords*/}
//                 {/*        ? <MapPicker center={position} />*/}
//                 {/*        : <div>Определяю местоположение...</div>}*/}
//                 {/*</section>*/}
//
//                 <section style={card}>
//                     <h2 style={h2}>Мои события</h2>
//                     <EventList
//                         events={events}
//                         onRemove={removeEvent}
//                         onToggleJoin={handleToggleJoin}
//                         user={user}
//                     />
//                 </section>
//             </main>
//         </div>
//     )
// }
//
// function Auth({ onEmailLogin, onEmailRegister, onGoogle }) {
//     const [email, setEmail] = React.useState('')
//     const [password, setPassword] = React.useState('')
//     const [err, setErr] = React.useState(null)
//     const [loading, setLoading] = React.useState(false)
//
//     async function handleEmailLogin() {
//         setErr(null); setLoading(true)
//         try { await onEmailLogin(email.trim(), password) }
//         catch (e) { setErr(e?.message || 'Ошибка входа') }
//         finally { setLoading(false) }
//     }
//
//     async function handleEmailRegister() {
//         setErr(null); setLoading(true)
//         try { await onEmailRegister(email.trim(), password) }
//         catch (e) { setErr(e?.message || 'Ошибка регистрации') }
//         finally { setLoading(false) }
//     }
//
//     async function handleGoogle() {
//         setErr(null); setLoading(true)
//         try { await onGoogle() }
//         catch (e) { setErr(e?.message || 'Ошибка входа через Google') }
//         finally { setLoading(false) }
//     }
//
//     return (
//         <div style={{ ...page, justifyContent:'center' }}>
//             <div style={{ ...card, width: 360 }}>
//                 <h1 style={{ ...h2, textAlign:'center' }}>Вход</h1>
//                 <div style={{ display:'grid', gap: 8 }}>
//                     <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
//                     <input type="password" placeholder="Пароль" value={password} onChange={(e)=>setPassword(e.target.value)} />
//                     <button onClick={handleEmailLogin} disabled={loading}>Войти по email</button>
//                     <button onClick={handleEmailRegister} disabled={loading}>Регистрация</button>
//                     <button onClick={handleGoogle} disabled={loading}>Войти через Google</button>
//                     {err && <div style={{ color:'#b91c1c', fontSize:12, marginTop:4 }}>{err}</div>}
//                 </div>
//             </div>
//         </div>
//     )
// }
//
// const page = {
//     minHeight: '100vh',
//     background: 'linear-gradient(180deg, #f9fafb 0%, #eef2ff 100%)',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: 16,
// }
//
// const header = {
//     position: 'sticky',
//     top: 0,
//     background: '#fff',
//     width: '100%',
//     maxWidth: 980,
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 16,
//     border: '1px solid #e5e7eb',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
// }
//
// const card = {
//     background: '#fff',
//     border: '1px solid #e5e7eb',
//     borderRadius: 16,
//     padding: 16,
//     boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
// }
//
// const h2 = { margin: 0, marginBottom: 12, fontSize: 18 }

// src/App.jsx
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

    // FCM
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

            {/* Header */}
            <header
                className="sticky top-0 z-10 glass px-4 py-3 mb-4 max-w-4xl w-full flex justify-between items-center">
                <div className="font-extrabold text-lg flex items-center gap-2">📍 Event Planner</div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400">{user.email}</span>
                    <button onClick={logout} className="btn-ghost text-sm px-3 py-1.5">Выйти</button>
                </div>
            </header>

            {/* Main */}
            <main className="grid gap-6 max-w-4xl w-full">
                {/* Создать событие */}
                <section className="card">
                    <h2 className="title">Создать событие</h2>
                    <EventForm user={user} onCreate={addEvent}/>
                </section>

                {/* Места поблизости */}
                <section className="card">
                    <h2 className="title">Места поблизости</h2>
                    <div className="text-xs text-slate-500 mb-2">
                        {hasCoords
                            ? `Ваше местоположение: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
                            : 'Определяю местоположение...'}
                    </div>
                    {hasCoords && <Recommendations coords={position}/>}
                </section>

                {/* Мои события */}
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
