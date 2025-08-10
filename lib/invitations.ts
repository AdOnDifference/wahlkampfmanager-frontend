const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export type InvitationRequest = {
    orgName: string;
    meetingDate: string;   // YYYY-MM-DD
    meetingTime: string;   // HH:mm
    locationName: string;
    locationStreet: string;
    locationCity: string;
    letterCity?: string;   // optional
    agenda: string[];      // Punkte
};

export async function previewInvitation(data: InvitationRequest): Promise<string> {
    const res = await fetch(`${BASE}/api/invitations/html`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Preview failed (${res.status})`);
    return await res.text(); // HTML-String
}

export async function downloadInvitationPdf(data: InvitationRequest): Promise<void> {
    const res = await fetch(`${BASE}/api/invitations/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const txt = await res.text().catch(()=>'');
        throw new Error(`PDF failed (${res.status}): ${txt}`);
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'einladung.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
