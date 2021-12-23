<template>
  <router-link
    :to="link"
    custom
    v-slot="{ href, navigate, isActive }"
  >
    <q-item
      clickable
      tag="a"
      :href="href"
      @click="navigate"
      :active="isActive"
    >
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" />
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
      </q-item-section>
    </q-item>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MenuLink',
  props: {
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    icon: {
      type: String,
    }
  }
});
</script>
