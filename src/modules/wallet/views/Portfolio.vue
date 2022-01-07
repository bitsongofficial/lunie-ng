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

    <div class="undelegation-section" v-if="validatorsOfUndelegations.length > 0">
      <div class="section-header row items-center no-wrap">
        <h2 class="section-title text-body-large text-white">
          Undelegated
        </h2>
      </div>

      <validators-table :rows="validatorsOfUndelegations" :loading="!undelegationsLoaded" unstaking />
    </div>

    <div class="section-header row items-center no-wrap">
      <h2 class="section-title text-body-large text-white">
        Your Delegations
      </h2>
    </div>

    <validators-summary v-if="validatorsOfDelegations.length === 0" />

    <validators-table :rows="validatorsOfDelegations" :loading="!delegationsLoaded" staking v-else />
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

.undelegation-section {
  margin-bottom: 62px;
}
</style>
