<template>
  <q-page class="portfolio">
    <div class="section-header row items-center">
      <h2 class="section-title text-body-large text-white text-weight-medium col-12 col-md-auto">
        {{ $t('portfolio.balanceTitle') }}
      </h2>

      <div class="portfolio-btns col-12 col-md-6">
        <q-btn :disable="!session || (session && session.sessionType !== 'keplr')" @click="openReceiveDialog" outline class="receive-btn btn-medium text-h6 col-12 col-md-3" rounded unelevated color="accent-2" text-color="accent-2" padding="12px 24px 10px 26px">
          <label class="cursor-pointer text-white">{{ $t('actions.receive') }}</label> <q-icon class="rotate-90 q-ml-auto" name="svguse:icons.svg#arrow-right|0 0 14 14" size="14px" color="accent-2" />
        </q-btn>
        <q-btn :disable="!session || (session && session.sessionType !== 'keplr')" @click="openSendDialog" class="send-btn btn-medium text-h6 col-12 col-md-3" rounded unelevated color="accent-2" text-color="white" padding="12px 24px 10px 26px">
          {{ $t('actions.send') }} <q-icon class="btn-icon rotate-270 q-ml-auto" name="svguse:icons.svg#arrow-right|0 0 14 14" size="14px" color="white" />
        </q-btn>
      </div>
    </div>

    <balance-summary class="balance-summary" />

    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
      appear
    >
      <div class="undelegation-section" v-if="validatorsOfUndelegations.length > 0">
        <div class="section-header-small row items-center no-wrap">
          <h2 class="section-title text-body-large text-white text-weight-medium">
            {{ $t('portfolio.undelegatedTitle') }}
          </h2>
        </div>

        <validators-table :rows="validatorsOfUndelegations" :loading="!undelegationsLoaded || loading" unstaking />
      </div>
    </transition>

    <div class="undelegation-section">
      <div class="row items-center justify-between no-wrap" :class="{
        'section-header': validatorsOfDelegations.length === 0,
        'section-header-small': validatorsOfDelegations.length > 0,
      }">
        <h2 class="delegations-title section-title text-body-large text-white text-weight-medium">
          {{ $t('portfolio.delegationsTitle') }}
        </h2>

        <q-btn
          @click="openClaimDialog"
          :disable="!session || (session && session.sessionType !== 'keplr') || rewards.length === 0"
          class="btn-medium-large-small font-weight-medium text-body3"
          rounded
          unelevated
          color="accent-2"
          text-color="white"
          :padding="!quasar.screen.lt.md ? '8px 30px' : '8px 20px'"
        >
          {{ !quasar.screen.lt.md ? $t('actions.claimRewards') : $t('actions.claim') }}
        </q-btn>
      </div>

      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
        appear
      >
        <validators-summary v-if="validatorsOfDelegations.length === 0" />

        <validators-table :rows="validatorsOfDelegations" :loading="!delegationsLoaded || loading" staking v-else />
      </transition>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'src/store';
import { Validator } from 'src/models';

import BalanceSummary from 'src/components/BalanceSummary.vue';
import ValidatorsSummary from 'src/components/ValidatorsSummary.vue';
import ValidatorsTable from 'src/components/ValidatorsTable.vue';
import ClaimDialog from 'src/components/ClaimDialog.vue';
import SendDialog from 'src/components/SendDialog.vue';
import QrCodeDialog from 'src/components/QrCodeDialog.vue';

export default defineComponent({
  name: 'Portfolio',
  components: {
    BalanceSummary,
    ValidatorsSummary,
    ValidatorsTable
  },
  setup() {
    const store = useStore();
    const quasar = useQuasar();

    const rewards = computed(() => store.state.data.rewards);
    const session = computed(() => store.state.authentication.session);
    const loading = computed(() => store.state.authentication.loading || store.state.authentication.changing);

    const validatorsOfDelegations = computed(() => store.getters['data/validatorsOfDelegations'] as Validator[]);
    const delegationsLoaded = computed(() => store.state.data.delegationsLoaded);

    const validatorsOfUndelegations = computed(() => store.getters['data/validatorsOfUndelegations'] as Validator[]);
    const undelegationsLoaded = computed(() => store.state.data.undelegationsLoaded);

    const openClaimDialog = () => {
      quasar.dialog({
        component: ClaimDialog,
        fullWidth: true,
        maximized: true,
      });
    }

    const openSendDialog = () => {
      quasar.dialog({
        component: SendDialog,
        fullWidth: true,
        maximized: true,
      });
    }

    const openReceiveDialog = () => {
      quasar.dialog({
        component: QrCodeDialog,
        componentProps: {
          address: session.value?.address
        }
      });
    }

    return {
      loading,
      session,
      rewards,
      validatorsOfDelegations,
      delegationsLoaded,
      validatorsOfUndelegations,
      undelegationsLoaded,
      quasar,
      openClaimDialog,
      openSendDialog,
      openReceiveDialog
    }
  }
});
</script>

<style lang="scss" scoped>
.portfolio {
  padding-top: 40px;
  padding-bottom: 16px;
}

.section-header {
  margin-bottom: 16px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: 28px;
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
  grid-gap: 32px;

  @media screen and (min-width: $breakpoint-md-min) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.balance-summary {
  margin-bottom: 68px;
}

.undelegation-section {
  margin-bottom: 62px;
}

.section-balance {
  padding-right: 0;
  margin-left: auto;

  @media screen and (min-width: $breakpoint-md-min) {
    padding-right: 46px;
  }
}

.section-total {
  margin-right: 12px;
}

.delegations-title {
  margin-top: 10px;
}

.send-btn {
  width: 100%;
  max-width: 126px;
}

.receive-btn {
  width: 100%;
  max-width: 138px;
  margin-right: 8px;
}

.portfolio-btns {
  display: flex;
  flex-direction: row;
  margin-left: auto;
  justify-content: flex-end;
  margin-top: 16px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-top: 0;
  }
}

.btn-icon {
  opacity: 0.5;
}
</style>
