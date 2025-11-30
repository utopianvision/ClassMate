import React, { useState } from 'react'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Badge } from '../components/Badge'
import { Input } from '../components/Input'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { apiClient } from '../api/client'
import { Sparkles, Calendar, Clock, Target, AlertCircle } from 'lucide-react'
export function StudyPlanPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [studyPlan, setStudyPlan] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  // Default to today and 7 days from now
  const today = new Date().toISOString().split('T')[0]
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0]
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(nextWeek)
  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const plan = await apiClient.generateStudyPlan(startDate, endDate)
      setStudyPlan(plan)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to generate study plan',
      )
    } finally {
      setIsGenerating(false)
    }
  }
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Study Plan</h1>
        <p className="text-gray-600">
          Get personalized study recommendations powered by Google Gemini
        </p>
      </div>

      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-2">
              Generate Your Custom Study Plan
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Our AI analyzes your Canvas courses, assignments, and deadlines to
              create a personalized study schedule for your chosen date range.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isGenerating}
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isGenerating}
                min={startDate}
              />
            </div>

            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Generating with Gemini AI...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Study Plan
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">
                Failed to Generate Study Plan
              </p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {studyPlan && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-gray-600">Plan Period</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {new Date(studyPlan.weekStart).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                -{' '}
                {new Date(studyPlan.weekEnd).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-gray-600">Total Study Hours</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {studyPlan.dailyPlans.reduce(
                  (sum: number, day: any) => sum + day.totalHours,
                  0,
                )}{' '}
                hours
              </p>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <h3 className="font-medium text-gray-600">Focus Areas</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {studyPlan.dailyPlans.reduce(
                  (sum: number, day: any) => sum + day.tasks.length,
                  0,
                )}{' '}
                tasks
              </p>
            </Card>
          </div>

          <Card className="mb-6">
            <h3 className="font-bold text-gray-900 mb-4">AI Study Tips</h3>
            <ul className="space-y-2">
              {studyPlan.tips.map((tip: string, index: number) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </Card>

          <div className="space-y-6">
            {studyPlan.dailyPlans.map((day: any) => (
              <Card key={day.date}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {day.dayName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge variant="info">{day.totalHours} hours</Badge>
                </div>

                <div className="space-y-3">
                  {day.tasks.map((task: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="text-sm font-medium text-gray-600 min-w-[80px]">
                        {task.time}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900">
                            {task.subject}
                          </p>
                          <Badge
                            variant={
                              task.priority === 'high'
                                ? 'error'
                                : task.priority === 'medium'
                                  ? 'warning'
                                  : 'default'
                            }
                            size="sm"
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{task.task}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {task.duration} hour{task.duration > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
