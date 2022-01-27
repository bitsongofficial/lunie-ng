<template>
  <div class="toggle-btn row no-wrap position-relative">
    <button v-for="(option, i) in options" :key="option.value" class="text-h6 text-weight-medium" :class="{
      'active': modelValue === option.value,
      'animated': animated,
      'first-opt': firstOptionActive && i === 0
    }" :ref="el => setBtnRef(el, i)" @click="(payload) => onChange(payload, option.value)">
      {{ option.label }}
    </button>

    <div class="toggle-btn-segment" :class="{
      'animated': animated,
      'first-opt': firstOptionActive
    }" :style="{
      'width': `${segmentWidth}px`,
      'left': `${segmentOffset}px`,
    }"></div>

    <q-resize-observer @resize="onResize" />
  </div>
</template>

<script lang="ts">
import { Option } from 'src/models';
import { defineComponent, ref, computed, onBeforeUpdate, onMounted, PropType } from 'vue';

export default defineComponent({
  name: 'ToggleBtn',
  emits: ['update:modelValue'],
  props: {
    modelValue: [String, Number],
    options: {
      type: Array as PropType<Option[]>,
      required: true
    },
  },
  setup(props, ctx) {
    const segmentWidth = ref<number>(0);
    const segmentOffset = ref<number>(0);
    const animated = ref<boolean>(false);
    const buttons = ref<HTMLButtonElement[]>([]);
    const activeButton = computed(() => buttons.value.find((el: HTMLButtonElement) => {
      return el.classList.contains('active');
    }));
    const firstOptionActive = computed(() => {
      const options = [...props.options];
      const firstOpt = options.shift();

      if (firstOpt) {
        return firstOpt.value === props.modelValue;
      }

      return false;
    });

    const onChange = (payload: MouseEvent, value: string | number) => {
      const target = payload.target as HTMLButtonElement;
      segmentWidth.value = target.offsetWidth;
      segmentOffset.value = target.offsetLeft;
      animated.value = true;
      ctx.emit('update:modelValue', value);
    };

    const setBtnRef = (el: unknown, index: number) => {
      if (el) {
        buttons.value[index] = el as HTMLButtonElement;
      }
    };

    const onResize = () => {
      if (activeButton.value) {
        segmentWidth.value = activeButton.value.offsetWidth;
        segmentOffset.value = activeButton.value.offsetLeft;
      }
    };

    onMounted(() => {
      if (activeButton.value) {
        segmentWidth.value = activeButton.value.offsetWidth;
        segmentOffset.value = activeButton.value.offsetLeft;
      }
    });

    onBeforeUpdate(() => {
      buttons.value = [];
    });

    return {
      firstOptionActive,
      animated,
      segmentWidth,
      segmentOffset,
      buttons,
      onResize,
      onChange,
      setBtnRef
    }
  }
})
</script>

<style lang="scss" scoped>
.toggle-btn {
  border-radius: 25px;
  min-height: 32px;
  background-color: $transparent-gray2;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    border-radius: 25px;
    opacity: 0.3;
  }

  & button {
    border: none;
    background: none;
    color: $half-transparent-white;
    padding-left: 20px;
    padding-right: 20px;
    text-transform: uppercase;
    z-index: 1;
    flex: 1;
    cursor: pointer;
    transition: all 250ms ease-in-out;

    &.active {
      color: $dark;
    }

    &.first-opt {
      color: $white;
    }
  }
}

.toggle-btn-segment {
  position: absolute;
  top: 50%;
  left: 0;
  height: 100%;
  background-color: $primary;
  border-radius: 25px;
  transform: translateY(-50%);
  transition: background-color 250ms ease-in-out;

  &.first-opt {
    background-color: $half-transparent-white;
  }
}

.animated {
  transition: all 250ms ease-in-out;
}
</style>
