<template>
  <item clickable reverse details v-ripple :to="`/proposals/submit/${draft?.id}`">
    <div class="full-width" :class="{
      'row items-center': !quasar.screen.lt.md,
      'column reverse items-start': quasar.screen.lt.md,
    }">
      <div class="title-content">
        <h4 class="title text-white text-weight-medium q-my-none">{{ draft.title }}</h4>
      </div>
    </div>
  </item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ProposalSubmitRequest } from 'src/models';
import { useQuasar } from 'quasar';

import Item from 'src/components/Item.vue';

export default defineComponent({
  name: 'DraftItem',
  components: {
    Item,
  },
  props: {
    draft: {
      type: Object as PropType<ProposalSubmitRequest>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const quasar = useQuasar();

    return {
      quasar,
    }
  }
});
</script>

<style lang="scss" scoped>
.title-content {
  @media screen and (min-width: $breakpoint-md-min) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 120px);
  }
}

.title,
.title-skeleton {
  margin-bottom: 8px;

  @media screen and (min-width: $breakpoint-md-min) {
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0;
  }
}

.title-skeleton {
  max-width: 260px;
}

.section {
  margin-right: 17px;

  &:last-of-type {
    margin-right: 9px;
  }
}

.section-title {
  margin-right: 14px;
}
</style>
