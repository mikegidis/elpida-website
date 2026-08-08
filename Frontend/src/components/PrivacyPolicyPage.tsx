import React from 'react';

interface PrivacyPolicyPageProps {
  settings?: any;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ settings }) => {
  const businessName = settings?.site_name || '[BUSINESS LEGAL NAME]';
  const businessEmail = settings?.contact_email || '[BUSINESS CONTACT EMAIL]';
  const businessAddress = settings?.address || '[BUSINESS ADDRESS]';
  const businessPhone = settings?.phone || '[BUSINESS PHONE]';

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#3A1A2E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12">
          <h1 className="font-serif-editorial text-4xl sm:text-5xl text-[#E8D6D2] mb-4 tracking-wider">
            Privacy Policy
          </h1>
          <p className="text-xs text-[#E8D6D2]/60 uppercase tracking-widest">
            Last Updated: [DATE]
          </p>
        </div>

        <div className="space-y-10 text-[#E8D6D2]/80 text-sm leading-relaxed font-light">
          
          <section className="space-y-4">
            <h2 className="font-serif-editorial text-2xl text-[#C9A227]">1. Who Operates This Website</h2>
            <p>
              This website is operated by <strong>{businessName}</strong>. 
              Our registered business address is: <strong>{businessAddress}</strong>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif-editorial text-2xl text-[#C9A227]">2. What Personal Information We Collect</h2>
            <p>
              We collect information that you voluntarily provide to us when you interact with the website, submit inquiries, or place wholesale orders. 
              The types of personal information collected include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#E8D6D2]/70">
              <li><strong>Contact Form Data:</strong> Name, Email Address, Phone Number, and any personal information included in the subject or message of your inquiry.</li>
              <li><strong>Order Data:</strong> Customer Name, Phone Number, Email Address (optional), and any delivery instructions or notes provided during the checkout process.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif-editorial text-2xl text-[#C9A227]">3. How We Use Your Information</h2>
            <p>
              The information we collect is used strictly for the following business purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#E8D6D2]/70">
              <li>To respond to your inquiries and provide customer support.</li>
              <li>To process, fulfill, and manage your wholesale orders and delivery logistics.</li>
              <li>To contact you regarding the status of your order or related business inquiries.</li>
            </ul>
            <p>
              We do not use your information for marketing purposes without your explicit consent, and we do not sell your personal data to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif-editorial text-2xl text-[#C9A227]">4. How Information is Stored and Who Can Access It</h2>
            <p>
              Your data is stored securely in our database. Access to this information is strictly limited to authorized administrative personnel of <strong>{businessName}</strong> who require access to fulfill orders and respond to inquiries. 
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif-editorial text-2xl text-[#C9A227]">5. Data Retention</h2>
            <p>
              We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy, or as required to comply with our legal, tax, and accounting obligations. 
              [BUSINESS TO DEFINE SPECIFIC RETENTION PERIODS HERE].
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif-editorial text-2xl text-[#C9A227]">6. Cookies and Browser Storage</h2>
            <p>
              Our website uses technically necessary browser storage (such as `localStorage`) exclusively to maintain secure sessions for authorized administrative personnel. 
              We do not use tracking cookies, advertising trackers, or marketing cookies on public customer-facing pages.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif-editorial text-2xl text-[#C9A227]">7. Third-Party Services</h2>
            <p>
              We may utilize third-party services to ensure the proper functioning of our website. Specifically, we use external services (such as Google Fonts) to provide the visual design of the application. 
              When your browser requests these resources, your IP address may be visible to the third-party provider.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif-editorial text-2xl text-[#C9A227]">8. Your Privacy Rights</h2>
            <p>
              Depending on your jurisdiction, you may have rights regarding your personal information, including the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#E8D6D2]/70">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request deletion of your personal data, subject to legal and operational retention requirements.</li>
              <li>Object to or request restriction of certain processing activities.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif-editorial text-2xl text-[#C9A227]">9. Security</h2>
            <p>
              We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. 
              However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif-editorial text-2xl text-[#C9A227]">10. Contact Us</h2>
            <p>
              If you have any questions, comments, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="p-6 mt-4 border border-[#C9A227]/30 rounded-xl bg-[#2D1424]">
              <p className="text-[#E8D6D2] font-medium">{businessName}</p>
              <p className="mt-2 flex items-center gap-2">
                <span className="text-[#C9A227]">Email:</span> {businessEmail}
              </p>
              <p className="mt-1 flex items-center gap-2">
                <span className="text-[#C9A227]">Phone:</span> {businessPhone}
              </p>
              <p className="mt-1 flex items-center gap-2">
                <span className="text-[#C9A227]">Address:</span> {businessAddress}
              </p>
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
};
