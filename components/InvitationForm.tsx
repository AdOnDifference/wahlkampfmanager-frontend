import { useState } from 'react';
import { previewInvitation, downloadInvitationPdf, type InvitationRequest } from '../lib/invitations';

export default function InvitationForm() {
    const [form, setForm] = useState<InvitationRequest>({
        orgName: 'JU Flörsheim',
        meetingDate: '',
        meetingTime: '',
        locationName: '',
        locationStreet: '',
        locationCity: '',
        letterCity: '',
        agenda: ['Begrüßung', 'Bericht des Vorsitzenden', 'Verschiedenes'],
    });
    const [html, setHtml] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const change = (k: keyof InvitationRequest) => (e: any) => {
        setForm({ ...form, [k]: e.target.value });
    };

    // NEU:
    const [agendaText, setAgendaText] = useState(form.agenda.join('\n'));

    const changeAgendaText = (e: any) => {
        const text = e.target.value;
        setAgendaText(text);
        // Wichtig: hier KEIN trim/filter, sonst „verschwindet“ Enter optisch sofort.
        setForm({ ...form, agenda: text.split('\n') });
    };


    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div className="card space-y-4">
                {err && <div className="text-red-600">{err}</div>}
                <div>
                    <label className="label">Organisation *</label>
                    <input className="input" value={form.orgName} onChange={change('orgName')} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">Datum *</label>
                        <input type="date" className="input" value={form.meetingDate} onChange={change('meetingDate')} required />
                    </div>
                    <div>
                        <label className="label">Uhrzeit *</label>
                        <input type="time" className="input" value={form.meetingTime} onChange={change('meetingTime')} required />
                    </div>
                </div>
                <div>
                    <label className="label">Ort (Name) *</label>
                    <input className="input" value={form.locationName} onChange={change('locationName')} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label">Straße *</label>
                        <input className="input" value={form.locationStreet} onChange={change('locationStreet')} required />
                    </div>
                    <div>
                        <label className="label">PLZ Ort *</label>
                        <input className="input" value={form.locationCity} onChange={change('locationCity')} required />
                    </div>
                </div>
                <div>
                    <label className="label">Briefkopf-Ort (optional)</label>
                    <input className="input" value={form.letterCity ?? ''} onChange={change('letterCity')} placeholder="z. B. Flörsheim am Main" />
                </div>
                <div>
                    <label className="label">Tagesordnung (je Zeile ein Punkt)</label>
                    <textarea className="input min-h-[140px]" value={agendaText} onChange={changeAgendaText} />
                </div>

                <div className="flex gap-3">
                    <button
                        className="btn btn-ghost"
                        onClick={async () => {
                            setErr(null); setLoading(true);
                            try {
                                const h = await previewInvitation(form);
                                setHtml(h);
                            } catch (e:any) { setErr(e.message || String(e)); }
                            finally { setLoading(false); }
                        }}
                        disabled={loading}
                    >
                        Vorschau aktualisieren
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={async () => {
                            setErr(null); setLoading(true);
                            try { await downloadInvitationPdf(form); }
                            catch (e:any) { setErr(e.message || String(e)); }
                            finally { setLoading(false); }
                        }}
                        disabled={loading}
                    >
                        PDF herunterladen
                    </button>
                </div>
                <p className="text-xs text-gray-500">API: {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}</p>
            </div>

            <div className="card">
                <div className="mb-2 font-medium">Vorschau</div>
                <iframe
                    title="preview"
                    className="w-full h-[70vh] border rounded"
                    srcDoc={html || '<div style="padding:16px;color:#666;">Noch keine Vorschau – klicke „Vorschau aktualisieren“.</div>'}
                />
            </div>
        </div>
    );
}
