<template>
  <div class="timeline row items-center justify-between">
    <div class="timeline-entry column items-center col-12 col-md-auto" v-for="(entry, index) in entries" :key="index">
      <q-icon class="timeline-entry-icon" name="svguse:icons.svg#check-outlined|0 0 20 20" :color="entry.active ? 'white' : 'accent'" />

      <h6 class="text-subtitle2 text-weight-medium q-mt-sm q-mb-xs text-capitalize" :class="{
        'text-white': entry.active,
        'text-accent': !entry.active,
      }">{{ entry.label }}</h6>

      <p class="text-accent text-body3 q-my-none">{{ entry.subtitle }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { TimelineData } from 'src/models';

export default defineComponent({
  name: 'Timeline',
  props: {
    entries: {
      type: Array as PropType<TimelineData[]>,
      required: true,
    }
  },
});
</script>

<style lang="scss" scoped>
.timeline {
  background-color: $transparent-gray;
  backdrop-filter: blur(60px);
  border-radius: 10px;
  padding: 24px;
  grid-gap: 24px;

  @media screen and (min-width: $breakpoint-md-min) {
    padding: 28px 60px 22px;
    grid-gap: 0;
  }
}

.timeline-entry-icon {
  width: 20px;
  height: auto;
}
</style>
