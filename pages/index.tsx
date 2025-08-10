import Link from 'next/link'
import { useEffect, useState } from 'react'
import { api, type Contact } from '../lib/api'

export default function Home() {
  const [data, setData] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const res = await api.listContacts();
      setData(res);
    } catch (e: any) { setError(e.message || String(e)); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="title">Ansprechpartner</h1>
        <div className="flex gap-3">
          <Link className="btn btn-ghost" href="/new">+ Neu</Link>
        </div>
      </div>

      <div className="card">
        {loading && <div>Lade…</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && data.length === 0 && <div>Keine Einträge vorhanden.</div>}
        <ul className="divide-y">
          {data.map(c => (
            <li key={c.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{c.firstName} {c.lastName}</div>
                <div className="text-sm text-gray-600">{[c.role, c.city, c.email].filter(Boolean).join(' · ')}</div>
              </div>
              <div className="flex gap-2">
                <Link className="link" href={`/${c.id}`}>Bearbeiten</Link>
                <button className="link" onClick={async () => {
                  if (!c.id) return;
                  if (!confirm('Diesen Kontakt wirklich löschen?')) return;
                  await api.deleteContact(c.id);
                  await load();
                }}>Löschen</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-gray-500">API: {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}</p>
    </div>
  )
}
