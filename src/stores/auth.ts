// stores/currentToken.ts
import { defineStore } from 'pinia'
import { generateCodeChallenge, generateCodeVerifier } from '@/utils'
import {
  AUTH_URL,
  LOGIN_PARAMS,
  PROFILE_URL,
  REFRESH_TOKEN_PARAMS,
  TOKEN_ACCESS_PARAMS,
  TOKEN_URL
} from '@/data/spotify'

// Types
interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

interface TokenState {
  access_token: string | null
  refresh_token: string | null
  expires_in: string | null
  expires: string | null
}

export const useAuthStore = defineStore('authStore', {
  state: (): TokenState => ({
    access_token: localStorage.getItem('access_token'),
    refresh_token: localStorage.getItem('refresh_token'),
    expires_in: localStorage.getItem('expires_in'),
    expires: localStorage.getItem('expires')
  }),
  actions: {
    save(response: TokenResponse) {
      const { access_token, refresh_token, expires_in } = response
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)
      localStorage.setItem('expires_in', expires_in.toString())

      const now = new Date()
      const expiry = new Date(now.getTime() + expires_in * 1000)
      localStorage.setItem('expires', expiry.toString())

      // Update state
      this.access_token = access_token
      this.refresh_token = refresh_token
      this.expires_in = expires_in.toString()
      this.expires = expiry.toString()
    },
    clear() {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('expires_in')
      localStorage.removeItem('expires')

      this.access_token = null
      this.refresh_token = null
      this.expires_in = null
      this.expires = null
    },
    // Spotify API calls
    async getAccessToken(code: string | null): Promise<any> {
      const code_verifier = localStorage.getItem('code_verifier')
      if (!code || !code_verifier) {
        redirectToAuthCodeFlow()
        return
      }
      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(TOKEN_ACCESS_PARAMS(code, code_verifier))
      })
      if (response.status === 401) {
        // Unauthorized request redirect to login
        redirectToAuthCodeFlow()
        return
      }
      return await response.json()
    },
    async refreshAcessToken(): Promise<any> {
      if (!this.refresh_token) {
        redirectToAuthCodeFlow()
        return
      }
      const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(REFRESH_TOKEN_PARAMS(this.refresh_token))
      })
      if (response.status === 400 || response.status === 401) {
        redirectToAuthCodeFlow()
        return
      }
      return await response.json()
    },
    async getUserProfile(): Promise<any> {
      const result = await fetch(PROFILE_URL, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + this.access_token }
      })

      return await result.json()
    }
  },
  getters: {
    isExpired(state): boolean {
      const now = new Date()
      return new Date(state.expires || '') <= now
    }
  }
})

// Spotify Auth
export const redirectToAuthCodeFlow = async (): Promise<void> => {
  const code_verifier = generateCodeVerifier(128)
  const code_challenge = await generateCodeChallenge(code_verifier)

  localStorage.setItem('code_verifier', code_verifier)
  const authUrl = new URL(AUTH_URL)

  authUrl.search = new URLSearchParams(LOGIN_PARAMS(code_challenge)).toString()
  window.location.href = authUrl.toString()
}
