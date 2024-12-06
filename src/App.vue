<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore, redirectToAuthCodeFlow } from '@/stores/auth'
import { useMusicStore } from './stores/music'
// Components
import PlayLists from '@/components/PlayLists.vue'
import MainNav from './components/MainNav.vue'
import Card from './components/CardContainer.vue'
import MediaPlayer from './components/MediaPlayer.vue'
//
const auth = useAuthStore()
const musicStore = useMusicStore()

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code: string | null = urlParams.get('code')
  // If we find a code, we're in a callback, do a token exchange
  if (code) {
    const token = await auth.getAccessToken(code)
    auth.save(token)

    // Remove code from URL so we can refresh correctly.
    const url = new URL(window.location.href)
    url.searchParams.delete('code')

    const updatedUrl = url.search ? url.href : url.href.replace('?', '')
    window.history.replaceState({}, document.title, updatedUrl)
  } else if (!auth.access_token) {
    redirectToAuthCodeFlow()
  } else if (auth.access_token && auth.isExpired) {
    auth.refreshAcessToken()
  }
  await musicStore.fetchPlaylists()
})
</script>

<template>
  <aside>
    <MainNav />
    <PlayLists />
  </aside>
  <main>
    <Card>
      <RouterView />
    </Card>
  </main>
  <!-- <Card></Card> -->
  <MediaPlayer />
</template>

<style>
aside {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 18rem;
}
/* aside > *:first-child {
} */
aside > *:last-child {
  flex-grow: 1;
  min-height: 50%;
}
main {
  flex: 1 1 0;
  max-height: 100%;
  overflow: hidden;
}
main > * {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
