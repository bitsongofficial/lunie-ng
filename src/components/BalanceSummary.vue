<template>
  <div class="balance-summary row items-center">
    <div class="balance-section column no-wrap">
      <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium">
        TOTAL BTSG
      </h3>

      <p class="text-body-large text-white q-my-none">
        16.670,34
      </p>
    </div>
    <div class="balance-section column no-wrap">
      <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-center">
        REWARDS
      </h3>

      <p class="text-body-large text-white q-my-none">
        239,87
      </p>
    </div>
    <div class="balance-section column no-wrap">
      <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-center">
        AVAILABLE
      </h3>

      <p class="text-body-large text-white q-my-none">
        10.670,44
      </p>
    </div>

    <q-btn class="btn-medium text-h6" rounded unelevated color="accent-2" text-color="white" padding="12px 24px 10px 26px">
      SEND <q-icon class="balance-icon rotate-270" name="svguse:icons.svg#arrow-right|0 0 14 14" size="12px" color="half-transparent-white" />
    </q-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BalanceSummary',
});
</script>

<style lang="scss" scoped>
.balance-summary {
  background: $transparent-gray2;
  box-shadow: $full-secondary-box-shadow;
  backdrop-filter: blur(60px);
  border-radius: $generic-border-radius;
  padding: 31px 46px 30px 43px;
}

.balance-title {
  margin-bottom: 21px;
}

.balance-section:nth-child(2) {
  margin-left: auto;
  margin-right: 92px;
}

.balance-section:nth-child(3) {
  margin-right: auto;
}

.balance-icon {
  margin-left: 32px;
}
</style>
