<template>
  <q-page class="fantokens">
    <div class="undelegation-section">
      <div class="row items-center justify-between no-wrap section-header">
        <h2 class="delegations-title section-title text-body-large text-white">
          Fantoken Lab
        </h2>

        <!-- <q-btn
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
        </q-btn> -->
      </div>

      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
        appear
      >
        <fantokens-summary />
      </transition>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';

import FantokensSummary from 'src/components/FantokensSummary.vue';

export default defineComponent({
  name: 'Fantokens',
  components: {
    FantokensSummary,
  },
  setup() {
    const quasar = useQuasar();

    return {
      quasar
    };
  },
});
</script>

<style lang="scss" scoped>
.fantokens {
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
