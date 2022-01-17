<template>
  <div class="balance-summary">
    <div class="row" :class="{
      'q-gutter-y-md': quasar.screen.lt.md,
      'items-center': !quasar.screen.lt.md
    }">
      <div class="row col-12 col-md-8 justify-between q-mr-auto">
        <div class="balance-section column no-wrap col-12 col-md-auto">
          <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-center">
            TOTAL ({{ network.stakingDenom }})
          </h3>

          <template v-if="!loadingBalance && !loading">
            <p class="balance-subtitle text-body-extra-large text-white q-my-none">
              {{ balance ? balance.total : 0 }}
            </p>
          </template>
          <q-skeleton class="q-mx-auto" width="80px" height="36px" animation-speed="700" dark v-else></q-skeleton>
        </div>
        <div class="balance-section column no-wrap col-12 col-md-auto">
          <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-center">
            REWARDS ({{ network.stakingDenom }})
          </h3>

          <template v-if="!loadingBalance && !loading">
            <p class="balance-subtitle text-body-extra-large text-white q-my-none">
              {{ rewards }}
            </p>
          </template>
          <q-skeleton class="q-mx-auto" width="80px" height="36px" animation-speed="700" dark v-else></q-skeleton>
        </div>
        <div class="balance-section column no-wrap col-12 col-md-auto">
          <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-center">
            AVAILABLE ({{ network.stakingDenom }})
          </h3>

          <p class="balance-subtitle text-body-extra-large text-white q-my-none" v-if="!loadingBalance && !loading">
            {{ balance && balance.type === 'STAKE' ? balance.available : 0 }}
          </p>
          <q-skeleton class="q-mx-auto" width="80px" height="36px" animation-speed="700" dark v-else></q-skeleton>
        </div>
      </div>

      <q-btn :disable="!session || (session && session.sessionType !== 'keplr')" @click="openSendDialog" class="send-btn btn-medium text-h6 col-12 col-md-3" rounded unelevated color="accent-2" text-color="white" padding="12px 24px 10px 26px">
        SEND <q-icon class="balance-icon rotate-270" name="svguse:icons.svg#arrow-right|0 0 14 14" size="12px" color="half-transparent-white" />
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Dictionary } from 'lodash';
import { useQuasar } from 'quasar';
import { bigFigureOrShortDecimals } from 'src/common/numbers';
import { Balance } from 'src/models';
import { useStore } from 'src/store';
import { defineComponent, computed } from 'vue';
import SendDialog from './SendDialog.vue';

export default defineComponent({
  name: 'BalanceSummary',
  setup() {
    const store = useStore();
    const quasar = useQuasar();

    const session = computed(() => store.state.authentication.session);
    const loading = computed(() => store.state.authentication.loading || store.state.authentication.changing);

    const balance = computed(() => store.getters['data/currentBalance'] as Balance | undefined);
    const loadingBalance = computed(() => !store.state.data.balancesLoaded || store.state.data.loading);
    const network = computed(() => store.state.authentication.network);

    const rewards = computed(() => {
      const totalRewardsPerDenom = store.getters['data/totalRewardsPerDenom'] as Dictionary<number>;

      if (totalRewardsPerDenom && Object.keys(totalRewardsPerDenom).length > 0 && balance.value) {
        const amount = totalRewardsPerDenom[balance.value.denom];

        if (amount === 0) {
          return '0';
        }

        if (amount > 0.001) {
          return bigFigureOrShortDecimals(amount);
        } else {
          return '< 1';
        }
      }

      return '0';
    });

    const openSendDialog = () => {
      quasar.dialog({
        component: SendDialog,
        fullWidth: true,
        maximized: true,
      });
    }

    return {
      session,
      loadingBalance,
      loading,
      network,
      rewards,
      balance,
      quasar,
      openSendDialog
    }
  }
});
</script>

<style lang="scss" scoped>
.balance-summary {
  background: $transparent-gray2;
  box-shadow: $full-secondary-box-shadow;
  backdrop-filter: blur(60px);
  border-radius: $generic-border-radius;
  padding: 34px 46px 30px 43px;
}

.balance-title {
  margin-bottom: 10px;
}

.balance-section {
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

.balance-icon {
  margin-left: 32px;
}

.send-btn {
  @media screen and (min-width: $breakpoint-md-min) {
    max-width: 126px;
  }
}
</style>
