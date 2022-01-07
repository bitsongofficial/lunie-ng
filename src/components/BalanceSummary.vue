<template>
  <div class="balance-summary">
    <div class="row" :class="{
      'q-gutter-y-md': quasar.screen.lt.md,
      'items-center': !quasar.screen.lt.md
    }">
      <div class="balance-section column no-wrap col-12 col-md-2">
        <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-uppercase">
          TOTAL {{ network.stakingDenom }}
        </h3>

        <p class="balance-subtitle text-body-extra-large text-white q-my-none">
          {{ balance ? balance.total : 0 }}
        </p>
      </div>
      <div class="balance-section column no-wrap col-12 col-md-2">
        <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-center">
          REWARDS
        </h3>

        <p class="balance-subtitle text-body-extra-large text-white q-my-none" v-if="rewards !== null">
          {{ rewards }} {{ balance?.denom }}
        </p>
        <p class="balance-subtitle text-body-extra-large text-white q-my-none" v-else>
          0
        </p>
      </div>
      <div class="balance-section column no-wrap col-12 col-md-2">
        <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-center">
          AVAILABLE
        </h3>

        <p class="balance-subtitle text-body-extra-large text-white q-my-none">
          {{ balance && balance.type === 'STAKE' ? balance.available : 0 }}
        </p>
      </div>

      <q-btn @click="openSendDialog" class="send-btn btn-medium text-h6 col-12 col-md-auto" rounded unelevated color="accent-2" text-color="white" padding="12px 24px 10px 26px">
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

    const balance = computed(() => store.getters['data/currentBalance'] as Balance | undefined);
    const network = computed(() => store.state.authentication.network);

    const rewards = computed(() => {
      const totalRewardsPerDenom = store.getters['data/totalRewardsPerDenom'] as Dictionary<number>;

      if (totalRewardsPerDenom && balance.value) {
        const amount = totalRewardsPerDenom[balance.value.denom];

        return amount > 0.001 ? bigFigureOrShortDecimals(amount) : null;
      }

      return null;
    });

    const openSendDialog = () => {
      quasar.dialog({
        component: SendDialog,
        fullWidth: true,
        maximized: true,
      });
    }

    return {
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
  & .balance-title,
  & .balance-subtitle {
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
  }

  &:nth-child(1) {
    & .balance-title,
    & .balance-subtitle {
      @media screen and (min-width: $breakpoint-md-min) {
        text-align: left;
      }
    }
  }

  &:nth-child(2) {
    @media screen and (min-width: $breakpoint-md-min) {
      margin-left: auto;
      margin-right: 250px;
    }
  }

  &:nth-child(3) {
    @media screen and (min-width: $breakpoint-md-min) {
      margin-right: auto;
    }
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
