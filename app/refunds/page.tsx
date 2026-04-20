import { LegalLayout } from '@/lib/components';

export const metadata = { title: 'Refund Policy — AnointedLyrics' };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 500, color: '#1C1B18', marginBottom: 12 }}>{title}</h2>
      <div style={{ color: 'rgba(28,27,24,.78)', lineHeight: 1.8 }}>{children}</div>
    </div>
  );
}

function HighlightBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#F6EDCE', border: '1px solid #C6A24B33', borderRadius: 8, padding: '20px 24px', marginBottom: 32, color: '#1C1B18', lineHeight: 1.7 }}>
      {children}
    </div>
  );
}

export default function RefundsPage() {
  return (
    <LegalLayout title="Refund Policy">
      <HighlightBox>
        <strong>Our commitment:</strong> We want you to be satisfied with AnointedLyrics. If you experience a technical issue that prevents you from using your credits, we will make it right. Please read the full policy below for details.
      </HighlightBox>

      <Section title="1. Credit Purchases">
        All credit purchases are final. Because credits are a digital product that is made immediately available upon purchase, we generally do not offer refunds for unused credits. However, we understand that circumstances vary and we handle each request on a case-by-case basis.
      </Section>

      <Section title="2. When We Will Issue a Refund">
        We will issue a full or partial refund in the following circumstances:
        <ul style={{ paddingLeft: 20, lineHeight: 2, marginTop: 8 }}>
          <li>Credits were deducted but no lyrics were generated due to a technical error on our part</li>
          <li>You were charged twice for the same transaction</li>
          <li>Your account was compromised and credits were used without your authorisation (subject to verification)</li>
          <li>The Service experienced significant downtime or unavailability within 48 hours of your purchase</li>
          <li>You are a new user requesting a refund within 7 days of your first purchase and have used fewer than 5 credits</li>
        </ul>
      </Section>

      <Section title="3. When We Will Not Issue a Refund">
        Refunds will not be issued in the following circumstances:
        <ul style={{ paddingLeft: 20, lineHeight: 2, marginTop: 8 }}>
          <li>You are dissatisfied with the quality or style of generated lyrics (AI output is subjective)</li>
          <li>You purchased credits by mistake after lyrics have been generated</li>
          <li>Your account was suspended for violating our Terms and Conditions</li>
          <li>More than 30 days have passed since the purchase date</li>
          <li>Credits were used and you have successfully received generated lyrics</li>
        </ul>
      </Section>

      <Section title="4. Credit Replacement">
        In cases where a full refund is not applicable, we may offer credit replacement as an alternative remedy. For example, if a generation failed due to a technical issue and your credit was consumed, we will restore the credit to your account.
      </Section>

      <Section title="5. How to Request a Refund">
        To request a refund, please email us at{' '}
        <a href="mailto:support@anointedlyrics.com" style={{ color: '#C6A24B' }}>support@anointedlyrics.com</a>{' '}
        with the following information:
        <ul style={{ paddingLeft: 20, lineHeight: 2, marginTop: 8 }}>
          <li>The email address associated with your account</li>
          <li>The date and amount of the purchase</li>
          <li>A brief description of the issue you experienced</li>
        </ul>
        We aim to respond to all refund requests within 3 business days.
      </Section>

      <Section title="6. Processing Time">
        Approved refunds will be processed within 5–10 business days. Refunds are returned to the original payment method used at checkout. Processing times may vary depending on your card issuer or payment provider.
      </Section>

      <Section title="7. Chargebacks">
        If you initiate a chargeback with your bank or card provider without first contacting us, we reserve the right to suspend your account pending resolution. We encourage you to contact us directly — we are committed to resolving issues fairly and promptly.
      </Section>

      <Section title="8. Changes to This Policy">
        We reserve the right to update this Refund Policy at any time. Changes will be effective immediately upon posting. For purchases made before a policy change, the policy in effect at the time of purchase applies.
      </Section>

      <Section title="9. Contact Us">
        For any questions or to submit a refund request, please reach out to us at{' '}
        <a href="mailto:support@anointedlyrics.com" style={{ color: '#C6A24B' }}>support@anointedlyrics.com</a>.
        We respond to all enquiries within 3 business days.
      </Section>
    </LegalLayout>
  );
}
