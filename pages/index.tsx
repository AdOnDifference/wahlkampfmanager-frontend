// pages/index.tsx
import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import ContactForm from "../components/ContactForm";

// Bestehende Page /invitations/new als Komponente lazy-laden (clientseitig)
const PdfGeneratorPage = dynamic(
    () => import("./invitations/new").then((m) => m.default as React.ComponentType),
    { ssr: false }
);

export default function HomePage() {
  const [tab, setTab] = useState<"ansprechpartner" | "pdf">("ansprechpartner");

  // ---- FIX: Pflichtprop onSubmit für ContactForm sauber typisiert übergeben ----
  // ---- FIX: Pflichtprop onSubmit für ContactForm sauber typisiert übergeben ----
  type ContactFormProps = React.ComponentProps<typeof ContactForm>;

  const handleContactSubmit: ContactFormProps["onSubmit"] = async (values) => {
    try {
      const r = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!r.ok) {
        const msg = await r.text();
        throw new Error(`Speichern fehlgeschlagen: ${r.status} ${msg}`);
      }
      alert("Ansprechpartner gespeichert ✅");
    } catch (err) {
      console.error(err);
      alert("Speichern fehlgeschlagen ❌");
    }
  };
// ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------

  return (
      <>
        <Head>
          <title>Wahlkampfmanager</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <div className="min-h-screen bg-white text-zinc-900">
          {/* Navbar */}
          <header className="sticky top-0 z-40 w-full border-b bg-white/60 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="grid h-7 w-7 place-items-center rounded-full border">
                  <span className="text-sm font-bold">WK</span>
                </div>
                <a href="/" className="font-semibold tracking-tight">
                  Wahlkampfmanager
                </a>
                <nav className="ml-6 hidden items-center gap-5 text-sm text-zinc-600 md:flex">
                  <a href="/contacts" className="hover:text-zinc-900 font-medium">Ansprechpartner</a>

                </nav>
              </div>
              <div className="flex items-center gap-2">
                <a className="hidden rounded-full px-4 py-2 text-sm hover:bg-zinc-100 md:inline-block" href="#login">
                  Log in
                </a>
                <a className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-white hover:opacity-90" href="#switch">
                  Kostenlos starten
                </a>
              </div>
            </div>
          </header>

          {/* Hero */}
          <section className="relative">
            <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
              <div className="mb-6 flex justify-center">
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs">
                Befindet sich noch in der Entwicklung
              </span>
              </div>
              <h1 className="mx-auto max-w-3xl text-center text-4xl font-extrabold leading-tight sm:text-5xl">
                Der Wahlkampfmanager für
                <br className="hidden sm:block" />
                Kampagnen und moderne Verbandsarbeit.
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-center text-zinc-600">
                Verwalte Ansprechpartner & generiere Einladungen
              </p>

              <div className="mt-8 flex items-center justify-center gap-3">
                <a href="#switch" className="rounded-full bg-zinc-900 px-6 py-3 text-sm text-white hover:opacity-90">
                  Los geht’s
                </a>
                <a
                    href="/contacts"
                    className="rounded-full border px-6 py-3 text-sm hover:bg-zinc-50"
                >
                  Ansprechpartner ansehen
                </a>
              </div>
            </div>
            {/* dezenter Glow rechts */}
            <div className="pointer-events-none absolute right-0 top-0 hidden h-64 w-60 translate-x-10 select-none bg-gradient-to-b from-zinc-100 to-transparent sm:block" />
          </section>

          {/* Tabs-Switcher */}
          <section id="switch" className="mx-auto max-w-6xl px-4 pb-24">
            <div className="rounded-2xl border shadow-sm">
              <div className="p-4 sm:p-6">
                {/* Tabs Header */}
                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                  <div className="inline-flex items-center gap-1 rounded-full bg-zinc-100 p-1">
                    <button
                        onClick={() => setTab("ansprechpartner")}
                        className={`rounded-full px-5 py-2 text-sm transition ${
                            tab === "ansprechpartner"
                                ? "bg-white shadow-sm"
                                : "text-zinc-600 hover:text-zinc-900"
                        }`}
                    >
                      Ansprechpartner
                    </button>
                    <button
                        onClick={() => setTab("pdf")}
                        className={`rounded-full px-5 py-2 text-sm transition ${
                            tab === "pdf" ? "bg-white shadow-sm" : "text-zinc-600 hover:text-zinc-900"
                        }`}
                    >
                      PDF-Generator
                    </button>
                  </div>

                </div>

                <div className="mt-6" />

                {/* Tabs Content */}
                {tab === "ansprechpartner" ? (
                    <div className="grid gap-6 md:grid-cols-12">
                      <div className="md:col-span-8">
                        {/* FIX: ContactForm mit Pflichtprop */}
                        <ContactForm onSubmit={handleContactSubmit} />
                      </div>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-12">
                      <div className="md:col-span-8">
                        {/* Dein existierender PDF-Generator aus /pages/invitations/new */}
                        <PdfGeneratorPage />
                      </div>
                      <aside className="md:col-span-4">
                        <div className="sticky top-24 rounded-xl border">
                          <div className="space-y-2 p-4">
                            <h3 className="text-sm font-semibold">Export</h3>
                            <p className="text-sm text-zinc-600">
                              Erzeugt druckfertige PDFs für eure Vorstandseinladungen.
                            </p>
                          </div>
                        </div>
                      </aside>
                    </div>
                )}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t py-10">
            <div className="mx-auto max-w-6xl px-4 text-sm text-zinc-500">
              © {new Date().getFullYear()} Wahlkampfmanager. Alle Rechte vorbehalten.
            </div>
          </footer>
        </div>

        {/* Unsichtbare Anker-Ziele, damit VSCode/TS die #anchor-Warnungen nicht mehr meldet */}
        <section id="product" className="sr-only" aria-hidden="true" />
        <section id="about" className="sr-only" aria-hidden="true" />
        <section id="faq" className="sr-only" aria-hidden="true" />
        <section id="blog" className="sr-only" aria-hidden="true" />
        <section id="contact" className="sr-only" aria-hidden="true" />
        <section id="login" className="sr-only" aria-hidden="true" />
        <section id="switch-anchor" className="sr-only" aria-hidden="true" />
      </>
  );
}
