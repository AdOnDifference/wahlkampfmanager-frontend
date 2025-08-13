import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";

type Contact = {
    id?: string | number;
    name?: string;
    email?: string;
    role?: string;
    city?: string;
    phone?: string;
    consent?: boolean;
    createdAt?: string;
    [k: string]: any;
};

export default function ContactsPage() {
    const [data, setData] = useState<Contact[]>([]);
    const [q, setQ] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    // Edit-Modal State
    const [editing, setEditing] = useState<Contact | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                setErr(null);
                const r = await fetch("/api/contacts");
                if (!r.ok) throw new Error(`API ${r.status}`);
                const json = await r.json();
                const items: Contact[] = Array.isArray(json) ? json : json.items ?? json.data ?? [];
                if (!cancelled) setData(items);
            } catch (e: any) {
                if (!cancelled) setErr(String(e?.message ?? e));
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const roleOptions = useMemo(
        () => Array.from(new Set(data.map(c => c.role).filter(Boolean) as string[])).sort(),
        [data]
    );
    const cityOptions = useMemo(
        () => Array.from(new Set(data.map(c => c.city).filter(Boolean) as string[])).sort(),
        [data]
    );

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        return data.filter((c) => {
            const matchesSearch =
                !term ||
                [c.name, c.email, c.role, c.city, String(c.id ?? "")]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase()
                    .includes(term);

            const matchesRole = !roleFilter || c.role === roleFilter;
            const matchesCity = !cityFilter || c.city === cityFilter;

            return matchesSearch && matchesRole && matchesCity;
        });
    }, [data, q, roleFilter, cityFilter]);

    // ---- Editieren speichern ----
    async function saveEdit() {
        if (!editing?.id) return;
        setSaving(true);
        try {
            const r = await fetch(`/api/contacts/${editing.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editing.name ?? "",
                    email: editing.email ?? "",
                    role: editing.role ?? "",
                    city: editing.city ?? "",
                    phone: editing.phone ?? "",
                    consent: typeof editing.consent === "boolean" ? editing.consent : true,
                }),
            });
            const updated = await r.json().catch(() => null);
            if (!r.ok) throw new Error(`Speichern fehlgeschlagen: ${r.status} ${JSON.stringify(updated)}`);

            // Liste lokal aktualisieren
            setData(prev => prev.map(c => (String(c.id) === String(editing.id) ? { ...c, ...editing } : c)));
            setEditing(null);
        } catch (e: any) {
            alert(String(e?.message ?? e));
        } finally {
            setSaving(false);
        }
    }

    // ---- Optional: Löschen ----
    async function deleteContact(id?: string | number) {
        if (!id) return;
        if (!confirm("Diesen Ansprechpartner wirklich löschen?")) return;
        setDeleting(true);
        try {
            const r = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
            const text = await r.text();
            if (!r.ok) throw new Error(`Löschen fehlgeschlagen: ${r.status} ${text}`);
            setData(prev => prev.filter(c => String(c.id) !== String(id)));
            if (editing && String(editing.id) === String(id)) setEditing(null);
        } catch (e: any) {
            alert(String(e?.message ?? e));
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            <Head><title>Ansprechpartner – Wahlkampfmanager</title></Head>

            <div className="min-h-screen bg-white text-zinc-900">
                {/* Header */}
                <header className="sticky top-0 z-40 w-full border-b bg-white/60 backdrop-blur">
                    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                            <div className="grid h-7 w-7 place-items-center rounded-full border">
                                <span className="text-sm font-bold">WK</span>
                            </div>
                            <a href="/" className="font-semibold tracking-tight">Wahlkampfmanager</a>
                        </div>
                        <nav className="hidden items-center gap-5 text-sm text-zinc-600 md:flex">
                            <a href="/contacts" className="font-medium text-zinc-900">Ansprechpartner</a>
                            <a href="/" className="hover:text-zinc-900">Start</a>
                        </nav>
                    </div>
                </header>

                {/* Content */}
                <main className="mx-auto max-w-6xl px-4 py-8">
                    <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                        <h1 className="text-2xl font-bold">Ansprechpartner</h1>

                        {/* Suche + Filter */}
                        <div className="flex flex-wrap items-center gap-2">
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Suchen…"
                                className="h-9 w-64 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/10"
                            />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="h-9 rounded-lg border px-2 text-sm"
                                aria-label="Rolle filtern"
                            >
                                <option value="">Alle Rollen</option>
                                {roleOptions.map((role) => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                            <select
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                                className="h-9 rounded-lg border px-2 text-sm"
                                aria-label="Stadt filtern"
                            >
                                <option value="">Alle Städte</option>
                                {cityOptions.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>

                            <button
                                onClick={() => { setQ(""); setRoleFilter(""); setCityFilter(""); }}
                                className="h-9 rounded-lg border px-3 text-sm hover:bg-zinc-50"
                                title="Filter zurücksetzen"
                            >
                                Zurücksetzen
                            </button>

                            <a
                                href="/invitations/new"
                                className="h-9 rounded-lg border px-3 text-sm leading-9 hover:bg-zinc-50"
                                title="Zum PDF-Generator"
                            >
                                Zum PDF-Generator
                            </a>
                        </div>
                    </div>

                    {loading && <div className="rounded-lg border p-4 text-sm text-zinc-600">Lade Daten…</div>}
                    {err && (
                        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                            Fehler beim Laden: {err}
                        </div>
                    )}

                    {!loading && !err && (
                        <div className="overflow-x-auto rounded-xl border">
                            <table className="min-w-full text-left text-sm">
                                <thead className="bg-zinc-50 text-zinc-600">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">E-Mail</th>
                                    <th className="px-4 py-3">Rolle</th>
                                    <th className="px-4 py-3">Ort</th>
                                    <th className="px-4 py-3">Angelegt</th>
                                    <th className="px-4 py-3">Aktionen</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filtered.map((c) => (
                                    <tr key={String(c.id ?? `${c.name}-${c.email}`)} className="border-t hover:bg-zinc-50/60">
                                        <td className="px-4 py-3 font-medium">{c.name ?? "—"}</td>
                                        <td className="px-4 py-3">{c.email ?? "—"}</td>
                                        <td className="px-4 py-3">{c.role ?? "—"}</td>
                                        <td className="px-4 py-3">{c.city ?? "—"}</td>
                                        <td className="px-4 py-3">
                                            {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditing({ ...c })}
                                                    className="rounded border px-3 py-1 text-xs hover:bg-zinc-50"
                                                >
                                                    Bearbeiten
                                                </button>
                                                <button
                                                    onClick={() => deleteContact(c.id)}
                                                    className="rounded border border-red-300 px-3 py-1 text-xs text-red-700 hover:bg-red-50"
                                                    disabled={deleting}
                                                >
                                                    {deleting ? "Lösche…" : "Löschen"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                                            Keine Einträge gefunden.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>

            {/* ---- Einfaches Modal für Bearbeiten ---- */}
            {editing && (
                <div className="fixed inset-0 z-[100] grid place-items-center bg-black/30 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-4 shadow-xl">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Ansprechpartner bearbeiten</h2>
                            <button onClick={() => setEditing(null)} className="rounded px-2 py-1 text-sm hover:bg-zinc-100">×</button>
                        </div>

                        <div className="grid gap-3">
                            <label className="grid gap-1 text-sm">
                                <span>Name</span>
                                <input
                                    value={editing.name ?? ""}
                                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                    className="rounded border px-3 py-2"
                                />
                            </label>

                            <label className="grid gap-1 text-sm">
                                <span>E-Mail</span>
                                <input
                                    type="email"
                                    value={editing.email ?? ""}
                                    onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                                    className="rounded border px-3 py-2"
                                />
                            </label>

                            <div className="grid grid-cols-2 gap-3">
                                <label className="grid gap-1 text-sm">
                                    <span>Rolle</span>
                                    <input
                                        value={editing.role ?? ""}
                                        onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                                        className="rounded border px-3 py-2"
                                    />
                                </label>
                                <label className="grid gap-1 text-sm">
                                    <span>Ort</span>
                                    <input
                                        value={editing.city ?? ""}
                                        onChange={(e) => setEditing({ ...editing, city: e.target.value })}
                                        className="rounded border px-3 py-2"
                                    />
                                </label>
                            </div>

                            <label className="inline-flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={!!editing.consent}
                                    onChange={(e) => setEditing({ ...editing, consent: e.target.checked })}
                                />
                                <span>Einwilligung (Datenschutz) erteilt</span>
                            </label>

                            <label className="grid gap-1 text-sm">
                                <span>Telefon</span>
                                <input
                                    value={editing.phone ?? ""}
                                    onChange={(e) => setEditing({ ...editing, phone: e.target.value })}
                                    className="rounded border px-3 py-2"
                                />
                            </label>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setEditing(null)}
                                className="rounded border px-4 py-2 text-sm hover:bg-zinc-50"
                                disabled={saving}
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={saveEdit}
                                className="rounded bg-zinc-900 px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
                                disabled={saving}
                            >
                                {saving ? "Speichere…" : "Speichern"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
