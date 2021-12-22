<template>
  <div :class="`alert-box row items-center no-wrap text-${color}`">
    <q-icon class="icon" name="svguse:icons.svg#warning|0 0 21 19" size="30px" />

    <h6 class="q-my-none white-space-break-spaces">{{ title }}</h6>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AlertBox',
  props: {
    color: {
      type: String,
      default: 'negative'
    },
    title: {
      type: String,
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
.alert-box {
  padding: 18px 32px 18px 26px;
  border-radius: 10px;
  border-width: 1px;
  border-style: solid;
  border-color: currentColor;
}

.icon {
  margin-right: 32px;
}
</style>
