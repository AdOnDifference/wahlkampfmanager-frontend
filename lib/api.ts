const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export type Contact = {
  id?: number;
  name: string;
  role?: string;
  city?: string;
  email?: string;
  phone?: string;
  tags?: string;
  consent?: boolean;
  consentDate?: string;
  lastTouch?: string;
  nextFollowup?: string;
};

async function handle(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

export const api = {
  async listContacts(): Promise<Contact[]> {
    const res = await fetch(`${base}/api/contacts`, { cache: 'no-store' });
    return handle(res);
  },
  async getContact(id: number): Promise<Contact> {
    const res = await fetch(`${base}/api/contacts/${id}`, { cache: 'no-store' });
    return handle(res);
  },
  async createContact(c: Contact): Promise<Contact> {
    const res = await fetch(`${base}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(c),
    });
    return handle(res);
  },
  async updateContact(id: number, c: Contact): Promise<Contact> {
    const res = await fetch(`${base}/api/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(c),
    });
    return handle(res);
  },
  async deleteContact(id: number): Promise<void> {
    const res = await fetch(`${base}/api/contacts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Delete failed ${res.status}`);
  },
};
