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
  tracks.value = data.items.map((item: any) => ({
    // added_at: item.added_at,
    ...item.track
  }))
})

const formatTime = (ms: number): string => {
  const total_seconds: number = ms / 1000
  const minute: number = Math.floor(total_seconds / 60)
  const seconds: number = Math.ceil(total_seconds % 60)

  const formattedTime = `${minute}:${seconds < 10 ? `0${seconds}` : seconds}`
  return formattedTime
}
</script>
<template>
  <div id="playlist" v-if="currentPlaylist">
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
    <table v-if="tracks">
      <tr>
        <th>#</th>
        <th>Title</th>
        <th>Album</th>
        <th>Duration</th>
      </tr>
      <tr v-for="(track, id) in tracks" :key="track.id">
        <td>{{ id + 1 }}</td>
        <td>
          <div class="title-cell">
            <img
              :src="track.album.images[2].url"
              :alt="track.album.name + ' album cover photo'"
              :width="track.album.images[2].width"
              :height="track.album.images[2].height"
            />
            <div>
              <h4>{{ track.name }}</h4>
              <small>{{ track.artists[0].name }}</small>
            </div>
          </div>
        </td>
        <td>{{ track.album.name }}</td>
        <td>{{ formatTime(track.duration_ms) }}</td>
      </tr>
    </table>
  </div>
</template>
<style scoped>
.playlist-info-wrapper {
  background-image: linear-gradient(to bottom, rgba(128, 128, 128, 0.8), rgba(128, 128, 128, 0.4));
}
.playlist-info {
  display: flex;
  align-items: end;
  gap: 1.5rem;
  padding: 1.5rem;
}
table {
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
}
tr:hover td {
  background-color: rgba(128, 128, 128, 0.3);
  outline: 1px solid rgba(128, 128, 128, 0.3);
}
tr:not(:first-child) {
  height: 56px;
}
tr > *:first-child {
  border-radius: 0.125rem 0 0 0.125rem;
  text-align: center;
  width: 48px;
}
tr > *:last-child {
  padding-right: 0.75rem;
  border-radius: 0 0.125rem 0.125rem 0;
  text-align: right;
}
th {
  text-align: left;
}
.title-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.title-cell img {
  width: 40px;
  height: 40px;
  border-radius: 0.125rem;
}
.title-cell div small {
  color: rgba(160, 160, 160, 1);
  font-weight: 600;
}
</style>
