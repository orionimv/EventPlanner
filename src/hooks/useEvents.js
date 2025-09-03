import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { db } from '../firebase.js'
import {
    collection,
    addDoc,
    onSnapshot,
    query as fsQuery,
    orderBy,
    where,
    serverTimestamp,
    updateDoc,
    doc,
    deleteDoc
} from 'firebase/firestore'
import localforage from 'localforage'

const EVENTS_CACHE_KEY = 'events_cache_v1'

export function useEvents(userId) {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const cacheKey = useMemo(
        () => `${EVENTS_CACHE_KEY}:${userId || 'all'}`,
        [userId]
    )

    const q = useMemo(() => {
        const col = collection(db, 'events')
        return userId
            ? fsQuery(col, where('participants', 'array-contains', userId), orderBy('start'))
            : fsQuery(col, orderBy('start'))
    }, [userId])

    useEffect(() => {
        setLoading(true)
        setError(null)
        let unsub = null
        let cancelled = false

        ;(async () => {

            try {
                const cached = await localforage.getItem(cacheKey)
                if (!cancelled && cached) setEvents(cached)
            } catch (e) {
                console.warn('cache read', e)
            }


            try {
                unsub = onSnapshot(
                    q,
                    (snap) => {
                        if (cancelled) return
                        const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
                        setEvents(arr)
                        localforage.setItem(cacheKey, arr).catch(() => {})
                        setLoading(false)
                    },
                    (e) => {
                        if (cancelled) return
                        console.error(e)
                        setError(e.message)
                        setLoading(false)
                    }
                )
            } catch (e) {
                if (cancelled) return
                console.error(e)
                setError(e.message)
                setLoading(false)
            }
        })()

        return () => {
            cancelled = true
            if (typeof unsub === 'function') unsub()
        }
    }, [q, cacheKey])

    const addEvent = useCallback(async (ev) => {
        await addDoc(collection(db, 'events'), {
            ...ev,
            createdAt: serverTimestamp(),
        })
    }, [])

    const updateEvent = useCallback(async (id, data) => {
        await updateDoc(doc(db, 'events', id), data)
    }, [])

    const removeEvent = useCallback(async (id) => {
        await deleteDoc(doc(db, 'events', id))
    }, [])

    return { events, loading, error, addEvent, updateEvent, removeEvent }
}
