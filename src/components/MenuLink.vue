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

      <q-badge v-if="count" :label="count" class="status-count text-uppercase text-weight-medium q-mx-none q-my-none text-caption-2" text-color="white" color="info"></q-badge>
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
      <div class="row no-wrap items-center">
        <q-item-label class="text-weight-medium text-subtitle2">{{ title }}</q-item-label>

        <q-icon class="external-icon" name="svguse:icons.svg#external|0 0 10 10" color="white" size="14px" />
      </div>
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
    },
    count: {
      type: Number,
    },
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

.status-count {
  margin-left: 14px;
  width: 24px;
  height: 24px;
  padding: 0;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
}

.external-icon {
  margin-left: 12px;
  margin-top: auto;
  margin-bottom: auto;
}
</style>
