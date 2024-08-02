import { defineStore } from 'pinia'
import type { Playlist } from '@/data/types'
interface MusicState {
  playlists: Playlist[]
}

export const useMusicStore = defineStore('musicStore', {
  state: (): MusicState => ({
    playlists: []
  }),
  actions: {
    async fetchPlaylists(): Promise<void> {
      const access_token = localStorage.getItem('access_token')
      // const cache: string | null = localStorage.getItem('playlists')
      // if (cache) {
      //   console.log(cache)
      //   this.playlists = JSON.parse(cache)
      //   return
      // }

      if (!access_token) return
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
          Authorization: 'Bearer ' + access_token
        }
      })
      const json = await response.json()
      const playlists: Playlist[] = json.items.map((playlist: any) => ({
        id: playlist.id,
        images: playlist.images,
        name: playlist.name,
        owner_name: playlist.owner.display_name,
        is_public: playlist.public,
        tracks: playlist.tracks
      }))
      localStorage.setItem('playlists', JSON.stringify(playlists))
      this.playlists = playlists
    }
  },
  getters: {}
})
