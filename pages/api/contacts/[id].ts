import type { NextApiRequest, NextApiResponse } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
 // z.B. https://wahlkampfmanager.onrender.com
function backend(path: string) {
    return `${(BACKEND_URL ?? "").replace(/\/$/, "")}${path}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!BACKEND_URL) return res.status(500).json({ error: "Missing BACKEND_URL env var" });

    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing id" });

    const url = backend(`/api/contacts/${id}`);

    try {
        if (req.method === "GET") {
            const r = await fetch(url, { headers: { Accept: "application/json" } });
            const text = await r.text();
            if (!r.ok) return res.status(r.status).send(text);
            return res.status(200).send(text);
        }

        if (req.method === "PUT" || req.method === "PATCH") {
            const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
            const payload: any = {
                name: body.name ?? undefined,
                email: body.email ?? undefined,
                role: body.role ?? undefined,
                city: body.city ?? undefined,
                consent: typeof body.consent === "boolean" ? body.consent : undefined,
                phone: body.phone ?? undefined,
            };
            const r = await fetch(url, {
                method: "PUT", // falls dein Backend PATCH möchte, hier auf "PATCH" ändern
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });
            const text = await r.text();
            if (!r.ok) return res.status(r.status).send(text);
            return res.status(200).send(text);
        }

        if (req.method === "DELETE") {
            const r = await fetch(url, { method: "DELETE" });
            const text = await r.text();
            if (!r.ok) return res.status(r.status).send(text);
            return res.status(200).send(text || "{}");
        }

        res.setHeader("Allow", "GET, PUT, PATCH, DELETE");
        return res.status(405).json({ error: "Method Not Allowed" });
    } catch (e: any) {
        return res.status(502).json({ error: "Upstream fetch failed", detail: String(e) });
    }
}
