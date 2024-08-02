const client_id: string = '8ff3e2ceba3d452b94e0815253bcb8e4'
const redirect_uri: string = 'http://localhost:5173/'
const SCOPE: string[] = ['user-read-private', 'user-read-email', 'playlist-read-private']

export const AUTH_URL: string = 'https://accounts.spotify.com/authorize'
export const TOKEN_URL: string = 'https://accounts.spotify.com/api/token'
export const PROFILE_URL: string = 'https://api.spotify.com/v1/me'

export const LOGIN_PARAMS = (code_challenge: string) => {
  return {
    client_id,
    response_type: 'code',
    redirect_uri,
    scope: SCOPE.join(' '),
    code_challenge_method: 'S256',
    code_challenge
  }
}

export const TOKEN_ACCESS_PARAMS = (code: string, code_verifier: string) => {
  return {
    client_id,
    grant_type: 'authorization_code',
    code,
    redirect_uri,
    code_verifier
  }
}

export const REFRESH_TOKEN_PARAMS = (refresh_token: string) => {
  return {
    grant_type: 'refresh_token',
    refresh_token,
    client_id
  }
}
