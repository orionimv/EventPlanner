// src/ErrorBoundary.jsx
import React from 'react'
export default class ErrorBoundary extends React.Component {
    constructor(p){ super(p); this.state={err:null} }
    static getDerivedStateFromError(err){ return {err} }
    componentDidCatch(err, info){ console.error('App error:', err, info) }
    render(){
        if(this.state.err){
            return <div style={{padding:16,color:'#fff'}}>
                <h2>🔥 Ошибка в приложении</h2>
                <pre style={{whiteSpace:'pre-wrap'}}>{String(this.state.err.stack||this.state.err)}</pre>
            </div>
        }
        return this.props.children
    }
}
