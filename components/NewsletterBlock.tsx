'use client';

import { useState } from 'react';

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
      <path d="M4 12.5 10 18 20 6" />
    </svg>
  );
}

export default function NewsletterBlock() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) {
        setStatus('success');
        setMsg(data.message ?? 'Willkommen!');
        setEmail('');
      } else {
        setStatus('error');
        setMsg(data.error ?? 'Fehler aufgetreten.');
      }
    } catch {
      setStatus('error');
      setMsg('Verbindungsfehler. Bitte versuche es erneut.');
    }
  }

  return (
    <section className="newsletter">
      <div>
        <h2>Eine Dosis Hoffnung. Täglich. In dein Postfach.</h2>
        <p>
          Die besten positiven Nachrichten — direkt zu dir. Kein Spam, keine Werbung, kein Drama.
          Nur das, was diese Welt ein bisschen heller macht.
        </p>
      </div>
      <div>
        {status === 'success' ? (
          <div className="nl-success">
            <span
              style={{
                background: 'var(--accent)',
                color: 'var(--ink)',
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IconCheck />
            </span>
            <div>
              <strong style={{ color: 'var(--bg)' }}>Willkommen.</strong> {msg}
            </div>
          </div>
        ) : (
          <form className="nl-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="deine@email.de"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Anmelden…' : 'Anmelden'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <div style={{ fontSize: 12, color: 'oklch(0.65 0.15 30)', marginTop: 8 }}>{msg}</div>
        )}
        <div style={{ fontSize: 12, opacity: 0.55, marginTop: 12 }}>
          Jederzeit kündbar. Kostenlos.
        </div>
      </div>
    </section>
  );
}
