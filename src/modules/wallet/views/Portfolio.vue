<template>
  <q-page class="portfolio">
    <div class="section-header row items-center no-wrap">
      <h2 class="section-title text-body-large text-white">
        Your Balances
      </h2>

      <q-btn @click="openClaimDialog" :disable="rewards.length === 0" class="btn-small text-body4" rounded unelevated color="accent-2" text-color="white" padding="5px 28px">
        {{ !quasar.screen.lt.md ? 'CLAIM REWARDS' : 'CLAIM' }}
      </q-btn>
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

        <validators-table :rows="validatorsOfUndelegations" :loading="!undelegationsLoaded" unstaking />
      </div>
    </transition>

    <div class="undelegation-section">
      <div class="row items-center no-wrap" :class="{
        'section-header': validatorsOfDelegations.length === 0,
        'section-header-small': validatorsOfDelegations.length > 0,
      }">
        <h2 class="section-title text-body-large text-white">
          Your Delegations
        </h2>
      </div>

      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
        appear
      >
        <validators-summary v-if="validatorsOfDelegations.length === 0" />

        <validators-table :rows="validatorsOfDelegations" :loading="!delegationsLoaded" staking v-else />
      </transition>
    </div>

    <div class="section-header row items-center no-wrap">
      <h2 class="section-title text-body-large text-white">
        Chain Stats
      </h2>
    </div>

    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
      appear
    >
      <div class="chain-stats-grid">
        <chain-stats title="CIRCULATING SUPPLY" :quantity="supplyInfo?.circulatingSupply ?? '0'" :loading="loadingSupplyInfo" />
        <chain-stats title="TOTAL SUPPLY" :quantity="supplyInfo?.totalSupply ?? '0'" :loading="loadingSupplyInfo" />
        <chain-stats title="COMMUNITY POOL" :quantity="supplyInfo?.communityPool ?? '0'" :loading="loadingSupplyInfo" />
      </div>
    </transition>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'src/store';
import { SupplyResponse, Validator } from 'src/models';

import BalanceSummary from 'src/components/BalanceSummary.vue';
import ValidatorsSummary from 'src/components/ValidatorsSummary.vue';
import ValidatorsTable from 'src/components/ValidatorsTable.vue';
import ClaimDialog from 'src/components/ClaimDialog.vue';
import ChainStats from 'src/components/ChainStats.vue';

export default defineComponent({
  name: 'Portfolio',
  components: {
    BalanceSummary,
    ValidatorsSummary,
    ValidatorsTable,
    ChainStats
  },
  setup() {
    const store = useStore();
    const quasar = useQuasar();

    const rewards = computed(() => store.state.data.rewards);

    const validatorsOfDelegations = computed(() => store.getters['data/validatorsOfDelegations'] as Validator[]);
    const delegationsLoaded = computed(() => store.state.data.delegationsLoaded);

    const validatorsOfUndelegations = computed(() => store.getters['data/validatorsOfUndelegations'] as Validator[]);
    const undelegationsLoaded = computed(() => store.state.data.undelegationsLoaded);

    const supplyInfo = computed(() => store.getters['data/supplyInfo'] as SupplyResponse | null);
    const loadingSupplyInfo = computed(() => store.state.data.loadingSupplyInfo);

    const openClaimDialog = () => {
      quasar.dialog({
        component: ClaimDialog,
        fullWidth: true,
        maximized: true,
      });
    }

    return {
      supplyInfo,
      loadingSupplyInfo,
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
    padding-left: 32px;
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
</style>
