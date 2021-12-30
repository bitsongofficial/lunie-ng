<template>
  <div class="validators-summary row items-center">
    <p class="text-subtitle2 text-half-transparent-white q-my-none q-mr-auto">
      No validators in your portfolio.<br/>
      Head over the validator list to start staking.
    </p>

    <q-btn to="/validators" class="btn-medium text-h6 font-weight-medium" rounded unelevated color="white" text-color="secondary" padding="12px 28px 10px 29px">
      VALIDATOR LIST <q-icon class="validators-icon" name="svguse:icons.svg#arrow-right|0 0 14 14" size="12px" color="secondary" />
    </q-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ValidatorsSummary',
});
</script>

<style lang="scss" scoped>
.validators-summary {
  background: $transparent-gray2;
  box-shadow: $full-secondary-box-shadow;
  backdrop-filter: blur(60px);
  border-radius: $generic-border-radius;
  padding: 38px 48px 36px 41px;
}

.validators-icon {
  margin-left: 60px;
  color: transparentize($color: $accent, $amount: 0.3);
}
</style>
