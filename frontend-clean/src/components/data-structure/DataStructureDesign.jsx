"use client";

import React, { useState } from "react";
import {
  Database,
  Users,
  Activity,
  Building2,
  CreditCard,
  Shield,
} from "lucide-react";

const DataStructureDesign = () => {
  const [activeTab, setActiveTab] = useState("users");

  const structures = {
    users: {
      title: "User & Authentication",
      icon: Users,
      color: "bg-blue-500",
      tables: [
        {
          name: "User",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "email", type: "String", unique: true },
            { name: "passwordHash", type: "String" },
            {
              name: "role",
              type: "Enum",
              values: "USER|ADMIN|SUPER_ADMIN|MEDICAL_STAFF|FACILITY_ADMIN",
            },
            {
              name: "status",
              type: "Enum",
              values: "ACTIVE|SUSPENDED|PENDING_KYC",
            },
            {
              name: "kycStatus",
              type: "Enum",
              values: "NONE|PENDING|APPROVED|REJECTED",
            },
            { name: "twoFactorEnabled", type: "Boolean", default: "false" },
            { name: "lastLoginAt", type: "DateTime" },
            { name: "createdAt", type: "DateTime" },
            { name: "updatedAt", type: "DateTime" },
          ],
          relations: ["Profile", "Wallets", "Transactions", "Sessions"],
        },
        {
          name: "Profile",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "userId", type: "UUID", key: "FK" },
            { name: "firstName", type: "String" },
            { name: "lastName", type: "String" },
            { name: "phone", type: "String" },
            { name: "dateOfBirth", type: "DateTime" },
            {
              name: "address",
              type: "JSON",
              structure: "{street, city, state, country, zipCode}",
            },
            { name: "avatarUrl", type: "String" },
            { name: "preferredCurrency", type: "String", default: "USD" },
          ],
          relations: ["User", "KYCDocuments"],
        },
        {
          name: "KYCDocument",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "profileId", type: "UUID", key: "FK" },
            {
              name: "documentType",
              type: "Enum",
              values: "PASSPORT|DRIVERS_LICENSE|ID_CARD",
            },
            { name: "documentNumber", type: "String", encrypted: true },
            { name: "documentUrl", type: "String" },
            {
              name: "verificationStatus",
              type: "Enum",
              values: "PENDING|VERIFIED|REJECTED",
            },
            { name: "verifiedAt", type: "DateTime" },
            { name: "verifiedBy", type: "UUID", key: "FK" },
          ],
        },
      ],
    },
    wallets: {
      title: "Wallets & Crypto",
      icon: CreditCard,
      color: "bg-purple-500",
      tables: [
        {
          name: "Wallet",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "userId", type: "UUID", key: "FK" },
            { name: "type", type: "Enum", values: "CRYPTO|FIAT" },
            {
              name: "currency",
              type: "String",
              note: "ETH|BTC|XLM|USDT|USD|EUR...",
            },
            { name: "balance", type: "Decimal", precision: "18,8" },
            {
              name: "lockedBalance",
              type: "Decimal",
              precision: "18,8",
              default: "0",
            },
            { name: "status", type: "Enum", values: "ACTIVE|FROZEN|CLOSED" },
            { name: "createdAt", type: "DateTime" },
          ],
          relations: ["User", "CryptoAddresses", "Transactions"],
          indexes: [{ fields: ["userId", "currency"], unique: true }],
        },
        {
          name: "CryptoAddress",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "walletId", type: "UUID", key: "FK" },
            {
              name: "blockchain",
              type: "Enum",
              values: "ETHEREUM|POLYGON|BSC|ARBITRUM|OPTIMISM|STELLAR",
            },
            { name: "address", type: "String", unique: true },
            { name: "isDefault", type: "Boolean", default: "false" },
            { name: "label", type: "String" },
            { name: "createdAt", type: "DateTime" },
          ],
          relations: ["Wallet", "DepositAddressMonitor"],
        },
        {
          name: "DepositAddressMonitor",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "addressId", type: "UUID", key: "FK" },
            { name: "blockchain", type: "String" },
            { name: "lastCheckedBlock", type: "BigInt" },
            { name: "isActive", type: "Boolean", default: "true" },
            { name: "lastCheckedAt", type: "DateTime" },
          ],
        },
      ],
    },
    transactions: {
      title: "Transactions & Payments",
      icon: Activity,
      color: "bg-green-500",
      tables: [
        {
          name: "Transaction",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "userId", type: "UUID", key: "FK" },
            {
              name: "type",
              type: "Enum",
              values: "DEPOSIT|WITHDRAWAL|TRANSFER|PAYMENT|REFUND",
            },
            {
              name: "status",
              type: "Enum",
              values: "PENDING|PROCESSING|COMPLETED|FAILED|CANCELLED",
            },
            { name: "amount", type: "Decimal", precision: "18,8" },
            { name: "currency", type: "String" },
            { name: "fee", type: "Decimal", precision: "18,8", default: "0" },
            { name: "netAmount", type: "Decimal", precision: "18,8" },
            { name: "fromWalletId", type: "UUID", key: "FK" },
            { name: "toWalletId", type: "UUID", key: "FK" },
            { name: "reference", type: "String", unique: true },
            { name: "metadata", type: "JSON" },
            { name: "completedAt", type: "DateTime" },
            { name: "createdAt", type: "DateTime" },
          ],
          relations: [
            "User",
            "Wallets",
            "CryptoTransactions",
            "StripePayments",
          ],
          indexes: [
            { fields: ["userId", "createdAt"] },
            { fields: ["status", "createdAt"] },
            { fields: ["reference"], unique: true },
          ],
        },
        {
          name: "CryptoTransaction",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "transactionId", type: "UUID", key: "FK" },
            { name: "blockchain", type: "String" },
            { name: "txHash", type: "String", unique: true },
            { name: "fromAddress", type: "String" },
            { name: "toAddress", type: "String" },
            { name: "blockNumber", type: "BigInt" },
            { name: "confirmations", type: "Int", default: "0" },
            { name: "gasUsed", type: "String" },
            { name: "gasFee", type: "Decimal", precision: "18,8" },
            { name: "confirmedAt", type: "DateTime" },
          ],
          indexes: [
            { fields: ["txHash"], unique: true },
            { fields: ["blockchain", "blockNumber"] },
          ],
        },
        {
          name: "StripePayment",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "transactionId", type: "UUID", key: "FK" },
            { name: "stripePaymentIntentId", type: "String", unique: true },
            { name: "stripeCustomerId", type: "String" },
            { name: "paymentMethod", type: "String" },
            { name: "last4", type: "String" },
            { name: "brand", type: "String" },
            { name: "receiptUrl", type: "String" },
            {
              name: "refundedAmount",
              type: "Decimal",
              precision: "18,8",
              default: "0",
            },
          ],
        },
        {
          name: "Withdrawal",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "transactionId", type: "UUID", key: "FK" },
            {
              name: "destinationType",
              type: "Enum",
              values: "CRYPTO_ADDRESS|BANK_ACCOUNT",
            },
            { name: "destinationDetails", type: "JSON" },
            { name: "conversionRate", type: "Decimal", precision: "18,8" },
            { name: "approvedBy", type: "UUID", key: "FK" },
            { name: "approvedAt", type: "DateTime" },
            { name: "processedAt", type: "DateTime" },
          ],
        },
      ],
    },
    medical: {
      title: "Medical & Facilities",
      icon: Building2,
      color: "bg-red-500",
      tables: [
        {
          name: "MedicalFacility",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "name", type: "String" },
            {
              name: "facilityType",
              type: "Enum",
              values: "HOSPITAL|CLINIC|PHARMACY|LAB",
            },
            { name: "address", type: "JSON" },
            { name: "phone", type: "String" },
            { name: "email", type: "String" },
            { name: "licenseNumber", type: "String", unique: true },
            {
              name: "status",
              type: "Enum",
              values: "ACTIVE|INACTIVE|SUSPENDED",
            },
            {
              name: "operatingHours",
              type: "JSON",
              structure: "{monday: {open, close}, ...}",
            },
            { name: "createdAt", type: "DateTime" },
          ],
          relations: ["Beds", "Staff", "Appointments"],
        },
        {
          name: "Bed",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "facilityId", type: "UUID", key: "FK" },
            { name: "bedNumber", type: "String" },
            {
              name: "bedType",
              type: "Enum",
              values: "ICU|GENERAL|PRIVATE|MATERNITY|PEDIATRIC|EMERGENCY",
            },
            { name: "floor", type: "String" },
            { name: "wing", type: "String" },
            {
              name: "status",
              type: "Enum",
              values: "AVAILABLE|OCCUPIED|MAINTENANCE|RESERVED",
            },
            { name: "currentPatientId", type: "UUID", key: "FK" },
            { name: "dailyRate", type: "Decimal", precision: "10,2" },
            { name: "lastSanitizedAt", type: "DateTime" },
          ],
          relations: ["MedicalFacility", "Patient"],
          indexes: [{ fields: ["facilityId", "bedNumber"], unique: true }],
        },
        {
          name: "Appointment",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "facilityId", type: "UUID", key: "FK" },
            { name: "patientId", type: "UUID", key: "FK" },
            { name: "doctorId", type: "UUID", key: "FK" },
            {
              name: "appointmentType",
              type: "Enum",
              values: "CONSULTATION|FOLLOW_UP|EMERGENCY|PROCEDURE",
            },
            { name: "scheduledAt", type: "DateTime" },
            { name: "duration", type: "Int", note: "minutes" },
            {
              name: "status",
              type: "Enum",
              values:
                "SCHEDULED|CONFIRMED|IN_PROGRESS|COMPLETED|CANCELLED|NO_SHOW",
            },
            { name: "notes", type: "Text" },
            {
              name: "paymentStatus",
              type: "Enum",
              values: "UNPAID|PAID|PARTIAL",
            },
            { name: "amount", type: "Decimal", precision: "10,2" },
            { name: "createdAt", type: "DateTime" },
          ],
          relations: ["MedicalFacility", "Patient", "Doctor"],
          indexes: [
            { fields: ["facilityId", "scheduledAt"] },
            { fields: ["patientId", "scheduledAt"] },
          ],
        },
        {
          name: "MedicalRecord",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "patientId", type: "UUID", key: "FK" },
            { name: "appointmentId", type: "UUID", key: "FK" },
            { name: "diagnosis", type: "Text" },
            { name: "symptoms", type: "JSON", note: "array of strings" },
            {
              name: "prescriptions",
              type: "JSON",
              structure: "[{medication, dosage, frequency, duration}]",
            },
            { name: "labResults", type: "JSON" },
            {
              name: "vitalSigns",
              type: "JSON",
              structure: "{bloodPressure, heartRate, temperature, ...}",
            },
            { name: "doctorNotes", type: "Text" },
            { name: "recordedAt", type: "DateTime" },
            { name: "recordedBy", type: "UUID", key: "FK" },
          ],
          relations: ["Patient", "Appointment", "Doctor"],
        },
      ],
    },
    audit: {
      title: "Audit & Security",
      icon: Shield,
      color: "bg-orange-500",
      tables: [
        {
          name: "AuditLog",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "userId", type: "UUID", key: "FK" },
            {
              name: "action",
              type: "String",
              note: "user.login, transaction.create, etc.",
            },
            {
              name: "entityType",
              type: "String",
              note: "User, Transaction, Wallet...",
            },
            { name: "entityId", type: "UUID" },
            {
              name: "changes",
              type: "JSON",
              structure: "{before: {}, after: {}}",
            },
            { name: "ipAddress", type: "String" },
            { name: "userAgent", type: "String" },
            { name: "metadata", type: "JSON" },
            { name: "createdAt", type: "DateTime" },
          ],
          indexes: [
            { fields: ["userId", "createdAt"] },
            { fields: ["entityType", "entityId"] },
            { fields: ["action", "createdAt"] },
          ],
        },
        {
          name: "SecurityEvent",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "userId", type: "UUID", key: "FK" },
            {
              name: "eventType",
              type: "Enum",
              values:
                "FAILED_LOGIN|SUSPICIOUS_ACTIVITY|ACCOUNT_LOCKED|PASSWORD_RESET|2FA_ENABLED",
            },
            {
              name: "severity",
              type: "Enum",
              values: "LOW|MEDIUM|HIGH|CRITICAL",
            },
            { name: "description", type: "Text" },
            { name: "ipAddress", type: "String" },
            { name: "resolved", type: "Boolean", default: "false" },
            { name: "resolvedAt", type: "DateTime" },
            { name: "createdAt", type: "DateTime" },
          ],
          indexes: [
            { fields: ["userId", "eventType"] },
            { fields: ["severity", "resolved"] },
          ],
        },
        {
          name: "RateLimit",
          fields: [
            { name: "id", type: "UUID", key: "PK" },
            { name: "identifier", type: "String", note: "userId or IP" },
            { name: "endpoint", type: "String" },
            { name: "requestCount", type: "Int" },
            { name: "windowStart", type: "DateTime" },
            { name: "windowEnd", type: "DateTime" },
            { name: "isBlocked", type: "Boolean", default: "false" },
          ],
          indexes: [
            { fields: ["identifier", "endpoint", "windowStart"], unique: true },
          ],
        },
      ],
    },
  };

  const TabButton = ({ id, icon: Icon, title, color, isActive }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isActive
          ? `${color} text-white shadow-lg`
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <Icon size={18} />
      <span className="font-medium">{title}</span>
    </button>
  );

  const active = structures[activeTab];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 rounded-xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">
            Advancia Pay Ledger
          </h1>
        </div>
        <p className="text-gray-600">Comprehensive Data Structure Design</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(structures).map(([id, { icon, title, color }]) => (
          <TabButton
            key={id}
            id={id}
            icon={icon}
            title={title}
            color={color}
            isActive={activeTab === id}
          />
        ))}
      </div>

      <div className="space-y-6">
        {active.tables.map((table, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md p-6 border-l-4"
            style={{ borderLeftColor: active.color.replace("bg-", "#") }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {table.name}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">
                      Field
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">
                      Constraints
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {table.fields.map((field, fieldIdx) => (
                    <tr
                      key={fieldIdx}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-2 px-3">
                        <span className="font-mono font-medium text-gray-800">
                          {field.name}
                        </span>
                        {field.key && (
                          <span
                            className={`ml-2 px-2 py-0.5 text-xs rounded ${
                              field.key === "PK"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {field.key}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-mono text-sm text-gray-600">
                          {field.type}
                        </span>
                        {field.precision && (
                          <span className="text-xs text-gray-500">
                            ({field.precision})
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-wrap gap-1">
                          {field.unique && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                              unique
                            </span>
                          )}
                          {field.default && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                              default: {field.default}
                            </span>
                          )}
                          {field.encrypted && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                              encrypted
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-xs text-gray-500">
                        {field.values && (
                          <div className="mb-1">Values: {field.values}</div>
                        )}
                        {field.note && <div>{field.note}</div>}
                        {field.structure && (
                          <div className="font-mono">{field.structure}</div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {table.relations && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Relations:</span>{" "}
                  {table.relations.join(", ")}
                </p>
              </div>
            )}

            {table.indexes && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Indexes:</span>
                </p>
                <ul className="list-disc list-inside text-xs text-gray-500 ml-4 mt-1">
                  {table.indexes.map((idx, i) => (
                    <li key={i}>
                      {idx.fields.join(", ")} {idx.unique && "(unique)"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">
          🎯 Key Design Principles
        </h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>All tables use UUID primary keys for distributed systems</li>
          <li>Timestamps (createdAt, updatedAt) for audit trails</li>
          <li>Enum types for status fields to ensure data integrity</li>
          <li>JSON fields for flexible metadata and nested structures</li>
          <li>Proper indexing on frequently queried fields</li>
          <li>Decimal types with precision for financial data</li>
          <li>Foreign key relationships maintain referential integrity</li>
        </ul>
      </div>
    </div>
  );
};

export default DataStructureDesign;
