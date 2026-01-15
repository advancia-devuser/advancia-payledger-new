"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  MapPin,
  DollarSign,
  Edit,
  Eye,
  Trash2,
  Building2,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";

interface Facility {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactPerson: string;
  email: string;
  phone: string;
  revenue?: number;
  status: string;
  createdAt: string;
}

export default function FacilitiesPage() {
  const router = useRouter();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/api/facilities`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFacilities(data.facilities || []);
      }
    } catch (error) {
      console.error("Failed to fetch facilities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFacilities = facilities.filter((facility) =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount?: number) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                Healthcare Facilities
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your medical facilities and locations
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Plus size={20} />
              Add New Facility
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search facilities by name, city, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            {/* Facilities Grid */}
            {filteredFacilities.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No facilities found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : "Get started by adding your first facility"}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Add First Facility
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFacilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Facility Header */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {facility.name}
                      </h3>
                      <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                        <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                        <span>
                          {facility.city}, {facility.state}
                        </span>
                      </div>
                      {facility.revenue !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                          <DollarSign size={16} />
                          <span>Revenue: {formatCurrency(facility.revenue)}</span>
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                      {facility.contactPerson && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Contact:</span>{" "}
                          {facility.contactPerson}
                        </div>
                      )}
                      {facility.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} />
                          {facility.phone}
                        </div>
                      )}
                      {facility.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} />
                          {facility.email}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/facilities/${facility.id}`)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        onClick={() => setSelectedFacility(facility)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats Summary */}
            {filteredFacilities.length > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Total Facilities
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {filteredFacilities.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Total Revenue
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(
                        filteredFacilities.reduce(
                          (sum, f) => sum + (f.revenue || 0),
                          0
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Average Revenue
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(
                        filteredFacilities.reduce(
                          (sum, f) => sum + (f.revenue || 0),
                          0
                        ) / filteredFacilities.length
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || selectedFacility) && (
        <FacilityModal
          facility={selectedFacility}
          onClose={() => {
            setShowAddModal(false);
            setSelectedFacility(null);
          }}
          onSave={() => {
            fetchFacilities();
            setShowAddModal(false);
            setSelectedFacility(null);
          }}
        />
      )}
    </div>
  );
}

// Facility Modal Component
function FacilityModal({
  facility,
  onClose,
  onSave,
}: {
  facility: Facility | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [formData, setFormData] = useState({
    name: facility?.name || "",
    address: facility?.address || "",
    city: facility?.city || "",
    state: facility?.state || "",
    zipCode: facility?.zipCode || "",
    contactPerson: facility?.contactPerson || "",
    email: facility?.email || "",
    phone: facility?.phone || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const url = facility
        ? `${API}/api/facilities/${facility.id}`
        : `${API}/api/facilities`;
      const method = facility ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save facility");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {facility ? "Edit Facility" : "Add New Facility"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facility Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facility Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter facility name"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street address"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="State"
              />
            </div>

            {/* Zip Code */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12345"
              />
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) =>
                  setFormData({ ...formData, contactPerson: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@example.com"
              />
            </div>

            {/* Phone */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(XXX) XXX-XXXX"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {facility ? "Save Changes" : "Add Facility"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
