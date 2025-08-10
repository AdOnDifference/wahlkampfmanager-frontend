import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ContactForm from '../components/ContactForm'
import { api, type Contact } from '../lib/api'

export default function EditContactPage() {
  const router = useRouter();
  const { id } = router.query;
  const [contact, setContact] = useState<Contact | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      try {
        const c = await api.getContact(Number(id));
        setContact(c);
      } catch (e: any) {
        setError(e.message || String(e));
      }
    };
    run();
  }, [id]);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="title">Kontakt bearbeiten</h1>
        <Link className="btn btn-ghost" href="/">Zurück</Link>
      </div>
      <div className="card">
        {error && <div className="text-red-600">{error}</div>}
        {!contact && !error && <div>Lade…</div>}
        {contact && <ContactForm initial={contact} submitLabel="Speichern" onSubmit={async (c) => {
          await api.updateContact(Number(id), { ...contact, ...c });
          router.push('/');
        }} />}
      </div>
    </div>
  )
}
