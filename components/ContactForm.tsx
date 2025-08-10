import { useState } from 'react';
import type { Contact } from '../lib/api';

type Props = {
  initial?: Contact;
  onSubmit: (c: Contact) => Promise<void> | void;
  submitLabel?: string;
};

export default function ContactForm({ initial, onSubmit, submitLabel = 'Speichern' }: Props) {
  const [form, setForm] = useState<Contact>({
    firstName: initial?.firstName ?? '',
    lastName:  initial?.lastName  ?? '',
    role: initial?.role || '',
    city: initial?.city || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    tags: initial?.tags || '',
    consent: initial?.consent ?? false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const change = (k: keyof Contact) => (e: any) => {
    const v = k === 'consent' ? e.target.checked : e.target.value;
    setForm({ ...form, [k]: v });
  };

  return (
    <form className="space-y-4" onSubmit={async (e) => {
      e.preventDefault();
      setError(null); setLoading(true);
      try { await onSubmit(form); } 
      catch (err: any) { setError(err.message || String(err)); } 
      finally { setLoading(false); }
    }}>
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Vorname *</label>
          <input
              required
              className="input"
              value={form.firstName}
              onChange={change('firstName')}
              placeholder="Vorname"
          />
        </div>
        <div>
          <label className="label">Nachname *</label>
          <input
              required
              className="input"
              value={form.lastName}
              onChange={change('lastName')}
              placeholder="Nachname"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Rolle</label>
          <input className="input" value={form.role} onChange={change('role')} />
        </div>
        <div>
          <label className="label">Stadt</label>
          <input className="input" value={form.city} onChange={change('city')} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">E-Mail</label>
          <input type="email" className="input" value={form.email} onChange={change('email')} />
        </div>
        <div>
          <label className="label">Telefon</label>
          <input className="input" value={form.phone} onChange={change('phone')} />
        </div>
      </div>
      <div>
        <label className="label">Tags (kommagetrennt)</label>
        <input className="input" value={form.tags} onChange={change('tags')} />
      </div>
      <div className="flex items-center gap-2">
        <input id="consent" type="checkbox" checked={!!form.consent} onChange={change('consent')} />
        <label htmlFor="consent">Einwilligung liegt vor</label>
      </div>
      <div className="flex gap-3">
        <button disabled={loading} className="btn btn-primary">{submitLabel}</button>
      </div>
    </form>
  )
}
