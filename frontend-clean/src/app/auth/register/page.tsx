"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    country: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [agreements, setAgreements] = useState({
    termsAccepted: false,
    privacyAccepted: false,
    kycConsent: false,
    ageConfirmed: false,
  });

  const [step, setStep] = useState(1); // Multi-step registration
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreements({
      ...agreements,
      [e.target.name]: e.target.checked,
    });
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      setError("Please fill in all required fields");
      return false;
    }

    // Validate age (18+)
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setError("You must be 18 years or older to register");
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    if (!formData.country || !formData.address || !formData.city || !formData.postalCode) {
      setError("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (!agreements.termsAccepted || !agreements.privacyAccepted || 
        !agreements.kycConsent || !agreements.ageConfirmed) {
      setError("Please accept all required agreements");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setError("");
    
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateStep4()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...agreements,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to pending approval page
        window.location.href = "/auth/pending-approval";
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-white/20"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-gray-300">Join Advancia Pay - Secure Virtual Card Platform</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  s <= step
                    ? "bg-purple-600 text-white"
                    : "bg-gray-600 text-gray-400"
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    s < step ? "bg-purple-600" : "bg-gray-600"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Account Credentials */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Account Credentials</h2>
              
              <div>
                <label className="block text-gray-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Min. 8 characters"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Date of Birth * (Must be 18+)</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </motion.div>
          )}

          {/* Step 3: Address Information */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Address Information</h2>
              
              <div>
                <label className="block text-gray-300 mb-2">Country *</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="ES">Spain</option>
                  <option value="IT">Italy</option>
                  <option value="NL">Netherlands</option>
                  <option value="SE">Sweden</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Street Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  placeholder="123 Main Street"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Terms & Agreements */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Terms & Agreements</h2>
              
              <div className="space-y-4 bg-white/5 p-6 rounded-lg border border-white/10">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={agreements.termsAccepted}
                    onChange={handleAgreementChange}
                    className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    required
                  />
                  <span className="text-gray-300 text-sm">
                    I accept the <Link href="/terms" className="text-purple-400 hover:underline">Terms and Conditions</Link> *
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="privacyAccepted"
                    checked={agreements.privacyAccepted}
                    onChange={handleAgreementChange}
                    className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    required
                  />
                  <span className="text-gray-300 text-sm">
                    I accept the <Link href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</Link> and consent to data processing (GDPR) *
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="kycConsent"
                    checked={agreements.kycConsent}
                    onChange={handleAgreementChange}
                    className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    required
                  />
                  <span className="text-gray-300 text-sm">
                    I consent to KYC/AML verification and understand my account will be reviewed for compliance *
                  </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="ageConfirmed"
                    checked={agreements.ageConfirmed}
                    onChange={handleAgreementChange}
                    className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    required
                  />
                  <span className="text-gray-300 text-sm">
                    I confirm that I am 18 years of age or older *
                  </span>
                </label>
              </div>

              <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">ℹ️</span>
                  <div className="text-sm text-blue-200">
                    <p className="font-semibold mb-1">Compliance & Bank Acceptance</p>
                    <p>Your account will undergo KYC verification to ensure compliance with banking regulations and prevent fraud. This helps us provide you with secure, bank-accepted virtual cards.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
              >
                Previous
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            )}
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-purple-400 hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
