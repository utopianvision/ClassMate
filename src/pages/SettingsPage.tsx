import React, { useEffect, useState } from 'react'
import { Card } from '../components/Card'
import { Input } from '../components/Input'
import { Badge } from '../components/Badge'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { apiClient } from '../api/client'
import {
  CheckCircle,
  Globe,
  User,
  Bell,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
export function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    loadUser()
  }, [])
  const loadUser = async () => {
    try {
      const userData = await apiClient.getUser()
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data')
    } finally {
      setIsLoading(false)
    }
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="p-8">
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">
                Failed to Load Settings
              </p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    )
  }
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account and Canvas connection
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Profile Information
            </h2>
          </div>

          <div className="space-y-4">
            <Input label="Full Name" value={user?.name || ''} readOnly />
            <Input
              label="Email Address"
              type="email"
              value={user?.email || 'Not available'}
              readOnly
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Canvas Connection
              </h2>
            </div>
            <Badge variant="success">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          </div>

          <div className="space-y-4">
            <Input
              label="Canvas URL"
              value={user?.canvasUrl || ''}
              readOnly
              helperText="Your school's Canvas instance URL"
            />
            <Input
              label="API Access Token"
              type="password"
              value="••••••••••••••••••••"
              readOnly
              helperText="Your Canvas API key is securely stored"
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">
              AI Configuration
            </h2>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-purple-900">Google Gemini API</p>
                <p className="text-sm text-purple-700 mt-1">
                  Connected and ready to generate study plans
                </p>
                <p className="text-xs text-purple-600 mt-2">
                  Model: gemini-2.0-flash
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            The AI study planner uses Google Gemini to analyze your coursework
            and generate personalized study recommendations based on your Canvas
            data.
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
                defaultChecked
              />
              <span className="text-gray-700">
                Email notifications for upcoming assignments
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
                defaultChecked
              />
              <span className="text-gray-700">Reminders for overdue items</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-gray-700">Weekly study plan summaries</span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  )
}
