import { LegalLayout } from '@/lib/components';

export const metadata = { title: 'Privacy Policy — AnointedLyrics' };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 500, color: '#1C1B18', marginBottom: 12 }}>{title}</h2>
      <div style={{ color: 'rgba(28,27,24,.78)', lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p style={{ marginBottom: 40, color: 'rgba(28,27,24,.78)', lineHeight: 1.8 }}>
        At AnointedLyrics, we take your privacy seriously. This policy explains what data we collect, how we use it, and your rights regarding that data.
      </p>

      <Section title="1. Information We Collect">
        <p><strong>Account information:</strong> When you register, we collect your email address and, if you sign in with Google, your name and profile picture.</p>
        <br />
        <p><strong>Usage data:</strong> We collect the song inputs you provide (title, concept, genre, mood, etc.) to generate lyrics. We store the lyrics you choose to save.</p>
        <br />
        <p><strong>Payment data:</strong> Payments are processed by Stripe. We do not store your card details. We only receive a transaction confirmation and the amount paid.</p>
        <br />
        <p><strong>Technical data:</strong> We collect standard server logs including IP addresses, browser type, and pages visited for security and performance monitoring.</p>
      </Section>

      <Section title="2. How We Use Your Information">
        <ul style={{ paddingLeft: 20, lineHeight: 2 }}>
          <li>To provide and operate the Service</li>
          <li>To process payments and manage your credit balance</li>
          <li>To generate lyrics based on your inputs using AI</li>
          <li>To send important service updates and account notifications</li>
          <li>To improve the quality and performance of the Service</li>
          <li>To comply with legal obligations and prevent fraud</li>
        </ul>
      </Section>

      <Section title="3. Data Sharing">
        We do not sell, rent, or trade your personal data. We share data only with trusted service providers necessary to operate the platform:
        <ul style={{ paddingLeft: 20, lineHeight: 2, marginTop: 8 }}>
          <li><strong>Supabase</strong> — database and authentication</li>
          <li><strong>Anthropic</strong> — AI lyric generation (your song inputs are sent to their API)</li>
          <li><strong>Stripe</strong> — payment processing</li>
          <li><strong>Vercel</strong> — hosting and infrastructure</li>
        </ul>
        All providers are bound by data processing agreements and applicable privacy laws.
      </Section>

      <Section title="4. Data Retention">
        We retain your account data for as long as your account is active. Saved lyrics are stored until you delete them. If you delete your account, all associated personal data is permanently removed within 30 days. Anonymised usage data may be retained for analytics purposes.
      </Section>

      <Section title="5. Your Rights (GDPR)">
        If you are based in the UK or European Economic Area, you have the following rights:
        <ul style={{ paddingLeft: 20, lineHeight: 2, marginTop: 8 }}>
          <li><strong>Right of access</strong> — request a copy of the data we hold about you</li>
          <li><strong>Right to rectification</strong> — request correction of inaccurate data</li>
          <li><strong>Right to erasure</strong> — request deletion of your personal data</li>
          <li><strong>Right to portability</strong> — receive your data in a machine-readable format</li>
          <li><strong>Right to object</strong> — object to processing of your data</li>
        </ul>
        To exercise any of these rights, contact us at{' '}
        <a href="mailto:privacy@anointedlyrics.com" style={{ color: '#C6A24B' }}>privacy@anointedlyrics.com</a>.
      </Section>

      <Section title="6. Cookies">
        We use essential cookies only — for authentication sessions and security. We do not use advertising or tracking cookies. You can control cookies through your browser settings, but disabling essential cookies will prevent you from logging in.
      </Section>

      <Section title="7. Security">
        We implement industry-standard security measures including HTTPS encryption, secure authentication via Supabase, and regular security reviews. However, no system is completely secure. Please protect your account with a strong password and notify us immediately of any suspected breach.
      </Section>

      <Section title="8. Children">
        The Service is not intended for users under the age of 13. We do not knowingly collect data from children. If we become aware that a child has provided personal data, we will delete it promptly.
      </Section>

      <Section title="9. Changes to This Policy">
        We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by a prominent notice on the Service. Your continued use after changes constitutes acceptance of the updated policy.
      </Section>

      <Section title="10. Contact">
        For any privacy-related questions or requests, please contact us at{' '}
        <a href="mailto:privacy@anointedlyrics.com" style={{ color: '#C6A24B' }}>privacy@anointedlyrics.com</a>.
      </Section>
    </LegalLayout>
  );
}
