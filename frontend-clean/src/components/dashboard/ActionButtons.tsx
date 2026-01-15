'use client';

import React, { useEffect, useState } from 'react';
import WithdrawButton from './WithdrawButton';
import SendButton from './SendButton';
import { getDashboardData, getUserProfile } from '../../lib/api/dashboard';

interface ActionButtonsProps {
  onTransactionComplete?: () => void;
  className?: string;
}

export default function ActionButtons({
  onTransactionComplete,
  className = '',
}: ActionButtonsProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile to check role
    getUserProfile()
      .then((response) => {
        if (response.success && response.data) {
          setUserRole(response.data.role || null);
        }
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSuccess = () => {
    // Refresh dashboard data
    getDashboardData().then(() => {
      onTransactionComplete?.();
    });
  };

  const handleError = (error: string) => {
    console.error('Transaction error:', error);
    // You can add toast notification here
  };

  // Check if user has permission (internal check - role not displayed)
  const hasPermission = userRole === 'SUPER_ADMIN';

  if (loading) {
    return (
      <div className={`flex gap-3 ${className}`}>
        <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded"></div>
        <div className="flex-1 h-10 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className={`flex gap-3 ${className}`}>
        <div className="flex-1 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-sm text-yellow-800">
            <strong>Restricted Access:</strong> Withdraw and send features are currently unavailable.
            <br />
            <span className="text-xs">Please contact support for assistance with fund transfers.</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${className}`}>
      <SendButton
        onSuccess={handleSuccess}
        onError={handleError}
        className="flex-1"
      />
      <WithdrawButton
        onSuccess={handleSuccess}
        onError={handleError}
        className="flex-1"
      />
    </div>
  );
}
