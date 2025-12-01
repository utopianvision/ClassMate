const API_BASE_URL = 'https://localhost:5000/api'

// Session management
export const getSessionId = (): string | null => {
  return localStorage.getItem('sessionId')
}

export const setSessionId = (sessionId: string): void => {
  localStorage.setItem('sessionId', sessionId)
}

export const clearSessionId = (): void => {
  localStorage.removeItem('sessionId')
}

// API client
class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const sessionId = getSessionId()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (sessionId) {
      headers['X-Session-Id'] = sessionId
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: 'Network error' }))
      throw new Error(error.error || 'Request failed')
    }

    return response.json()
  }

  async login(canvasUrl: string, apiKey: string) {
    const response = await this.request<{
      success: boolean
      sessionId: string
      user: {
        id: number
        name: string
        email: string
        avatar: string
      }
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ canvasUrl, apiKey }),
    })

    if (response.sessionId) {
      setSessionId(response.sessionId)
    }

    return response
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' })
    clearSessionId()
  }

  async getUser() {
    return this.request<{
      id: number
      name: string
      email: string
      avatar: string
      canvasUrl: string
    }>('/user')
  }

  async getCourses() {
    return this.request<any[]>('/courses')
  }

  async getAssignments() {
    return this.request<any[]>('/assignments')
  }

  async generateStudyPlan(startDate?: string, endDate?: string) {
    return this.request<any>('/study-plan/generate', {
      method: 'POST',
      body: JSON.stringify({ startDate, endDate }),
    })
  }
  async sendMessageToChatbot(message: string) {
    return this.request<{ reply: string }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
}

export const apiClient = new ApiClient()
