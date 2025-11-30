import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { apiClient } from '../api/client';
import { Brain, Lock, Globe, AlertCircle } from 'lucide-react';
interface LoginPageProps {
  onLogin: () => void;
}
export function LoginPage({
  onLogin
}: LoginPageProps) {
  const [canvasUrl, setCanvasUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [errors, setErrors] = useState<{
    canvasUrl?: string;
    apiKey?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear previous errors
    setErrors({});
    // Basic validation
    const newErrors: {
      canvasUrl?: string;
      apiKey?: string;
    } = {};
    if (!canvasUrl) {
      newErrors.canvasUrl = 'Canvas URL is required';
    } else if (!canvasUrl.includes('instructure.com')) {
      newErrors.canvasUrl = 'Please enter a valid Canvas URL (e.g., https://school.instructure.com)';
    }
    if (!apiKey) {
      newErrors.apiKey = 'API Key is required';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Attempt login
    setIsLoading(true);
    try {
      await apiClient.login(canvasUrl, apiKey);
      onLogin();
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to connect to Canvas. Please check your credentials.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to StudySync
          </h1>
          <p className="text-gray-600">
            Connect your Canvas account to get started
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {errors.general && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">
                  Authentication Failed
                </p>
                <p className="text-sm text-red-700 mt-1">{errors.general}</p>
              </div>
            </div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input label="Canvas URL" type="url" placeholder="https://your-school.instructure.com" value={canvasUrl} onChange={e => {
              setCanvasUrl(e.target.value);
              setErrors({
                ...errors,
                canvasUrl: undefined,
                general: undefined
              });
            }} error={errors.canvasUrl} helperText="Your school's Canvas URL" disabled={isLoading} />
              <div className="mt-2 flex items-start gap-2 text-xs text-gray-500">
                <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Find this in your Canvas account settings or ask your school's
                  IT department
                </span>
              </div>
            </div>

            <div>
              <Input label="Canvas API Key" type="password" placeholder="Enter your Canvas API access token" value={apiKey} onChange={e => {
              setApiKey(e.target.value);
              setErrors({
                ...errors,
                apiKey: undefined,
                general: undefined
              });
            }} error={errors.apiKey} helperText="Generate this in Canvas: Account → Settings → New Access Token" disabled={isLoading} />
              <div className="mt-2 flex items-start gap-2 text-xs text-gray-500">
                <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Your API key is stored securely and never shared</span>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Connecting to Canvas...</span>
                </div> : 'Connect to Canvas'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              By connecting, you agree to allow StudySync to access your Canvas
              data to provide personalized study recommendations
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
            Need help getting your API key?
          </a>
        </div>
      </div>
    </div>;
}