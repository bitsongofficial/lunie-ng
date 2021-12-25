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
      active-class="active"
      class="menu-link"
    >
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" :color="isActive ? 'accent-2' : 'accent'" size="15px" />
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-weight-medium text-overline-2">{{ title }}</q-item-label>
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

<style lang="scss" scoped>
.menu-link {
  background: transparent;
  border-radius: 25px;
  padding: 16px 28px;
  color: $white;
  transition: all 250ms ease-in-out;

  &::v-deep(.q-icon) {
    transition: all 250ms ease-in-out;
  }

  &.active,
  &:hover {
    background: $white;
    color: $secondary;

    &::v-deep(.q-icon) {
      color: $accent-2 !important;
    }
  }
}
</style>
