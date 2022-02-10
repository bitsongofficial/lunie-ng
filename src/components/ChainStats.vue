<template>
  <div class="chain-stats large">
    <div class="chain-stats-section">
      <div class="chain-stats-header row justify-between">
        <h3 class="chain-stats-title q-my-none text-half-transparent-white text-caption text-weight-medium text-uppercase">
          {{ title }}
        </h3>

        <q-badge v-if="denom" :label="denom" class="network text-uppercase text-weight-medium text-caption-2" text-color="white" :color="!coin ? 'transparent-accent-3' : 'accent-2'"></q-badge>
      </div>

      <template v-if="!loading">
        <p class="chain-stats-subtitle text-h3 text-weight-medium text-white q-my-none" v-if="splittedDecimals">
          {{ splittedDecimals && splittedDecimals.left ? splittedDecimals.left : 'N/A' }}<span class="text-body-large" v-if="splittedDecimals && splittedDecimals.right">.{{ splittedDecimals.right }}</span>
        </p>
        <p class="chain-stats-subtitle text-h3 text-weight-medium text-white q-my-none" v-else>
          {{ quantity ?? 'N/A'  }}
        </p>
      </template>
      <q-skeleton width="80px" height="36px" animation-speed="700" dark v-else></q-skeleton>
    </div>
  </div>
</template>

<script lang="ts">
import { SplittedDecimals } from 'src/models';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'ChainStats',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    splittedDecimals: {
      type: Object as PropType<SplittedDecimals | null | undefined>,
    },
    quantity: {
      type: String,
    },
    denom: {
      type: String,
    },
    coin: {
      type: Boolean,
      default: false
    },
  },
});
</script>

<style lang="scss" scoped>
.chain-stats {
  background: $transparent-gray2;
  box-shadow: $full-secondary-box-shadow;
  border-radius: $generic-border-radius;
  padding: 24px 34px;

  &.large {
    min-height: 153px;
  }
}

.chain-stats-header {
  margin-bottom: 20px;
}

.chain-stats-title {
  margin-top: 6px;
  margin-right: 6px;
}

.chain-stats-section {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;

  & .chain-stats-title {
    flex: 1;
    word-break: break-word;
  }

  & .chain-stats-subtitle {
    word-break: break-all;
  }
}

.network {
  min-height: 24px;
  padding: 0 10px;
}
</style>
