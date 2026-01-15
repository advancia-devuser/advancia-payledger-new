// ============================================================================
// MAINTENANCE MODE PAGE
// Shown when admin enables maintenance mode
// ============================================================================

'use client';

import { useEffect, useState } from 'react';
import { Wrench, Clock, RefreshCw } from 'lucide-react';

export default function MaintenancePage() {
  const [message, setMessage] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/system/maintenance`);
      const data = await res.json();
      if (data.message) {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Failed to fetch maintenance message');
    }
  };

  const checkAgain = async () => {
    setChecking(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/system/maintenance`);
      const data = await res.json();
      
      if (!data.enabled) {
        // Maintenance is over, reload page
        window.location.reload();
      }
    } catch (error) {
      // Error checking, just reload
      window.location.reload();
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full mb-6 animate-pulse">
            <Wrench className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            We'll Be Right Back!
          </h1>
          <p className="text-xl text-gray-600">
            Currently performing scheduled maintenance
          </p>
        </div>

        {/* Message Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center space-y-6">
            {/* Custom Message or Default */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {message || "We're currently performing scheduled maintenance to improve your experience. We'll be back shortly!"}
              </p>
            </div>

            {/* What's Happening */}
            <div className="text-left space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What's Happening?
              </h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <p className="text-gray-700 font-medium">Temporary Downtime</p>
                    <p className="text-gray-600 text-sm">
                      We're making updates to serve you better
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <p className="text-gray-700 font-medium">Your Data is Safe</p>
                    <p className="text-gray-600 text-sm">
                      All your information and funds are secure
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <p className="text-gray-700 font-medium">Back Soon</p>
                    <p className="text-gray-600 text-sm">
                      We expect to be back online shortly
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Apology */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <p className="text-gray-700 text-center">
                We sincerely apologize for any inconvenience this may cause. 
                We appreciate your patience and understanding! 🙏
              </p>
            </div>

            {/* Check Again Button */}
            <button
              onClick={checkAgain}
              disabled={checking}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {checking ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Check if We're Back
                </>
              )}
            </button>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center text-gray-600">
          <p className="text-sm">
            Urgent issue? Contact us at{' '}
            <a href="mailto:support@advancia.com" className="text-blue-600 hover:text-blue-700 font-medium">
              support@advancia.com
            </a>
          </p>
        </div>

        {/* Auto-refresh notice */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This page will automatically check for updates every 30 seconds</p>
        </div>
      </div>

      {/* Auto-check every 30 seconds */}
      <script dangerouslySetInnerHTML={{
        __html: `
          setInterval(function() {
            fetch('${process.env.NEXT_PUBLIC_API_URL}/api/system/maintenance')
              .then(res => res.json())
              .then(data => {
                if (!data.enabled) {
                  window.location.reload();
                }
              })
              .catch(() => {
                window.location.reload();
              });
          }, 30000);
        `
      }} />
    </div>
  );
}
