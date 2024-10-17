<script setup lang="ts">
  import AppInputModal from "./AppInputModal.vue";

  const { openModal } = useModal();

  const openInputModal = () => {
    openModal(AppInputModal);
  };
</script>

<template>
  <button
    aria-label="Toggle Input"
    title="Toggle Input"
    class="icon-button"
    @click="openInputModal">
    <Icon name="ph:plus-bold" />
  </button>
</template>
