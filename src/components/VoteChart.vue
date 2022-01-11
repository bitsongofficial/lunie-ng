<template>
  <div class="vote-chart">
    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
      appear
      v-for="(data, index) in datasetReverse"
      :key="index"
    >
      <div :class="'progress bg-' + data.color" :data-percentage="data.value"></div>
    </transition>
  </div>
</template>

<script lang="ts">
import { ChartData } from 'src/models';
import { defineComponent, PropType, computed } from 'vue';

export default defineComponent({
  name: 'VoteChart',
  props: {
    dataset: {
      type: Array as PropType<ChartData[]>,
      required: true,
    }
  },
  setup(props) {
    const datasetReverse = computed(() => {
      const data = [];
      let total = 0;

      for (let i=0; i < props.dataset.length; i++) {
        data.push({
          ...props.dataset[i],
          value: Math.min(props.dataset[i].value + total, 100),
        });

        total += props.dataset[i].value;
      }

      return data.reverse();
    });

    const beforeEnter = (el: Element) => {
      const div = el as HTMLDivElement;

      div.style.width = '0';
      div.style.opacity = '0';
    };

    const enter = (el: Element) => {
      const div = el as HTMLDivElement;
      const width = div.dataset.percentage;

      if (width) {
        div.style.width = `${width}%`;
        div.style.opacity = '1';
      }
    };

    const leave = (el: Element) => {
      const div = el as HTMLDivElement;

      div.style.width = '0';
      div.style.opacity = '0';
    };

    return {
      beforeEnter,
      enter,
      leave,
      datasetReverse,
    }
  }
});
</script>

<style lang="scss" scoped>
.vote-chart {
  background-color: $transparent-gray;
  backdrop-filter: blur(60px);
  position: relative;
  height: 10px;
  border-radius: 30px;
  width: 100%;
}

.progress {
  position: absolute;
  left: 0;
  width: 0;
  height: 100%;
  border-radius: 30px;
  opacity: 0;
  transition: all 1s ease-in-out;
}
</style>
