// src/components/Auth.jsx
import React, { useState } from 'react'

export default function Auth({ onEmailLogin, onEmailRegister, onGoogle }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState(null)
    const [loading, setLoading] = useState(false)

    async function handleEmailLogin() {
        setErr(null); setLoading(true)
        try { await onEmailLogin(email.trim(), password) }
        catch (e) { setErr(e?.message || 'Ошибка входа') }
        finally { setLoading(false) }
    }

    async function handleEmailRegister() {
        setErr(null); setLoading(true)
        try { await onEmailRegister(email.trim(), password) }
        catch (e) { setErr(e?.message || 'Ошибка регистрации') }
        finally { setLoading(false) }
    }

    async function handleGoogle() {
        setErr(null); setLoading(true)
        try { await onGoogle() }
        catch (e) { setErr(e?.message || 'Ошибка входа через Google') }
        finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen justify-center bg-zinc-950 text-zinc-100 flex flex-col items-center p-4">
            <div className="card w-96">
                <h1 className="title text-center">Вход</h1>
                <div className="grid gap-3">
                    <input
                        className="input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        className="input"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={handleEmailLogin}
                        disabled={loading}
                        className="btn-primary"
                    >
                        Войти по email
                    </button>
                    <button
                        onClick={handleEmailRegister}
                        disabled={loading}
                        className="btn-ghost"
                    >
                        Регистрация
                    </button>
                    <button onClick={handleGoogle} disabled={loading} className="btn-ghost">
                        Войти через Google
                    </button>

                    {err && <div className="text-xs text-rose-500 mt-1">{err}</div>}
                </div>
            </div>
        </div>
    )
}
