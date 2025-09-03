import { createRoot } from 'react-dom/client'   // 👈 берём именно createRoot
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
    <HashRouter>
        <App />
    </HashRouter>
)
