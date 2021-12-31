<template>
  <q-page class="portfolio">
    <div class="section-header row items-center no-wrap">
      <h2 class="section-title text-body-large text-white">
        Your Balances
      </h2>

      <q-btn class="btn-small text-body4" rounded unelevated color="accent-2" text-color="white" padding="5px 28px">
        {{ !quasar.screen.lt.md ? 'CLAIM REWARDS' : 'CLAIM' }}
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
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'Portfolio',
  components: {
    BalanceSummary,
    ValidatorsSummary,
  },
  setup() {
    const quasar = useQuasar();

    return {
      quasar,
    }
  }
});
</script>

<style lang="scss" scoped>
.portfolio {
  padding-top: 37px;
}

.section-header {
  margin-bottom: 16px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: 34px;
  }
}

.section-title {
  margin: 0 auto 0 0;

  @media screen and (min-width: $breakpoint-md-min) {
    padding-left: 32px;
    margin: 0 32px 0 0;
  }
}

.balance-summary {
  margin-bottom: 68px;
}
</style>
