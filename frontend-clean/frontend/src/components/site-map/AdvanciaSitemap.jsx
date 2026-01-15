"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Home,
  User,
  Shield,
  Briefcase,
  Activity,
  FileText,
} from "lucide-react";

const SiteNode = ({ node, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;

  const icons = {
    home: Home,
    user: User,
    admin: Shield,
    medical: Activity,
    wallet: Briefcase,
    doc: FileText,
  };

  const Icon = icons[node.icon] || FileText;

  return (
    <div className="mb-1">
      <div
        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-blue-50 transition-colors ${
          level === 0 ? "bg-blue-100 font-semibold" : ""
        }`}
        style={{ marginLeft: `${level * 20}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren &&
          (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
        {!hasChildren && <div className="w-4" />}
        <Icon size={16} className="text-blue-600" />
        <span className="flex-1">{node.name}</span>
        {node.auth && (
          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
            {node.auth}
          </span>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="ml-2">
          {node.children.map((child, idx) => (
            <SiteNode key={idx} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function AdvanciaPayLedgerSitemap() {
  const siteStructure = [
    {
      name: "Public Pages",
      icon: "home",
      children: [
        { name: "Home / Landing Page", icon: "home" },
        { name: "Features", icon: "doc" },
        { name: "Pricing", icon: "doc" },
        { name: "About Us", icon: "doc" },
        { name: "How It Works", icon: "doc" },
        { name: "Blog", icon: "doc" },
        { name: "FAQ", icon: "doc" },
        { name: "Contact Us", icon: "doc" },
        {
          name: "Status Page",
          children: [
            { name: "System Uptime" },
            { name: "Network Status (All 6 Networks)" },
            { name: "Scheduled Maintenance" },
            { name: "Incident History" },
          ],
        },
        {
          name: "Legal",
          children: [
            { name: "Terms of Service" },
            { name: "Privacy Policy" },
            { name: "Cookie Policy" },
            { name: "AML/KYC Policy" },
          ],
        },
      ],
    },
    {
      name: "Authentication",
      icon: "user",
      children: [
        { name: "Sign Up", icon: "user" },
        { name: "Sign In", icon: "user" },
        { name: "Forgot Password", icon: "user" },
        { name: "Reset Password", icon: "user" },
        { name: "Email Verification", icon: "user" },
        { name: "2FA Setup", icon: "user" },
        {
          name: "Onboarding Flow",
          children: [
            { name: "Welcome Wizard" },
            { name: "Platform Tour" },
            { name: "Quick Start Guide" },
            { name: "Demo Mode / Sandbox" },
            { name: "Choose Your Role" },
          ],
        },
      ],
    },
    {
      name: "User Dashboard",
      icon: "user",
      auth: "USER",
      children: [
        { name: "Dashboard Home", icon: "home" },
        {
          name: "Notifications Center",
          children: [
            { name: "All Notifications" },
            { name: "Transaction Alerts" },
            { name: "KYC Updates" },
            { name: "System Announcements" },
            { name: "Notification Settings" },
          ],
        },
        {
          name: "Wallet",
          icon: "wallet",
          children: [
            { name: "Overview / Balance" },
            { name: "Deposit Crypto" },
            { name: "Withdraw Crypto" },
            { name: "Buy Crypto (Stripe)" },
            { name: "Transaction History" },
            {
              name: "Real-time Blockchain Monitor",
              children: [
                { name: "Live Transaction Tracker" },
                { name: "Network Status (All 6 Networks)" },
                { name: "Gas Price Monitor" },
                { name: "Failed Transaction Alerts" },
                { name: "Pending Transactions" },
              ],
            },
            {
              name: "Supported Networks",
              children: [
                { name: "Ethereum (ETH)" },
                { name: "Polygon (MATIC)" },
                { name: "Binance Smart Chain (BSC)" },
                { name: "Arbitrum" },
                { name: "Optimism" },
                { name: "Stellar (XLM)" },
              ],
            },
          ],
        },
        {
          name: "Payments & Invoicing",
          children: [
            { name: "Create Payment Link" },
            { name: "Generate QR Code" },
            { name: "Invoice Management" },
            { name: "Create New Invoice" },
            { name: "Recurring Payments" },
            { name: "Payment Requests" },
            { name: "Received Payments" },
          ],
        },
        {
          name: "AI Assistant Hub",
          children: [
            { name: "Chat with AI Support" },
            { name: "Transaction Insights" },
            { name: "AI-Powered Analytics" },
            { name: "Smart Recommendations" },
            { name: "AI Agent Dashboard" },
          ],
        },
        {
          name: "KYC Verification",
          children: [
            { name: "Upload Documents" },
            { name: "Verification Status" },
            { name: "Resubmit Documents" },
          ],
        },
        {
          name: "Medical Services",
          icon: "medical",
          children: [
            { name: "Book Appointment" },
            { name: "My Appointments" },
            { name: "Medical Records" },
            { name: "Find Facilities" },
            { name: "Bed Availability" },
            {
              name: "Telemedicine",
              children: [
                { name: "Virtual Consultations" },
                { name: "Video Appointments" },
                { name: "Prescription Management" },
                { name: "Insurance Information" },
                { name: "Medical Documents" },
              ],
            },
          ],
        },
        {
          name: "Security Center",
          children: [
            { name: "Activity Log" },
            { name: "Login History" },
            { name: "Connected Devices" },
            { name: "Security Alerts" },
            { name: "Whitelist Addresses" },
            { name: "2FA Management" },
            { name: "Backup & Recovery" },
          ],
        },
        {
          name: "Reports & Exports",
          children: [
            { name: "Tax Reports" },
            { name: "Transaction Export (CSV/PDF)" },
            { name: "Account Statements" },
            { name: "Annual Summary" },
            { name: "Custom Reports" },
          ],
        },
        {
          name: "Referral Program",
          children: [
            { name: "Referral Dashboard" },
            { name: "My Referral Link" },
            { name: "Track Earnings" },
            { name: "Referral History" },
            { name: "Rewards & Bonuses" },
          ],
        },
        {
          name: "Disputes & Support",
          children: [
            { name: "Transaction Disputes" },
            { name: "File a Dispute" },
            { name: "Refund Requests" },
            { name: "Dispute History" },
          ],
        },
        {
          name: "Profile Settings",
          children: [
            { name: "Personal Information" },
            { name: "Security Settings" },
            { name: "Notification Preferences" },
            { name: "Connected Wallets" },
            { name: "Currency Preferences (USD/EUR/GBP/JPY/CAD/AUD)" },
          ],
        },
        {
          name: "Support",
          children: [
            { name: "Help Center" },
            { name: "Submit Ticket" },
            { name: "My Tickets" },
            { name: "Live Chat" },
          ],
        },
      ],
    },
    {
      name: "Admin Dashboard",
      icon: "admin",
      auth: "ADMIN",
      children: [
        { name: "Admin Home", icon: "home" },
        {
          name: "Real-time System Monitor",
          children: [
            { name: "Live Transaction Dashboard" },
            { name: "Blockchain Network Status" },
            { name: "Gas Tracker (All Networks)" },
            { name: "System Health Monitor" },
            { name: "Alert Dashboard" },
            { name: "Failed Transaction Tracker" },
          ],
        },
        {
          name: "User Management",
          children: [
            { name: "All Users" },
            { name: "User Details" },
            { name: "KYC Approvals" },
            { name: "Suspended Users" },
            { name: "User Activity Logs" },
            { name: "User Security Alerts" },
          ],
        },
        {
          name: "Transaction Monitoring",
          icon: "wallet",
          children: [
            { name: "All Transactions" },
            { name: "Pending Withdrawals" },
            { name: "Deposit Tracking" },
            { name: "Blockchain Monitor" },
            { name: "Failed Transactions" },
            { name: "Conversion History" },
            { name: "Suspicious Activity" },
            { name: "Large Transaction Alerts" },
          ],
        },
        {
          name: "Dispute Management",
          children: [
            { name: "All Disputes" },
            { name: "Pending Disputes" },
            { name: "Resolved Disputes" },
            { name: "Refund Processing" },
            { name: "Escalated Cases" },
          ],
        },
        {
          name: "AI Analytics & Insights",
          children: [
            { name: "AI Dashboard" },
            { name: "Fraud Detection AI" },
            { name: "Transaction Pattern Analysis" },
            { name: "AI Agent Performance" },
            { name: "Predictive Analytics" },
          ],
        },
        {
          name: "Platform Analytics",
          children: [
            { name: "Dashboard Overview" },
            { name: "Revenue Reports" },
            { name: "User Statistics" },
            { name: "Transaction Volume" },
            { name: "Network Usage" },
            { name: "Conversion Rates" },
            { name: "Growth Metrics" },
          ],
        },
        {
          name: "Payment & Invoice Management",
          children: [
            { name: "All Invoices" },
            { name: "Payment Links" },
            { name: "Recurring Payments" },
            { name: "Failed Payments" },
          ],
        },
        {
          name: "Reports & Exports",
          children: [
            { name: "Financial Reports" },
            { name: "Compliance Reports" },
            { name: "User Activity Reports" },
            { name: "Export Data (CSV/PDF)" },
            { name: "Custom Report Builder" },
          ],
        },
        {
          name: "Settings",
          children: [
            { name: "Platform Settings" },
            { name: "Fee Configuration" },
            { name: "Network Settings" },
            { name: "Email Templates" },
            { name: "API Keys Management" },
            { name: "Notification Settings" },
          ],
        },
      ],
    },
    {
      name: "Super Admin Dashboard",
      icon: "admin",
      auth: "SUPER_ADMIN",
      children: [
        { name: "Super Admin Home", icon: "home" },
        {
          name: "System Management",
          children: [
            { name: "Admin Users" },
            { name: "Role Management" },
            { name: "Permissions" },
            { name: "Audit Logs" },
            { name: "System Health" },
            { name: "Server Monitoring" },
            { name: "Database Status" },
          ],
        },
        {
          name: "Facility Management",
          icon: "medical",
          children: [
            { name: "All Facilities" },
            { name: "Add New Facility" },
            { name: "Facility Settings" },
            { name: "Staff Assignments" },
            { name: "Facility Performance" },
          ],
        },
        {
          name: "Financial Controls",
          children: [
            { name: "Stripe Configuration" },
            { name: "Wallet Management" },
            { name: "Reserve Funds" },
            { name: "Withdrawal Limits" },
            { name: "Fee Structure" },
            { name: "Revenue Management" },
          ],
        },
        {
          name: "AI Management",
          children: [
            { name: "AI Agent Configuration" },
            { name: "AI Model Settings" },
            { name: "AI Performance Metrics" },
            { name: "AI Training Data" },
            { name: "Anthropic/Ollama Settings" },
          ],
        },
        {
          name: "Referral Program Management",
          children: [
            { name: "Program Settings" },
            { name: "Commission Structure" },
            { name: "All Referrals" },
            { name: "Payout Management" },
            { name: "Referral Analytics" },
          ],
        },
        {
          name: "Platform Configuration",
          children: [
            { name: "Feature Flags" },
            { name: "Maintenance Mode" },
            { name: "Blockchain RPC URLs" },
            { name: "Currency Rates" },
            { name: "API Rate Limits" },
            { name: "Security Settings" },
          ],
        },
        {
          name: "Compliance & Legal",
          children: [
            { name: "KYC Settings" },
            { name: "AML Configuration" },
            { name: "Legal Document Management" },
            { name: "Compliance Reports" },
            { name: "Regulatory Updates" },
          ],
        },
      ],
    },
    {
      name: "Medical Staff Dashboard",
      icon: "medical",
      auth: "MEDICAL_STAFF",
      children: [
        { name: "Staff Home", icon: "home" },
        {
          name: "Patient Management",
          children: [
            { name: "Patient List" },
            { name: "Patient Records" },
            { name: "Appointment Schedule" },
            { name: "Check-In Patients" },
            { name: "Patient History" },
          ],
        },
        {
          name: "Telemedicine",
          children: [
            { name: "Virtual Consultation Queue" },
            { name: "Start Video Call" },
            { name: "Prescriptions" },
            { name: "Medical Notes" },
            { name: "Follow-up Scheduling" },
          ],
        },
        {
          name: "Bed Management",
          children: [
            { name: "Bed Availability" },
            { name: "Assign Beds" },
            { name: "Discharge Patients" },
            {
              name: "Bed Types (ICU/General/Private/Emergency/Pediatric/Maternity)",
            },
            { name: "Bed Cleaning Status" },
          ],
        },
        {
          name: "Schedule",
          children: [
            { name: "My Schedule" },
            { name: "Shift Management" },
            { name: "Time Off Requests" },
            { name: "Overtime Tracking" },
          ],
        },
        {
          name: "Reports",
          children: [
            { name: "Daily Reports" },
            { name: "Patient Statistics" },
            { name: "My Performance" },
          ],
        },
      ],
    },
    {
      name: "Facility Admin Dashboard",
      icon: "medical",
      auth: "FACILITY_ADMIN",
      children: [
        { name: "Facility Home", icon: "home" },
        {
          name: "Facility Overview",
          children: [
            { name: "Facility Details" },
            { name: "Capacity Management" },
            { name: "Occupancy Reports" },
            { name: "Real-time Dashboard" },
          ],
        },
        {
          name: "Staff Management",
          children: [
            { name: "Staff Directory" },
            { name: "Add Staff" },
            { name: "Staff Schedules" },
            { name: "Performance Reviews" },
            { name: "Payroll Management" },
          ],
        },
        {
          name: "Appointment Management",
          children: [
            { name: "All Appointments" },
            { name: "Schedule Configuration" },
            { name: "Cancellations/Rescheduling" },
            { name: "Waitlist Management" },
          ],
        },
        {
          name: "Telemedicine Management",
          children: [
            { name: "Virtual Appointments" },
            { name: "Telemedicine Analytics" },
            { name: "Video Quality Monitoring" },
            { name: "Prescription Tracking" },
          ],
        },
        {
          name: "Bed & Room Management",
          children: [
            { name: "Bed Inventory" },
            { name: "Room Assignments" },
            { name: "Maintenance Requests" },
            { name: "Equipment Tracking" },
            { name: "Bed Utilization" },
          ],
        },
        {
          name: "Billing & Payments",
          children: [
            { name: "Patient Billing" },
            { name: "Insurance Claims" },
            { name: "Payment Collection" },
            { name: "Outstanding Invoices" },
          ],
        },
        {
          name: "Facility Analytics",
          children: [
            { name: "Patient Statistics" },
            { name: "Revenue Reports" },
            { name: "Operational Metrics" },
            { name: "Staff Productivity" },
            { name: "Department Performance" },
            { name: "Quality Metrics" },
          ],
        },
      ],
    },
    {
      name: "Developer Portal",
      icon: "doc",
      children: [
        {
          name: "API Documentation",
          children: [
            { name: "API Overview" },
            { name: "Getting Started" },
            { name: "Authentication" },
            { name: "Rate Limits" },
            { name: "Error Handling" },
          ],
        },
        {
          name: "API Playground",
          children: [
            { name: "Try API Endpoints" },
            { name: "Request Builder" },
            { name: "Response Inspector" },
            { name: "Code Generator" },
          ],
        },
        {
          name: "API Reference",
          children: [
            { name: "User API" },
            { name: "Wallet API" },
            { name: "Transaction API" },
            { name: "Medical API" },
            { name: "Admin API" },
            { name: "AI Agent API" },
            { name: "Webhook API" },
          ],
        },
        {
          name: "Webhooks",
          children: [
            { name: "Webhook Setup" },
            { name: "Webhook Tester" },
            { name: "Event Types" },
            { name: "Webhook Logs" },
            { name: "Retry Configuration" },
          ],
        },
        {
          name: "SDKs & Libraries",
          children: [
            { name: "JavaScript/TypeScript SDK" },
            { name: "Python SDK" },
            { name: "PHP SDK" },
            { name: "Ruby SDK" },
            { name: "Code Examples" },
          ],
        },
        {
          name: "Integration Guides",
          children: [
            { name: "Quick Start" },
            { name: "E-commerce Integration" },
            { name: "Healthcare Integration" },
            { name: "Mobile Apps" },
            { name: "Best Practices" },
          ],
        },
        {
          name: "Testing & Sandbox",
          children: [
            { name: "Test Environment" },
            { name: "Test Data" },
            { name: "Mock Transactions" },
            { name: "Network Simulation" },
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Advancia Pay Ledger - Website Structure
          </h1>
          <p className="text-gray-600 mb-4">
            Comprehensive sitemap for cryptocurrency payment platform &
            healthcare management system
          </p>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-100"></div>
              <span className="text-gray-600">Auth Required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-100"></div>
              <span className="text-gray-600">Section Header</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              5 User Roles Supported
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                USER
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                ADMIN
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                SUPER_ADMIN
              </span>
              <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                MEDICAL_STAFF
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                FACILITY_ADMIN
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            {siteStructure.map((section, idx) => (
              <SiteNode key={idx} node={section} />
            ))}
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Key Features Covered
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <div>
                <span className="font-medium">6 Blockchain Networks:</span> ETH,
                Polygon, BSC, Arbitrum, Optimism, Stellar
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <div>
                <span className="font-medium">Payment Methods:</span> Crypto
                deposits/withdrawals + Stripe integration
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <div>
                <span className="font-medium">Real-time Monitoring:</span> Live
                blockchain tracking, gas prices, transaction alerts
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <div>
                <span className="font-medium">AI Integration:</span> 25+ AI
                agents with Claude & Ollama for support & analytics
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <div>
                <span className="font-medium">Payment Tools:</span> Invoice
                generation, payment links, QR codes, recurring payments
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <div>
                <span className="font-medium">KYC & Security:</span> Document
                verification, 2FA, whitelist addresses, activity logs
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <div>
                <span className="font-medium">Telemedicine:</span> Virtual
                consultations, video appointments, prescriptions
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <div>
                <span className="font-medium">Medical Management:</span> 6 bed
                types, appointments, facility admin, staff scheduling
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <div>
                <span className="font-medium">Multi-Currency:</span> USD, EUR,
                GBP, JPY, CAD, AUD with auto-conversion
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <div>
                <span className="font-medium">Admin Controls:</span>{" "}
                Comprehensive monitoring, dispute management, audit logs
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <div>
                <span className="font-medium">Referral Program:</span> Earnings
                tracking, custom links, rewards management
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
              <div>
                <span className="font-medium">Developer Portal:</span> API
                playground, webhooks, SDKs, sandbox environment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
