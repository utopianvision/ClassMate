import React, { useEffect, useState } from 'react';
import { Bell, LogOut, User } from 'lucide-react';
import { apiClient } from '../api/client'; // Import apiClient
import { LoadingSpinner } from '../components/LoadingSpinner'; // Import LoadingSpinner

interface HeaderProps {
  user: any;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const [localUser, setLocalUser] = useState<any>(null); // Local state for user data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await apiClient.getUser();
        setLocalUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  if (isLoading) {
    return (
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back, Loading...
            </h2>
          </div>
          <div>
            <LoadingSpinner size="sm" />
          </div>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Error loading user data
            </h2>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Welcome back, {localUser?.name || 'Student'}!
          </h2>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            {localUser?.avatar ? (
              <img
                src={localUser.avatar}
                alt={localUser.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="text-sm">
              <p className="font-medium text-gray-900">
                {localUser?.name || 'Student'}
              </p>
              <p className="text-gray-600">
                {localUser?.email || ''}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200 text-red-600"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}