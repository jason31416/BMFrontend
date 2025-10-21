<template>
  <img :src="avatarDataUrl" v-if="avatarDataUrl" class="player-avatar" />
  <div v-else class="avatar-placeholder"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    default: 40,
  }
});

const avatarDataUrl = ref(null);
const avatarCache = new Map();

const renderAvatar = async () => {
  if (!props.username) return;

  avatarDataUrl.value = "https://minotar.net/avatar/" + props.username;
};

onMounted(renderAvatar);
watch(() => props.username, renderAvatar);
</script>

<style scoped>
.player-avatar {
  width: v-bind(size + 'px');
  height: v-bind(size + 'px');
  image-rendering: pixelated;
  vertical-align: middle;
  border-radius: 4px;
}
.avatar-placeholder {
  width: v-bind(size + 'px');
  height: v-bind(size + 'px');
  background-color: #ccc;
  display: inline-block;
  vertical-align: middle;
  border-radius: 4px;
}
</style>