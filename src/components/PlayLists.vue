<script setup lang="ts">
import { useMusicStore } from '@/stores/music'
// Components
import Card from './CardContainer.vue'
import PlayList from './PlayListCard.vue'
//
const store = useMusicStore()
</script>

<template>
  <Card>
    <ul>
      <li v-for="playlist in store.playlists" :key="playlist.id">
        <PlayList :playlist="playlist" />
      </li>
    </ul>
  </Card>
</template>
