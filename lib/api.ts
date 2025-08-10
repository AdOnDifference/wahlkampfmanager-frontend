const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Contact = {
  id?: number;
  firstName: string;
  lastName: string;
  role?: string;
  city?: string;
  email?: string;
  phone?: string;
  tags?: string | null;
  consent?: boolean;
  consentDate?: string | null;
  lastTouch?: string | null;
  nextFollowup?: string | null;
};

function normalize(c: any): Contact {
  // falls aus Kompatibilität mal nur "name" käme
  const [fn, ...rest] = (c.firstName ?? c.name ?? '').trim().split(/\s+/);
  const ln = c.lastName ?? (rest.length ? rest.join(' ') : '');
  return {
    id: c.id,
    firstName: c.firstName ?? fn ?? '',
    lastName: ln ?? '',
    role: c.role ?? '',
    city: c.city ?? '',
    email: c.email ?? '',
    phone: c.phone ?? '',
    tags: c.tags ?? '',
    consent: c.consent ?? false,
    consentDate: c.consentDate ?? null,
    lastTouch: c.lastTouch ?? null,
    nextFollowup: c.nextFollowup ?? null,
  };
}

export async function getContacts(): Promise<Contact[]> {
  const res = await fetch(`${BASE}/api/contacts`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load contacts');
  const data = await res.json();
  return data.map(normalize);
}

export async function getContact(id: number): Promise<Contact> {
  const res = await fetch(`${BASE}/api/contacts/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load contact');
  return normalize(await res.json());
}

export async function createContact(c: Contact): Promise<Contact> {
  const res = await fetch(`${BASE}/api/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(c),
  });
  if (!res.ok) throw new Error('Failed to create');
  return normalize(await res.json());
}

export async function updateContact(id: number, c: Contact): Promise<Contact> {
  const res = await fetch(`${BASE}/api/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(c),
  });
  if (!res.ok) throw new Error('Failed to update');
  return normalize(await res.json());
}

export async function deleteContact(id: number) {
  const res = await fetch(`${BASE}/api/contacts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}
// ... deine vorhandenen Exports (Contact, getContacts, getContact, createContact, updateContact, deleteContact) ...

export const api = {
  listContacts: getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
