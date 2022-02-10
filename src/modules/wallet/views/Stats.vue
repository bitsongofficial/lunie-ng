<template>
  <q-page class="stats">
    <div class="section-header row items-center no-wrap">
      <h2 class="section-title text-body-large text-white">
        {{ $t('stats.title') }}
      </h2>
    </div>

    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
      appear
    >
      <div class="chain-stats-grid">
        <chain-stats
          :title="$t('general.circulatingSupply')"
          :denom="network.stakingDenom"
          :splittedDecimals="supplyInfo?.circulatingSupply"
          :loading="loadingSupplyInfo"
          coin
        />
        <chain-stats
          :title="$t('general.totalSupply')"
          :denom="network.stakingDenom"
          :splittedDecimals="supplyInfo?.totalSupply"
          :loading="loadingSupplyInfo"
          coin
        />
        <chain-stats
          :title="$t('general.communityPool')"
          :denom="network.stakingDenom"
          :splittedDecimals="supplyInfo?.communityPool"
          :loading="loadingSupplyInfo"
          coin
        />
        <chain-stats
          :title="$t('general.marketCap')"
          :denom="currency"
          :splittedDecimals="marketCap"
          :loading="loadingSupplyInfo"
        />
        <chain-stats
          :title="$t('general.marketCapFullyDiluited')"
          :denom="currency"
          :splittedDecimals="marketCapFullyDiluited"
          :loading="loadingSupplyInfo"
        />
        <chain-stats
          :title="$t('general.totalVolume')"
          :denom="currency"
          :splittedDecimals="totalVolume"
          :loading="loadingSupplyInfo"
        />
        <chain-stats
          :title="$t('general.price')"
          :denom="currency"
          :splittedDecimals="currentPrice"
          :loading="loadingSupplyInfo"
        />
        <chain-stats
          :title="$t('general.apr')"
          :quantity="apr"
          :loading="loadingApr"
        />
        <chain-stats
          :title="$t('general.tokenBonded')"
          :denom="network.stakingDenom"
          :splittedDecimals="bondedTokens"
          :loading="loadingApr"
          coin
        />
        <chain-stats
          :title="'% ' + $t('general.tokenBonded')"
          :quantity="bondedTokensPercentage"
          :loading="loadingApr"
        />
        <chain-stats
          :title="$t('menu.validators')"
          :quantity="validatorsCount"
          :loading="loadingApr"
        />
        <chain-stats
          :title="$t('general.annualInflation')"
          :quantity="inflation"
          :loading="loadingApr"
        />
      </div>
    </transition>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'src/store';
import { SplittedDecimals, SupplyResponse, ValidatorStatus } from 'src/models';

import ChainStats from 'src/components/ChainStats.vue';
import { shortDecimals, splitDecimals } from 'src/common/numbers';

export default defineComponent({
  name: 'Stats',
  components: {
    ChainStats
  },
  setup() {
    const store = useStore();

    const supplyInfo = computed(() => store.getters['data/supplyInfo'] as SupplyResponse | null);
    const loadingSupplyInfo = computed(
      () => store.state.data.loadingSupplyInfo || store.state.data.loadingApr || store.state.authentication.loading || store.state.authentication.changing
    );
    const network = computed(() => store.state.authentication.network);
    const currency = computed(() => store.state.settings.currency);

    const apr = computed(() => store.getters['data/getAprInfo'] as string | null);
    const inflation = computed(() => store.getters['data/getInflation'] as string | null);
    const validatorsCount = computed(() => store.state.data.validators.filter(el => el.status === ValidatorStatus.ACTIVE).length.toString());
    const bondedTokens = computed(() => store.getters['data/getBondedTokens'] as string | null);
    const bondedTokensPercentage = computed(() => store.getters['data/getBondedTokensPercentage'] as string | null);
    const loadingApr = computed(() => store.state.data.loadingApr || store.state.data.loading || store.state.authentication.loading || store.state.authentication.changing);

    const currentPrice = computed(() => {
      const total = store.getters['data/getCurrentPrice'] as number;
      const short = shortDecimals(total);

      if (short) {
        return splitDecimals(short);
      }

      return null;
    });

    const marketCap = computed(() => {
      const total = store.getters['data/getMarketCap'] as number;
      const short = shortDecimals(total);

      if (short) {
        return splitDecimals(short);
      }

      return null;
    });

    const marketCapFullyDiluited = computed(() => store.getters['data/marketCapFullyDiluited'] as SplittedDecimals | null);

    const totalVolume = computed(() => {
      const total = store.getters['data/getTotalVolume'] as number;
      const short = shortDecimals(total);

      if (short) {
        return splitDecimals(short);
      }

      return null;
    });

    return {
      validatorsCount,
      bondedTokensPercentage,
      marketCap,
      totalVolume,
      currentPrice,
      currency,
      network,
      inflation,
      bondedTokens,
      apr,
      loadingApr,
      supplyInfo,
      marketCapFullyDiluited,
      loadingSupplyInfo
    }
  }
});
</script>

<style lang="scss" scoped>
.stats {
  padding-top: 40px;
  padding-bottom: 16px;
}

.section-header {
  margin-bottom: 16px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: 34px;
  }
}

.section-header-small {
  margin-top: 10px;
  margin-bottom: 10px;
}

.section-title {
  margin: 0 auto 0 0;

  @media screen and (min-width: $breakpoint-md-min) {
    padding-left: 0;
    margin: 0 32px 0 0;
  }
}

.chain-stats-grid {
  display: grid;
  column-gap: 32px;
  row-gap: 26px;

  @media screen and (min-width: $breakpoint-md-min) {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
