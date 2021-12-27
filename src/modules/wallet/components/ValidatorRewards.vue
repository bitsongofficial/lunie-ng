<template>
  <div class="validator-rewards column items-center">
    <label class="text-body4 text-weight-medium text-uppercase text-half-transparent-white">MY REWARDS</label>

    <h5 class="validator-rewards-amount text-body5 text-white">
      234,7864
    </h5>

    <div class="row items-center justify-center full-width">
      <q-btn class="btn-medium-small text-body4" rounded unelevated color="accent-2" text-color="white" padding="12px 28px">
        CLAIM
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ValidatorRewards',
});
</script>


<style lang="scss" scoped>
.validator-rewards {
  background-color: $transparent-gray;
  backdrop-filter: blur(60px);
  border-radius: 10px;
  padding: 18px 61px 22px;
}

.validator-rewards-amount {
  margin-top: 16px;
  margin-bottom: 20px;
}
</style>
