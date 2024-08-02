<script setup lang="ts">
import Card from './CardContainer.vue'
import HouseIcon from './icons/HouseIcon.vue'
import MagnifiyingGlassIcon from './icons/MagnifiyingGlassIcon.vue'
</script>

<template>
  <Card>
    <nav>
      <button>
        <HouseIcon color="#FFFFFFF2" width="24" height="24" />
        <span>Home</span>
      </button>
      <button>
        <MagnifiyingGlassIcon color="#FFFFFFF2" width="24" height="24" />
        <span> Search </span>
      </button>
    </nav>
  </Card>
</template>
<style scoped>
button {
  display: flex;
  width: 100%;
  text-align: left;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.75rem;
  align-items: center;
  gap: 1.25rem;
  border-radius: 0.25rem;
}
button:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.icon {
  color: inherit;
}
</style>
