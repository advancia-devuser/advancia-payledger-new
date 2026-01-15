import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronRight, Search } from 'lucide-react';

const CustomerJourneyAudit = () => {
  const [expandedStages, setExpandedStages] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');

  const toggleStage = (id) => {
    setExpandedStages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSection = (id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Complete customer journey with implementation status
  const journeyStages = [
    {
      id: 'discovery',
      name: '1. Discovery & Awareness',
      status: 'complete',
      sections: [
        {
          name: 'Landing Page',
          status: 'complete',
          features: [
            { name: 'Homepage with value proposition', status: 'complete', path: '/' },
            { name: 'Blue gradient theme UI', status: 'complete', path: '/' },
            { name: 'Notification bell', status: 'complete', path: '/notifications' },
            { name: '3D virtual card display', status: 'complete', path: '/' },
            { name: 'Trust indicators (stats)', status: 'complete', path: '/' },
            { name: 'Feature cards', status: 'complete', path: '/' }
          ]
        },
        {
          name: 'Marketing Pages',
          status: 'complete',
          features: [
            { name: 'Features page', status: 'complete', path: '/features' },
            { name: 'Pricing page', status: 'complete', path: '/pricing' },
            { name: 'About page', status: 'complete', path: '/about' },
            { name: 'Contact page', status: 'complete', path: '/contact' }
          ]
        },
        {
          name: 'SEO & Discovery',
          status: 'partial',
          features: [
            { name: 'Meta tags', status: 'complete', path: 'next.config.js' },
            { name: 'Sitemap', status: 'missing', path: '/sitemap.xml' },
            { name: 'robots.txt', status: 'missing', path: '/robots.txt' },
            { name: 'Schema markup', status: 'missing', path: 'components' }
          ]
        }
      ]
    },
    {
      id: 'registration',
      name: '2. Registration & Onboarding',
      status: 'critical',
      sections: [
        {
          name: 'Account Creation',
          status: 'critical',
          features: [
            { name: 'Role selection (Patient/Provider/Admin)', status: 'missing', path: '/auth/register' },
            { name: 'Email signup form', status: 'partial', path: '/auth/register' },
            { name: 'Password requirements', status: 'partial', path: '/auth/register' },
            { name: 'Terms & conditions checkbox', status: 'missing', path: '/auth/register' },
            { name: 'Email verification flow', status: 'backend-only', path: '/api/auth/verify' }
          ]
        },
        {
          name: 'KYC Verification',
          status: 'critical',
          features: [
            { name: 'Stripe Identity integration', status: 'backend-only', path: '/api/kyc' },
            { name: 'Document upload UI', status: 'missing', path: '/kyc/verify' },
            { name: 'Verification status tracking', status: 'partial', path: '/dashboard/kyc' },
            { name: 'Manual review workflow (admin)', status: 'backend-only', path: '/admin/kyc' }
          ]
        },
        {
          name: 'Profile Setup',
          status: 'partial',
          features: [
            { name: 'Personal information form', status: 'missing', path: '/onboarding/profile' },
            { name: 'Avatar upload', status: 'missing', path: '/profile/settings' },
            { name: 'Preferences configuration', status: 'missing', path: '/onboarding/preferences' },
            { name: 'Onboarding wizard', status: 'missing', path: '/onboarding' }
          ]
        }
      ]
    },
    {
      id: 'wallet',
      name: '3. Wallet Setup & Funding',
      status: 'critical',
      sections: [
        {
          name: 'Wallet Creation',
          status: 'backend-only',
          features: [
            { name: 'Auto wallet generation on signup', status: 'backend-only', path: '/api/wallet/create' },
            { name: 'Multi-chain support (6 networks)', status: 'backend-only', path: 'services/blockchain' },
            { name: 'Wallet address display UI', status: 'missing', path: '/wallet' },
            { name: 'QR code generation', status: 'missing', path: '/wallet/receive' },
            { name: 'Copy address functionality', status: 'missing', path: '/wallet' }
          ]
        },
        {
          name: 'Funding Methods',
          status: 'partial',
          features: [
            { name: 'Crypto deposit instructions', status: 'missing', path: '/wallet/deposit' },
            { name: 'Bank transfer (Stripe)', status: 'backend-only', path: '/api/payments/stripe' },
            { name: 'Credit/debit card', status: 'backend-only', path: '/api/payments/stripe' },
            { name: 'Deposit monitoring', status: 'backend-only', path: 'services/deposit-monitor' },
            { name: 'Deposit confirmation UI', status: 'missing', path: '/wallet/deposits' }
          ]
        },
        {
          name: 'Balance Display',
          status: 'missing',
          features: [
            { name: 'USD balance', status: 'missing', path: '/dashboard' },
            { name: 'Crypto balances (per chain)', status: 'missing', path: '/wallet' },
            { name: 'Portfolio value chart', status: 'missing', path: '/wallet/portfolio' },
            { name: 'Real-time price conversion', status: 'backend-only', path: 'services/price' }
          ]
        }
      ]
    },
    {
      id: 'transaction',
      name: '4. Making Transactions',
      status: 'critical',
      sections: [
        {
          name: 'Payment Processing',
          status: 'partial',
          features: [
            { name: 'Send crypto form', status: 'missing', path: '/wallet/send' },
            { name: 'Recipient address validation', status: 'backend-only', path: '/api/wallet/validate' },
            { name: 'Amount input with conversion', status: 'missing', path: '/wallet/send' },
            { name: 'Gas fee estimation', status: 'backend-only', path: 'services/blockchain' },
            { name: 'Transaction confirmation modal', status: 'missing', path: '/wallet/send' },
            { name: 'Transaction signing', status: 'backend-only', path: '/api/wallet/send' }
          ]
        },
        {
          name: 'Healthcare Payments',
          status: 'missing',
          features: [
            { name: 'Appointment payment flow', status: 'missing', path: '/appointments/pay' },
            { name: 'Facility fee payment', status: 'missing', path: '/facilities/pay' },
            { name: 'Insurance integration', status: 'missing', path: '/payments/insurance' },
            { name: 'Payment split (insurance + patient)', status: 'missing', path: '/payments' },
            { name: 'Medical bill upload', status: 'missing', path: '/bills' }
          ]
        },
        {
          name: 'Transaction Tracking',
          status: 'partial',
          features: [
            { name: 'Transaction history list', status: 'missing', path: '/transactions' },
            { name: 'Transaction details modal', status: 'missing', path: '/transactions/:id' },
            { name: 'Block explorer links', status: 'missing', path: '/transactions/:id' },
            { name: 'Status updates (pending/confirmed)', status: 'backend-only', path: '/api/transactions' },
            { name: 'Export transactions (CSV)', status: 'missing', path: '/transactions/export' }
          ]
        }
      ]
    },
    {
      id: 'healthcare',
      name: '5. Healthcare Features',
      status: 'critical',
      sections: [
        {
          name: 'Facility Management',
          status: 'partial',
          features: [
            { name: 'Facility listing', status: 'missing', path: '/facilities' },
            { name: 'Facility details page', status: 'missing', path: '/facilities/:id' },
            { name: 'Bed availability (6 types)', status: 'backend-only', path: '/api/facilities/beds' },
            { name: 'Real-time bed status', status: 'missing', path: '/facilities/:id/beds' },
            { name: 'Facility search & filter', status: 'missing', path: '/facilities' }
          ]
        },
        {
          name: 'Appointments',
          status: 'partial',
          features: [
            { name: 'Appointment booking form', status: 'missing', path: '/appointments/book' },
            { name: 'Calendar view', status: 'missing', path: '/appointments' },
            { name: 'Appointment reminders', status: 'backend-only', path: '/api/appointments/reminders' },
            { name: 'Reschedule/cancel', status: 'missing', path: '/appointments/:id' },
            { name: 'Doctor selection', status: 'missing', path: '/appointments/book' }
          ]
        },
        {
          name: 'Medical Records',
          status: 'missing',
          features: [
            { name: 'Upload medical documents', status: 'missing', path: '/records/upload' },
            { name: 'View records (HIPAA compliant)', status: 'missing', path: '/records' },
            { name: 'Share with providers', status: 'missing', path: '/records/share' },
            { name: 'Record encryption', status: 'backend-only', path: 'services/encryption' }
          ]
        }
      ]
    },
    {
      id: 'admin',
      name: '6. Admin & Management',
      status: 'partial',
      sections: [
        {
          name: 'User Management',
          status: 'partial',
          features: [
            { name: 'User list with filters', status: 'missing', path: '/admin/users' },
            { name: 'User details view', status: 'missing', path: '/admin/users/:id' },
            { name: 'Role assignment', status: 'backend-only', path: '/api/admin/users' },
            { name: 'Account suspension', status: 'backend-only', path: '/api/admin/users/suspend' },
            { name: 'Activity logs', status: 'backend-only', path: '/api/admin/logs' }
          ]
        },
        {
          name: 'Transaction Oversight',
          status: 'partial',
          features: [
            { name: 'All transactions dashboard', status: 'missing', path: '/admin/transactions' },
            { name: 'Withdrawal approval queue', status: 'missing', path: '/admin/withdrawals' },
            { name: 'Fraud detection alerts', status: 'backend-only', path: '/api/admin/fraud' },
            { name: 'Manual transaction override', status: 'missing', path: '/admin/transactions/:id' }
          ]
        },
        {
          name: 'Analytics & Reporting',
          status: 'missing',
          features: [
            { name: 'Revenue dashboard', status: 'missing', path: '/admin/analytics' },
            { name: 'User growth charts', status: 'missing', path: '/admin/analytics/users' },
            { name: 'Transaction volume', status: 'missing', path: '/admin/analytics/transactions' },
            { name: 'Export reports', status: 'missing', path: '/admin/reports' }
          ]
        }
      ]
    },
    {
      id: 'support',
      name: '7. Support & Retention',
      status: 'critical',
      sections: [
        {
          name: 'Help & Documentation',
          status: 'missing',
          features: [
            { name: 'Help center', status: 'missing', path: '/help' },
            { name: 'FAQ page', status: 'missing', path: '/faq' },
            { name: 'Video tutorials', status: 'missing', path: '/tutorials' },
            { name: 'API documentation', status: 'complete', path: '/docs/api' }
          ]
        },
        {
          name: 'Customer Support',
          status: 'missing',
          features: [
            { name: 'Live chat widget', status: 'missing', path: 'all pages' },
            { name: 'Support ticket system', status: 'missing', path: '/support' },
            { name: 'Email support', status: 'missing', path: 'backend' },
            { name: 'Ticket status tracking', status: 'missing', path: '/support/tickets' }
          ]
        },
        {
          name: 'Notifications',
          status: 'partial',
          features: [
            { name: 'Email notifications', status: 'backend-only', path: 'services/email' },
            { name: 'Push notifications', status: 'missing', path: 'all pages' },
            { name: 'SMS alerts', status: 'missing', path: 'services/sms' },
            { name: 'Notification preferences', status: 'missing', path: '/settings/notifications' }
          ]
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'text-green-600 bg-green-50';
      case 'partial': return 'text-yellow-600 bg-yellow-50';
      case 'backend-only': return 'text-blue-600 bg-blue-50';
      case 'missing': return 'text-red-600 bg-red-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'partial': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'backend-only': return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'missing': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'critical': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  const calculateStats = () => {
    let total = 0;
    let complete = 0;
    let partial = 0;
    let backendOnly = 0;
    let missing = 0;

    journeyStages.forEach(stage => {
      stage.sections.forEach(section => {
        section.features.forEach(feature => {
          total++;
          if (feature.status === 'complete') complete++;
          else if (feature.status === 'partial') partial++;
          else if (feature.status === 'backend-only') backendOnly++;
          else if (feature.status === 'missing') missing++;
        });
      });
    });

    return { total, complete, partial, backendOnly, missing };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Customer Journey Audit
              </h1>
              <p className="text-lg text-slate-600">
                Advancia Pay Ledger - Complete Coverage Analysis
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {Math.round((complete / stats.total) * 100)}%
              </div>
              <div className="text-sm text-slate-600">Complete</div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-600">Total Features</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
              <div className="text-sm text-green-700">Complete</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.partial}</div>
              <div className="text-sm text-yellow-700">Partial</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.backendOnly}</div>
              <div className="text-sm text-blue-700">Backend Only</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{stats.missing}</div>
              <div className="text-sm text-red-700">Missing</div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Complete - Fully implemented & working</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span>Partial - Started but incomplete</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span>Backend Only - API exists, no UI</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span>Missing - Not implemented</span>
            </div>
          </div>
        </div>

        {/* Journey Stages */}
        <div className="space-y-6">
          {journeyStages.map((stage) => (
            <div key={stage.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Stage Header */}
              <button
                onClick={() => toggleStage(stage.id)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(stage.status)}
                  <div className="text-left">
                    <h2 className="text-2xl font-bold text-slate-900">{stage.name}</h2>
                    <div className="flex gap-2 mt-2">
                      {stage.sections.map((section, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(section.status)}`}
                        >
                          {section.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {expandedStages[stage.id] ? (
                  <ChevronDown className="w-6 h-6 text-slate-400" />
                ) : (
                  <ChevronRight className="w-6 h-6 text-slate-400" />
                )}
              </button>

              {/* Stage Content */}
              {expandedStages[stage.id] && (
                <div className="p-6 pt-0 space-y-6">
                  {stage.sections.map((section, sectionIdx) => (
                    <div key={sectionIdx} className="border-l-4 border-slate-200 pl-6">
                      <button
                        onClick={() => toggleSection(`${stage.id}-${sectionIdx}`)}
                        className="w-full flex items-center justify-between mb-4 hover:opacity-75 transition-opacity"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(section.status)}
                          <h3 className="text-xl font-semibold text-slate-900">{section.name}</h3>
                        </div>
                        {expandedSections[`${stage.id}-${sectionIdx}`] ? (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                      </button>

                      {expandedSections[`${stage.id}-${sectionIdx}`] && (
                        <div className="space-y-2 ml-8">
                          {section.features.map((feature, featureIdx) => (
                            <div
                              key={featureIdx}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                {getStatusIcon(feature.status)}
                                <span className="text-slate-700">{feature.name}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <code className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                  {feature.path}
                                </code>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(feature.status)}`}>
                                  {feature.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Critical Actions Needed */}
        <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-red-900 mb-4">🚨 Critical Missing Features</h2>
          <div className="space-y-2">
            <p className="text-red-800">These features are blocking the complete customer journey:</p>
            <ul className="list-disc list-inside space-y-1 text-red-700">
              <li><strong>Registration Flow</strong> - No UI for role selection, profile setup, or onboarding wizard</li>
              <li><strong>Wallet UI</strong> - Backend exists but no frontend for sending/receiving/viewing balances</li>
              <li><strong>Healthcare Features</strong> - Facility browsing, appointments, medical records all missing UI</li>
              <li><strong>Admin Dashboard</strong> - No UI for user management, withdrawals, analytics</li>
              <li><strong>Support System</strong> - No help center, live chat, or ticket system</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerJourneyAudit;