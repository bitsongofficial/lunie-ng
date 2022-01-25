<template>
  <q-page class="portfolio">
    <div class="section-header row items-center">
      <h2 class="section-title text-body-large text-white">
        Your Balances
      </h2>
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
          <h2 class="section-title text-body-large text-white">
            Undelegated
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
        <h2 class="delegations-title section-title text-body-large text-white">
          Your Delegations
        </h2>

        <q-btn
          @click="openClaimDialog"
          :disable="!session || (session && session.sessionType !== 'keplr') || rewards.length === 0"
          class="btn-medium-large-small font-weight-medium text-body3"
          rounded
          unelevated
          color="primary"
          text-color="dark"
          :padding="!quasar.screen.lt.md ? '8px 30px' : '8px 20px'"
        >
          {{ !quasar.screen.lt.md ? 'CLAIM REWARD' : 'CLAIM' }}
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

    return {
      loading,
      session,
      rewards,
      validatorsOfDelegations,
      delegationsLoaded,
      validatorsOfUndelegations,
      undelegationsLoaded,
      quasar,
      openClaimDialog
    }
  }
});
</script>

<style lang="scss" scoped>
.portfolio {
  padding-top: 37px;
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
</style>
