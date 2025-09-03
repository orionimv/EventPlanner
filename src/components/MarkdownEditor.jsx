import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function MarkdownEditor({ value, onChange }) {
    const [tab, setTab] = useState('edit')

    return (
        <div className="glass rounded-xl overflow-hidden border border-white/10">
            <div className="flex gap-2 p-2 bg-surface border-b border-white/10">
                <button
                    type="button"
                    onClick={() => setTab('edit')}
                    disabled={tab === 'edit'}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                        tab === 'edit'
                            ? 'bg-accent text-white shadow'
                            : 'bg-surface text-slate-300 hover:bg-white/5'
                    }`}
                >
                    Редактор
                </button>
                <button
                    type="button"
                    onClick={() => setTab('preview')}
                    disabled={tab === 'preview'}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                        tab === 'preview'
                            ? 'bg-accent text-white shadow'
                            : 'bg-surface text-slate-300 hover:bg-white/5'
                    }`}
                >
                    Предпросмотр
                </button>
            </div>

            {tab === 'edit' ? (
                <textarea
                    className="w-full min-h-[140px] p-3 bg-surface text-slate-200 border-0 outline-none resize-none placeholder-slate-500"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Описание в Markdown..."
                />
            ) : (
                <div className="p-3 prose prose-invert max-w-none text-slate-200">
                    <ReactMarkdown>{value?.trim() || '*Пока пусто...*'}</ReactMarkdown>
                </div>
            )}
        </div>
    )
}

