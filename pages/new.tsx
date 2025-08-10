import Link from 'next/link'
import { useRouter } from 'next/router'
import ContactForm from '../components/ContactForm'
import { api } from '../lib/api'

export default function NewContactPage() {
  const router = useRouter();

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="title">Neuer Ansprechpartner</h1>
        <Link className="btn btn-ghost" href="/">Zurück</Link>
      </div>
      <div className="card">
        <ContactForm submitLabel="Anlegen" onSubmit={async (c) => {
          await api.createContact(c);
          router.push('/');
        }} />
      </div>
    </div>
  )
}
