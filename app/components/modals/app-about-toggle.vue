<script setup lang="ts">
  import AppAboutModal from "./app-about-modal.vue";

  const { openModal } = useModal();

  const openAboutModal = () => {
    openModal(AppAboutModal);
  };
</script>

<template>
  <button
    aria-label="Toggle App Information"
    title="Toggle App Information"
    class="icon-button"
    @click="openAboutModal">
    <Icon name="ph:info-duotone" />
  </button>
</template>
