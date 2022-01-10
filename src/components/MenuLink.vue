<template>
  <router-link
    :to="link"
    custom
    v-slot="{ href, route, navigate, isActive }"
    v-if="!external"
  >
    <q-item
      clickable
      tag="a"
      :href="href"
      @click="navigate"
      :active="isActive || contained(route)"
      active-class="active"
      class="menu-link"
    >
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" :color="newLink || isActive || contained(route) ? 'accent-2' : 'accent'" size="20px" />
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-weight-medium text-subtitle2">{{ title }}</q-item-label>
      </q-item-section>
    </q-item>
  </router-link>
  <q-item
    clickable
    tag="a"
    target="_blank"
    :href="link"
    active-class="active"
    class="menu-link"
    v-else
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" :color="newLink ? 'accent-2' : 'accent'" size="20px" />
    </q-item-section>

    <q-item-section>
      <q-item-label class="text-weight-medium text-subtitle2">{{ title }}</q-item-label>
    </q-item-section>

    <q-item-section v-if="newLink">
      <q-chip class="status text-uppercase text-weight-medium q-mx-none q-my-none text-body6" text-color="white" color="accent-2">
        new
      </q-chip>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter, RouteLocationNormalizedLoaded } from 'vue-router';

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
    },
    external: {
      type: Boolean,
      default: false,
    },
    newLink: {
      type: Boolean,
      default: false,
    }
  },
  setup() {
    const router = useRouter();

    const contained = (route: RouteLocationNormalizedLoaded) => {
      return router.currentRoute.value.path.includes(route.path);
    };

    return {
      contained,
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

  &:hover {
    background: $transparent-gray2;
    color: $white;
  }
}

.status {
  padding-left: 8px;
  padding-right: 8px;
  margin-left: 12px;
  width: 37px;
  min-height: 24px;
  border-radius: 25px;
}
</style>
