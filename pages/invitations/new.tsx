import Link from 'next/link';
import InvitationForm from '../../components/InvitationForm';

export default function NewInvitationPage() {
    return (
        <div className="container py-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="title">Einladung erstellen</h1>
                <Link href="/" className="btn btn-ghost">← Zurück</Link>
            </div>
            <InvitationForm />
        </div>
    );
}
