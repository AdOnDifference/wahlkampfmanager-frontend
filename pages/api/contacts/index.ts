import type { NextApiRequest, NextApiResponse } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

function backend(path: string) {
    return `${(BACKEND_URL ?? "").replace(/\/$/, "")}${path}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!BACKEND_URL) {
        return res.status(500).json({ error: "Missing BACKEND_URL env var" });
    }

    const url = backend("/api/contacts");

    try {
        if (req.method === "GET") {
            const r = await fetch(url, { headers: { Accept: "application/json" } });
            const text = await r.text();
            if (!r.ok) return res.status(r.status).send(text);
            return res.status(200).send(text);
        }

        if (req.method === "POST") {
            const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
            const payload = {
                name:
                    body.name ||
                    [body.firstName, body.lastName].filter(Boolean).join(" ").trim() ||
                    undefined,
                role: body.role ?? null,
                city: body.city ?? null,
                email: body.email ?? null,
                consent: typeof body.consent === "boolean" ? body.consent : true,
            };

            const r = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(payload),
            });
            const text = await r.text();
            if (!r.ok) return res.status(r.status).send(text);
            return res.status(200).send(text);
        }

        res.setHeader("Allow", "GET, POST");
        return res.status(405).json({ error: "Method Not Allowed" });
    } catch (e: any) {
        return res.status(502).json({ error: "Upstream fetch failed", detail: String(e) });
    }
}
