<template>
  <q-page class="assets">
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
      appear
    >
      <div class="chain-stats-grid">
        <chain-stats title="TOTAL ASSETS" :denom="currency" :splittedDecimals="{
          'left': '20,356',
          'right': '76'
        }" />
        <chain-stats title="TOTAL STAKED" :denom="currency" :splittedDecimals="{
          'left': '20,356',
          'right': '76'
        }" />
        <chain-stats :title="network.stakingDenom + ' PRICE'" :denom="currency" :splittedDecimals="currentPrice" :loading="loading" />
      </div>
    </transition>
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
      appear
    >
      <div class="balance-section">
        <div class="section-header-small row items-center no-wrap">
          <h2 class="section-title text-body-large text-white">
            IBC Tokens
          </h2>
        </div>

        <balances-table :rows="balances" :loading="!balancesLoaded || loading" />
      </div>
    </transition>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'src/store';
import { Balance } from 'src/models';

import BalancesTable from 'src/components/BalancesTable.vue';
import ChainStats from 'src/components/ChainStats.vue';
import { shortDecimals, splitDecimals } from 'src/common/numbers';

export default defineComponent({
  name: 'Assets',
  components: {
    BalancesTable,
    ChainStats
  },
  setup() {
    const store = useStore();

    const network = computed(() => store.state.authentication.network);
    const currency = computed(() => store.state.settings.currency);
    const balances = computed(() => store.getters['data/balances'] as Balance[]);
    const balancesLoaded = computed(() => store.state.data.balancesLoaded);
    const loading = computed(() => store.state.authentication.loading || store.state.authentication.changing);

    const currentPrice = computed(() => {
      const total = store.getters['data/getCurrentPrince'] as number;
      const short = shortDecimals(total);

      if (short) {
        return splitDecimals(short);
      }

      return null;
    });

    return {
      network,
      currentPrice,
      balances,
      balancesLoaded,
      currency,
      loading
    }
  }
});
</script>

<style lang="scss" scoped>
.assets {
  padding-top: 40px;
  padding-bottom: 16px;
}

.section-header {
  margin-top: 0;
  margin-bottom: 16px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: 34px;
  }
}

.section-header-small {
  margin-top: 0;
  margin-bottom: 10px;
}

.section-title {
  margin: 0 auto 0 0;

  @media screen and (min-width: $breakpoint-md-min) {
    margin: 0 32px 0 0;
  }
}

.balance-section {
  margin-bottom: 62px;
}

.chain-stats-grid {
  display: grid;
  column-gap: 32px;
  row-gap: 26px;
  margin-bottom: 24px;

  @media screen and (min-width: $breakpoint-md-min) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
