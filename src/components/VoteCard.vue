<template>
  <div class="vote-card column">
    <vote-chart :dataset="dataset" />

    <div class="vote-card-legend row items-center justify-between">
      <div class="row items-center col-12 col-md-auto" v-for="(data, index) in dataset" :key="index">
        <div :class="'vote-card-dot bg-' + data.color"></div>

        <p class="vote-card-label text-subtitle2 text-white q-my-none text-capitalize">{{ data.label }}</p>

        <p class="vote-card-legend-value text-subtitle2 text-white q-my-none">{{ data.value }} %</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ChartData } from 'src/models';

import VoteChart from 'src/components/VoteChart.vue';

export default defineComponent({
  name: 'VoteCard',
  props: {
    dataset: {
      type: Array as PropType<ChartData[]>,
      required: true,
    }
  },
  components: {
    VoteChart,
  }
});
</script>

<style lang="scss" scoped>
.vote-card {
  background-color: $transparent-gray;
  backdrop-filter: blur(60px);
  border-radius: 10px;
  padding: 24px;

  @media screen and (min-width: $breakpoint-md-min) {
    padding: 44px 38px 36px;
  }
}

.vote-card-legend {
  margin-top: 20px;
  grid-gap: 12px;

  @media screen and (min-width: $breakpoint-md-min) {
    grid-gap: 0;
  }
}

.vote-card-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.vote-card-label {
  margin-left: 12px;
  margin-right: 24px;
}

.vote-card-legend-value {
  margin-left: auto;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-left: 0;
  }
}
</style>
