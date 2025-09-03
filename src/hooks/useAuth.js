// import { useEffect, useState } from 'react'
// import { auth, googleProvider } from '../firebase'
// import {
//     onAuthStateChanged,
//     signInWithEmailAndPassword,       // ← было singIn…
//     createUserWithEmailAndPassword,
//     signInWithPopup,                 // ← было singIn…
//     signOut
// } from 'firebase/auth'
//
// export function useAuth() {
//     const [user, setUser] = useState(null)
//     const [loading, setLoading] = useState(true)
//
//     useEffect(() => {
//         const unsub = onAuthStateChanged(auth, (u) => {
//             setUser(u)
//             setLoading(false)
//         })
//         return () => unsub()
//     }, [])
//
//     const loginEmail = (email, password) =>
//         signInWithEmailAndPassword(auth, email, password)
//
//     const registerEmail = (email, password) =>
//         createUserWithEmailAndPassword(auth, email, password)
//
//     const loginGoogle = () => signInWithPopup(auth, googleProvider)
//
//     const logout = () => signOut(auth)
//
//     return { user, loading, loginEmail, registerEmail, loginGoogle, logout }
// }

import { useEffect, useState, useCallback } from 'react'
import { auth, googleProvider } from '../firebase'
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut
} from 'firebase/auth'

export function useAuth() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true
        const unsub = onAuthStateChanged(auth, (u) => {
            if (!active) return
            setUser(u)
            setLoading(false)
        })
        return () => { active = false; unsub() }
    }, [])

    const loginEmail = useCallback(
        (email, password) => signInWithEmailAndPassword(auth, email, password),
        []
    )

    const registerEmail = useCallback(
        (email, password) => createUserWithEmailAndPassword(auth, email, password),
        []
    )

    const loginGoogle = useCallback(
        () => signInWithPopup(auth, googleProvider),
        []
    )

    const logout = useCallback(
        () => signOut(auth),
        []
    )

    return { user, loading, loginEmail, registerEmail, loginGoogle, logout }
}
