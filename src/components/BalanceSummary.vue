<template>
  <div class="balance-summary">
    <div class="balance-section column no-wrap">
      <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-center">
        {{ $t('general.total') }} {{ network.stakingDenom }}
      </h3>

      <template v-if="!loadingBalance && !loading">
        <p class="balance-subtitle text-weight-medium text-body-large text-white q-my-none">
          {{ total ? total.left : 0 }}<span class="text-h4" v-if="total && total.right">.{{ total.right }}</span>
        </p>
        <p class="balance-price text-weight-medium text-h6 text-half-transparent-white text-uppercase text-center q-my-none">
          {{ balance ? balance.totalFiat : 0 }} {{ currency }}
        </p>
      </template>
      <q-skeleton class="q-mx-auto" width="80px" height="36px" animation-speed="700" dark v-else></q-skeleton>
    </div>

    <q-separator class="balance-separator" color="full-transparent-white" vertical />

    <div class="balance-section column no-wrap">
      <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-center">
        {{ $t('general.delegated', { denom: network.stakingDenom }) }}
      </h3>

      <template v-if="!loadingBalance && !loading">
        <p class="balance-subtitle text-body-large text-white q-my-none" v-if="totalDelegated">
          {{ totalDelegated.left }}<span class="text-h4" v-if="totalDelegated && totalDelegated.right">.{{ totalDelegated.right }}</span>
        </p>
        <p class="balance-price text-weight-medium text-h6 text-half-transparent-white text-uppercase text-center q-my-none">
          {{ fiatDelegated }} {{ currency }}
        </p>
      </template>
      <q-skeleton class="q-mx-auto" width="80px" height="36px" animation-speed="700" dark v-else></q-skeleton>
    </div>

    <q-separator class="balance-separator" color="full-transparent-white" vertical />

    <div class="balance-section column no-wrap">
      <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-center">
        {{ $t('general.available', { denom: network.stakingDenom }) }}
      </h3>

      <template v-if="!loadingBalance && !loading">
        <p class="balance-subtitle text-body-large text-white q-my-none">
          {{ available && balance && balance.type === 'STAKE' ? available.left : 0 }}<span class="text-h4" v-if="available && available.right">.{{ available.right }}</span>
        </p>
        <p class="balance-price text-weight-medium text-h6 text-half-transparent-white text-uppercase text-center q-my-none">
          {{ balance ? balance.availableFiat : 0 }} {{ currency }}
        </p>
      </template>
      <q-skeleton class="q-mx-auto" width="80px" height="36px" animation-speed="700" dark v-else></q-skeleton>
    </div>

    <q-separator class="balance-separator" color="full-transparent-white" vertical />

    <div class="balance-section column no-wrap">
      <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-center">
        {{ $t('general.rewards', { denom: network.stakingDenom }) }}
      </h3>

      <template v-if="!loadingBalance && !loading">
        <p class="balance-subtitle text-body-large text-white q-my-none" v-if="rewards">
          {{ rewards.left }}<span class="text-h4" v-if="rewards && rewards.right">.{{ rewards.right }}</span>
        </p>
        <p class="balance-price text-weight-medium text-h6 text-half-transparent-white text-uppercase text-center q-my-none">
          {{ rewardsFiat }} {{ currency }}
        </p>
      </template>
      <q-skeleton class="q-mx-auto" width="80px" height="36px" animation-speed="700" dark v-else></q-skeleton>
    </div>
  </div>
</template>

<script lang="ts">
import { Dictionary } from 'lodash';
import { shortDecimals, splitDecimals } from 'src/common/numbers';
import { useFiatConversion } from 'src/hooks/useFiatConversion';
import { Balance } from 'src/models';
import { useStore } from 'src/store';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'BalanceSummary',
  setup() {
    const store = useStore();
    const { fiatConverter } = useFiatConversion();

    const currency = computed(() => store.state.settings.currency);
    const loading = computed(() => store.state.authentication.loading || store.state.authentication.changing);
    const balance = computed(() => store.getters['data/currentBalance'] as Balance | undefined);
    const fiatDelegated = computed(() => store.getters['data/fiatDelegated'] as string);
    const totalDelegated = computed(() => {
      const total = store.getters['data/totalDelegated'] as string;

      if (total) {
        return splitDecimals(total);
      }

      return null;
    });

    const total = computed(() => {
      if (balance.value) {
        return splitDecimals((balance.value.total as string))
      }

      return null;
    });

    const available = computed(() => {
      if (balance.value) {
        return splitDecimals((balance.value.available as string));
      }

      return null;
    });

    const loadingBalance = computed(() => !store.state.data.balancesLoaded || store.state.data.loading);
    const network = computed(() => store.state.authentication.network);

    const rewards = computed(() => {
      const totalRewardsPerDenom = store.getters['data/totalRewardsPerDenom'] as Dictionary<number>;

      if (totalRewardsPerDenom && Object.keys(totalRewardsPerDenom).length > 0 && balance.value) {
        const amount = totalRewardsPerDenom[balance.value.denom];

        if (amount === 0) {
          return {
            left: '0',
          };
        }

        if (amount > 0.001) {
          const rewards = shortDecimals(amount);

          if (rewards) {
            return splitDecimals(rewards);
          }
        } else {
          return {
            left: '< 1',
          };
        }
      }

      return {
        left: '0',
      };
    });

    const rewardsFiat = computed(() => {
      const totalRewardsPerDenom = store.getters['data/totalRewardsPerDenom'] as Dictionary<number>;

      if (totalRewardsPerDenom && Object.keys(totalRewardsPerDenom).length > 0 && balance.value) {
        const amount = totalRewardsPerDenom[balance.value.denom];

        return fiatConverter(amount);
      }

      return '0';
    });

    return {
      available,
      total,
      loadingBalance,
      loading,
      network,
      rewards,
      balance,
      rewardsFiat,
      currency,
      fiatDelegated,
      totalDelegated
    }
  }
});
</script>

<style lang="scss" scoped>
.balance-summary {
  display: grid;
  grid-template-columns: 1fr;
  background: $transparent-gray2;
  box-shadow: $full-secondary-box-shadow;
  backdrop-filter: blur(60px);
  border-radius: $generic-border-radius;
  padding: 32px;
  grid-gap: 32px;

  @media screen and (min-width: $breakpoint-md-min) {
    align-items: flex-start;
    justify-content: space-between;
    grid-template-columns: auto 1px auto 1px auto 1px auto;
    grid-gap: 0;
    padding: 40px 100px;
  }
}

.balance-title {
  margin-bottom: 10px;
  text-transform: uppercase;
}

.balance-section {
  position: relative;
  margin-bottom: 12px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: 0;
  }

  & .balance-title,
  & .balance-subtitle {
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
  }
}

.balance-price {
  margin-top: 4px;
}

.balance-separator {
  margin: auto 0;
  height: 61px;
  display: none;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: 0;
    display: block;
  }
}
</style>
