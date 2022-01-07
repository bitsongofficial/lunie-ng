<template>
  <q-item class="item bg-transparent-gray rounded-borders" v-bind="$props" @click="click">
    <q-item-section avatar v-if="(hasLeftContent || leftIcon) && !quasar.screen.lt.md">
      <slot name="left">
        <q-icon class="icon" :name="leftIcon" color="gray3" :size="leftIconSize" v-if="leftIcon" />
      </slot>
    </q-item-section>

    <q-item-section v-if="hasDefaultContent || title">
      <slot>
        <label class="title text-white text-weight-medium cursor-pointer" v-if="title">{{ title }}</label>
      </slot>
    </q-item-section>

    <q-item-section side v-if="hasRightContent || details || rightIcon">
      <slot name="right">
        <q-btn class="details-btn" :class="{
          'reverse': reverse
        }" rounded unelevated :color="!reverse ? 'secondary' : 'accent-2'" text-color="white" :disable="disable" size="18px" v-if="details">
          <q-icon class="small-icon" name="svguse:icons.svg#arrow-right|0 0 14 14" color="white" size="12px" />
        </q-btn>
        <q-icon class="small-icon" :name="rightIcon" color="gray3" v-else-if="rightIcon" />
      </slot>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { QItem, useQuasar } from 'quasar';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'Item',
  extends: QItem,
  emits: ['click'],
  props: {
    title: {
      type: String,
    },
    leftIcon: {
      type: String,
    },
    leftIconSize: {
      type: String,
      default: '20px',
    },
    rightIcon: {
      type: String,
    },
    details: {
      type: Boolean,
      default: false,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots, emit }) {
    const quasar = useQuasar();
    const hasLeftContent = computed(() => !!slots.left);
    const hasRightContent = computed(() => !!slots.right);
    const hasDefaultContent = computed(() => !!slots.default);

    return {
      quasar,
      hasLeftContent,
      hasRightContent,
      hasDefaultContent,
      click(e: Event) {
        emit('click', e);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.item {
  padding: 24px 28px 24px;
  min-height: 95px;
  border-radius: 10px;
  margin-bottom: 10px;

  &::v-deep(.q-item__section--avatar) {
    min-width: unset;
    padding-right: 37px;
  }

  &:not(.disabled):hover {
    & .details-btn {
      &:not(.reverse) {
        background-color: $accent-2 !important;
      }

      &.reverse {
        background-color: $secondary !important;
      }
    }
  }
}

.details-btn {
  transition: all 250ms ease-in-out;
  padding: 17px 26px;

  &::v-deep(.q-focus-helper) {
    opacity: 0 !important;
  }
}

.icon {
  width: 20px;
  height: 20px;
}

.title {
  font-size: 12px;
  line-break: 15px;

  @media screen and (min-width: $breakpoint-md-min) {
    font-size: 16px;
    line-break: 20px;
  }
}
</style>
