<script setup lang="ts">
import type { Playlist } from '@/data/types'
const props = defineProps({
  playlist: {
    type: Object as () => Playlist,
    default: null
  }
})
const image = props.playlist.images[2]
</script>
<template>
  <div class="playlist">
    <img :src="image.url" alt="" :width="image.width" :height="image.height" />
    <div class="playlist-info">
      <h4>{{ playlist.name }}</h4>
      <h5>{{ playlist.owner_name }}</h5>
    </div>
  </div>
</template>
<style scoped>
.playlist {
  display: flex;
  padding: 0.25rem;
  border-radius: 0.5rem;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.playlist:hover {
  background-color: rgba(255, 255, 255, 0.03);
}
.playlist img {
  padding: 0.25rem;
  border-radius: 0.5rem;
}
.playlist-info > * {
  padding-block: 0.125rem;
}
.playlist-info h5 {
  color: rgba(160, 160, 160, 1);
}
</style>
