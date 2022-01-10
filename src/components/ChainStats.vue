<template>
  <div class="chain-stats">
    <div class="chain-stats-section">
      <h3 class="chain-stats-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-uppercase">
        {{ title }}
      </h3>

      <p class="chain-stats-subtitle text-body-extra-large3 text-white q-my-none" v-if="!loading">
        {{ quantity }}
      </p>
      <q-skeleton width="80px" height="36px" animation-speed="700" dark v-else></q-skeleton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
    quantity: {
      type: String,
      required: true
    },
  }
});
</script>

<style lang="scss" scoped>
.chain-stats {
  background: $transparent-gray2;
  box-shadow: $full-secondary-box-shadow;
  backdrop-filter: blur(60px);
  border-radius: $generic-border-radius;
  padding: 34px 46px 30px 43px;
}

.chain-stats-title {
  margin-bottom: 16px;
}

.chain-stats-section {
  & .chain-stats-title,
  & .chain-stats-subtitle {
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
