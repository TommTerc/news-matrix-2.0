import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900/90 via-gray-800/95 to-gray-900/90 text-matrix-green pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-matrix-green hover:text-matrix-light mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>

        <div className="prose prose-invert prose-green max-w-none">
          <h1 className="text-3xl font-bold mb-8 text-matrix-light">Privacy Policy</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-bold mt-6 mb-3">1.1 Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account Information:</strong> When you create an account, we collect your name, 
                  email address, username, and password.
                </li>
                <li>
                  <strong>Profile Information:</strong> You may provide additional information, such as a 
                  profile picture, bio, or location.
                </li>
                <li>
                  <strong>Content:</strong> We collect the content you create, share, or post on the 
                  Service, such as comments, articles, or messages.
                </li>
                <li>
                  <strong>Communications:</strong> When you contact us or interact with other users, we 
                  collect the content of those communications.
                </li>
              </ul>

              <h3 className="text-xl font-bold mt-6 mb-3">1.2 Information We Collect Automatically</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Usage Data:</strong> We collect information about how you use the Service, such 
                  as the pages you visit, time spent, and interactions.
                </li>
                <li>
                  <strong>Device Information:</strong> We collect information about your device, including 
                  IP address, browser type, and operating system.
                </li>
                <li>
                  <strong>Cookies and Tracking:</strong> We use cookies and similar technologies to collect 
                  information about your activity and preferences.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To create and maintain your account</li>
                <li>To provide, improve, and personalize our services</li>
                <li>To analyze usage patterns and develop new features</li>
                <li>To communicate with you about updates and news</li>
                <li>To ensure safety and prevent fraud or abuse</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. How We Share Your Information</h2>
              <p>We may share your information in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>With Your Consent:</strong> We will share your information if you give us 
                  explicit permission.
                </li>
                <li>
                  <strong>Service Providers:</strong> We may share information with third-party vendors 
                  who help us operate the Service.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose information if required by law or 
                  to protect our rights.
                </li>
                <li>
                  <strong>Business Transfers:</strong> If we're involved in a merger or acquisition, your 
                  information may be transferred.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Your Rights and Choices</h2>
              <p>You have the following rights regarding your information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and update your account information</li>
                <li>Request deletion of your personal data</li>
                <li>Opt-out of marketing communications</li>
                <li>Manage cookie preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                information. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Children's Privacy</h2>
              <p>
                Our Service is not intended for children under 13. We do not knowingly collect personal 
                information from children under 13. If we become aware that we have collected such 
                information, we will delete it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. 
                These countries may have different data protection laws. By using the Service, you 
                consent to such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Email: privacy@matrixnews.com</li>
                <li>Address: 123 Matrix Street, Digital City, DC 12345</li>
              </ul>
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