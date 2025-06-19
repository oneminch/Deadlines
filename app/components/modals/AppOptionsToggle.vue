<script setup lang="ts">
  import AppOptionsModal from "./AppOptionsModal.vue";

  const { openModal } = useModal();

  const openOptionsModal = () => {
    openModal(AppOptionsModal);
  };
</script>

<template>
  <button
    aria-label="Toggle App Options"
    title="Toggle App Options"
    class="icon-button"
    @click="openOptionsModal">
    <Icon name="ph:gear-six-duotone" />
  </button>
</template>
