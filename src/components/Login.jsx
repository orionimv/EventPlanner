import React, { useState } from 'react'
import { auth } from '../firebase'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithRedirect,
    getRedirectResult,
} from 'firebase/auth'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    // вход по email/паролю
    const handleLogin = async () => {
        setError(null)
        try {
            const res = await signInWithEmailAndPassword(auth, email, password)
            console.log('Успешный вход:', res.user)
        } catch (e) {
            console.error('Ошибка входа:', e.code, e.message)
            setError(e.message)
        }
    }

    // регистрация (если надо)
    const handleRegister = async () => {
        setError(null)
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)
            console.log('Регистрация успешна:', res.user)
        } catch (e) {
            console.error('Ошибка регистрации:', e.code, e.message)
            setError(e.message)
        }
    }

    // вход через Google (только redirect в WebView!)
    const handleGoogleLogin = async () => {
        setError(null)
        const provider = new GoogleAuthProvider()
        try {
            await signInWithRedirect(auth, provider)
        } catch (e) {
            console.error('Ошибка Google входа:', e.code, e.message)
            setError(e.message)
        }
    }

    // результат после redirect (например, в useEffect в App.jsx)
    React.useEffect(() => {
        getRedirectResult(auth)
            .then((res) => {
                if (res?.user) {
                    console.log('Google вход успешен:', res.user)
                }
            })
            .catch((e) => {
                if (e) {
                    console.error('Ошибка после redirect:', e.code, e.message)
                }
            })
    }, [])

    return (
        <div style={{ padding: 20 }}>
            <h2>Вход</h2>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />

            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />

            <button onClick={handleLogin}>Войти по email</button>
            <button onClick={handleRegister}>Регистрация</button>
            <button onClick={handleGoogleLogin}>Войти через Google</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}
