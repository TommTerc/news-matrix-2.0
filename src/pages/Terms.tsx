import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 text-matrix-green pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-matrix-green hover:text-matrix-light mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>

        <div className="prose prose-invert prose-green max-w-none">
          <h1 className="text-3xl font-bold mb-8 text-matrix-light">Terms of Service</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p>
                By using our web application (the "Service"), you confirm that you are at least 13 years old 
                and agree to comply with these Terms. If you are under 18, you must have the consent of a 
                parent or legal guardian to use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Free Speech Policy</h2>
              <p>
                We believe in the absolute freedom of speech. However, to ensure a safe and respectful 
                environment, the following content is strictly prohibited:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  <strong>Pedophilia:</strong> Any content that exploits or harms children is strictly forbidden.
                </li>
                <li>
                  <strong>Incitement of Violence:</strong> Content that promotes or glorifies violence, 
                  including threats or calls to harm others, is not allowed.
                </li>
              </ul>
              <p className="mt-4">
                We reserve the right to remove any content that violates these rules and to suspend or 
                terminate accounts of repeat offenders.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Use the Service only for lawful purposes.</li>
                <li>Not engage in harassment, hate speech, or any behavior that violates the rights of others.</li>
                <li>Not upload or share content that violates our Free Speech Policy.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Data Collection</h2>
              <p>
                We collect and use your data to provide and improve the Service. By using the Service, 
                you consent to the collection and use of your information as outlined below:
              </p>
              <h3 className="text-xl font-bold mt-4 mb-2">Types of Data Collected:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Personal Information:</strong> Name, email address, and other information you 
                  provide during registration.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you use the Service, such as pages 
                  visited and interactions.
                </li>
                <li>
                  <strong>Cookies and Tracking Technologies:</strong> We use cookies to enhance your 
                  experience and analyze Service usage.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <p>
                All content on the Service, including text, graphics, logos, and software, is the property 
                of Matrix News LLC or its licensors and is protected by intellectual property laws. You may 
                not reproduce, distribute, or create derivative works without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Third-Party Links</h2>
              <p>
                The Service may contain links to third-party websites or services. We are not responsible 
                for the content or practices of these third parties. Use them at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to the Service at any time, with 
                or without notice, for violations of these Terms or for any other reason.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. We will notify you of any changes by posting 
                the new Terms on this page. Your continued use of the Service after the changes constitutes 
                acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Email: support@matrixnews.com</li>
                <li>Address: 123 Matrix Street, Digital City, DC 12345</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Acknowledgment</h2>
              <p>
                By using the Service, you acknowledge that you have read, understood, and agree to these 
                Terms of Service.
              </p>
            </section>
          </div>

          <div className="mt-12 text-sm text-matrix-green/60">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}