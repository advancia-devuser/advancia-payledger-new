"use client";

import React, { useState } from "react";

interface EmailTestResult {
  provider: string;
  status: "success" | "error";
  message?: string;
}

interface EmailStatus {
  postmark: {
    configured: boolean;
    apiKey: boolean;
    serverId?: string;
  };
  resend: {
    configured: boolean;
    apiKey: boolean;
  };
  smtp: {
    configured: boolean;
    host?: string;
    port?: string;
    user?: string;
    isZoho?: boolean;
  };
}

const EmailService: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<EmailTestResult[]>([]);
  const [status, setStatus] = useState<EmailStatus | null>(null);
  const [emailForm, setEmailForm] = useState({
    to: "",
    subject: "",
    html: "",
    provider: "postmark" as "postmark" | "resend" | "smtp",
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const testEmailProviders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/email/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setTestResults(data.results);
      }
    } catch (error) {
      console.error("Error testing email providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEmailStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/email/status`);
      const data = await response.json();
      if (data.success) {
        setStatus(data.status);
      }
    } catch (error) {
      console.error("Error getting email status:", error);
    }
  };

  const sendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailForm.to,
          subject: emailForm.subject,
          html: emailForm.html,
          provider: emailForm.provider,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(
          `Email sent successfully via ${data.provider}! Message ID: ${data.messageId}`
        );
      } else {
        alert(`Failed to send email: ${data.error}`);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getEmailStatus();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Email Service Dashboard</h1>

      {/* Provider Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Provider Status</h2>
        {status ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 rounded ${
                status.postmark.configured
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              } border`}
            >
              <h3 className="font-semibold">Postmark</h3>
              <p className="text-sm">
                Status:{" "}
                {status.postmark.configured
                  ? "✅ Configured"
                  : "❌ Not Configured"}
              </p>
              <p className="text-sm">
                API Key: {status.postmark.apiKey ? "✅ Set" : "❌ Missing"}
              </p>
              <p className="text-sm">
                Server ID: {status.postmark.serverId || "Not Set"}
              </p>
            </div>

            <div
              className={`p-4 rounded ${
                status.resend.configured
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              } border`}
            >
              <h3 className="font-semibold">Resend</h3>
              <p className="text-sm">
                Status:{" "}
                {status.resend.configured
                  ? "✅ Configured"
                  : "❌ Not Configured"}
              </p>
              <p className="text-sm">
                API Key: {status.resend.apiKey ? "✅ Set" : "❌ Missing"}
              </p>
            </div>

            <div
              className={`p-4 rounded ${
                status.smtp.configured
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              } border`}
            >
              <h3 className="font-semibold">
                SMTP ({status.smtp.isZoho ? "Zoho" : "Other"})
              </h3>
              <p className="text-sm">
                Status:{" "}
                {status.smtp.configured ? "✅ Configured" : "❌ Not Configured"}
              </p>
              <p className="text-sm">Host: {status.smtp.host || "Not Set"}</p>
              <p className="text-sm">Port: {status.smtp.port || "Not Set"}</p>
            </div>
          </div>
        ) : (
          <p>Loading status...</p>
        )}
      </div>

      {/* Test Providers */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Test All Providers</h2>
        <button
          onClick={testEmailProviders}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test All Providers"}
        </button>

        {testResults.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded border ${
                  result.status === "success"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <span className="font-semibold">{result.provider}:</span>{" "}
                <span>
                  {result.status === "success" ? "✅ Success" : "❌ Error"}
                </span>
                {result.message && (
                  <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Test Email */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Send Test Email</h2>
        <form onSubmit={sendTestEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">To:</label>
            <input
              type="email"
              value={emailForm.to}
              onChange={(e) =>
                setEmailForm({ ...emailForm, to: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              placeholder="test@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject:</label>
            <input
              type="text"
              value={emailForm.subject}
              onChange={(e) =>
                setEmailForm({ ...emailForm, subject: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Test Email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              HTML Content:
            </label>
            <textarea
              value={emailForm.html}
              onChange={(e) =>
                setEmailForm({ ...emailForm, html: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md h-32"
              placeholder="<h1>Test Email</h1><p>This is a test email.</p>"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Provider:</label>
            <select
              value={emailForm.provider}
              onChange={(e) =>
                setEmailForm({ ...emailForm, provider: e.target.value as any })
              }
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="postmark">Postmark</option>
              <option value="resend">Resend</option>
              <option value="smtp">SMTP</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailService;
