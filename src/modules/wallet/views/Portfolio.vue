<template>
  <q-page class="portfolio">
    <div class="section-header row items-center no-wrap">
      <h2 class="section-title text-body-large text-white">
        Your Balances
      </h2>

      <q-btn class="btn-small text-body4" rounded unelevated color="accent-2" text-color="white" padding="5px 28px">
        CLAIM REWARDS
      </q-btn>
    </div>

    <balance-summary class="balance-summary" />

    <div class="section-header row items-center no-wrap">
      <h2 class="section-title text-body-large text-white">
        Your Stake
      </h2>
    </div>

    <validators-summary />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BalanceSummary from 'src/components/BalanceSummary.vue';
import ValidatorsSummary from 'src/components/ValidatorsSummary.vue';

export default defineComponent({
  name: 'Portfolio',
  components: {
    BalanceSummary,
    ValidatorsSummary,
  }
});
</script>

<style lang="scss" scoped>
.portfolio {
  padding-top: 37px;
}

.section-header {
  margin-bottom: 34px;
}

.section-title {
  margin: 0 32px 0 0;
  padding-left: 32px;
}

.balance-summary {
  margin-bottom: 68px;
}
</style>
