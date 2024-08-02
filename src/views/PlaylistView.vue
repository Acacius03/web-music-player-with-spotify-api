<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useMusicStore } from '@/stores/music'
import { computed, watch, ref } from 'vue'
const auth = useAuthStore()
const store = useMusicStore()
const currentPlaylist = computed(() => store.playlists[0])
const image = computed(() => currentPlaylist.value.images[1])
const tracks = ref()
watch(currentPlaylist, async () => {
  const response = await fetch(currentPlaylist.value.tracks.href, {
    headers: {
      Authorization: 'Bearer ' + auth.access_token
    }
  })
  const data = await response.json()
  console.log(data.items)
  tracks.value = data.items.map((item: any) => ({
    added_at: item.added_at,
    ...item.track
  }))
})

const formatTime = (ms: number): string => {
  const total_seconds: number = ms / 1000
  const minute: number = Math.floor(total_seconds / 60)
  const seconds: number = Math.ceil(total_seconds % 60)

  const formattedTime = `${minute}:${seconds < 10 ? `0${seconds}` : seconds}`
  return formattedTime
  //   return seconds
}
</script>
<template>
  <div v-if="currentPlaylist">
    <div class="playlist-info-wrapper">
      <div class="playlist-info">
        <img
          :src="image.url"
          :alt="`${currentPlaylist.name} cover image`"
          :width="image.width"
          :height="image.height"
        />
        <div>
          <small>{{ currentPlaylist.is_public ? 'Public' : 'Private' }} Playlist</small>
          <h1>{{ currentPlaylist.name }}</h1>
          <small>{{ currentPlaylist.owner_name }}</small>
        </div>
      </div>
    </div>
    <div v-if="tracks">
      <ul>
        <li v-for="track in tracks" :key="track.id">
          <img :src="track.album.images[2].url" alt="" />
          <div>
            <p>{{ track.name }}</p>
            <p>{{ track.artists[0].name }}</p>
          </div>
          <div>
            {{ track.album.name }}
          </div>
          <div>
            {{ track.added_at }}
          </div>
          <div>
            {{ formatTime(track.duration_ms) }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.playlist-info-wrapper {
  margin: -0.5rem;
  margin-bottom: 0;
  background-image: linear-gradient(to bottom, rgba(128, 128, 128, 0.8), rgba(128, 128, 128, 0.4));
}
.playlist-info {
  display: flex;
  align-items: end;
  gap: 1.5rem;
  padding: 1.5rem;
}
</style>
