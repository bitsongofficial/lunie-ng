<template>
  <q-chip class="status text-uppercase text-weight-medium q-mx-none q-my-none text-body3" :class="{
    'small': small
  }" text-color="white" :color="color">
    {{ status }}
  </q-chip>
</template>

<script lang="ts">
import { getValidatorStatusColor } from 'src/common/status';
import { ValidatorStatus } from 'src/models';
import { defineComponent, PropType, computed } from 'vue';

export default defineComponent({
  name: 'ValidatorStatus',
  props: {
    status: {
      type: String as PropType<ValidatorStatus>,
      required: true
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const color = computed(() => getValidatorStatusColor(props.status));

    return {
      color,
    };
  }
});
</script>

<style lang="scss" scoped>
.status {
  padding-left: 12px;
  padding-right: 12px;
  min-height: 22px;
  border-radius: 25px;

  &.small {
    font-size: 10px;
  }
}
</style>
