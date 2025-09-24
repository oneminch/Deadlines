<script setup lang="ts">
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger
  } from "@/components/ui/dialog";
  import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger
  } from "@/components/ui/drawer";
  import { Button } from "@/components/ui/button";
  import { useMediaQuery } from "@vueuse/core";

  defineProps<{
    title: string;
    description: string;
  }>();

  const isDesktop = useMediaQuery("(min-width: 640px)");
  const isOpen = ref(false);

  const Modal = computed(() => ({
    Root: isDesktop.value ? Dialog : Drawer,
    Trigger: isDesktop.value ? DialogTrigger : DrawerTrigger,
    Content: isDesktop.value ? DialogContent : DrawerContent,
    Header: isDesktop.value ? DialogHeader : DrawerHeader,
    Title: isDesktop.value ? DialogTitle : DrawerTitle,
    Description: isDesktop.value ? DialogDescription : DrawerDescription
  }));
</script>

<template>
  <component :is="Modal.Root" v-model:open="isOpen">
    <component :is="Modal.Trigger" as-child>
      <slot name="trigger" />
    </component>
    <component
      :is="Modal.Content"
      :class="[
        'w-auto sm:max-w-md',
        { 'px-2 *:px-4 border border-b-0': !isDesktop }
      ]">
      <component :is="Modal.Header">
        <component :is="Modal.Title" class="sr-only">{{ title }}</component>
        <component :is="Modal.Description" class="sr-only">{{
          description
        }}</component>
      </component>

      <slot />

      <DrawerFooter v-if="!isDesktop" class="pt-4">
        <DrawerClose as-child>
          <Button variant="outline"> Close </Button>
        </DrawerClose>
      </DrawerFooter>
    </component>
  </component>
</template>
