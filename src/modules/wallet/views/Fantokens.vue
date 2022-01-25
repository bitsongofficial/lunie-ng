<template>
  <q-page class="fantokens">
    <div class="undelegation-section">
      <div class="row items-center justify-between no-wrap section-header">
        <h2 class="delegations-title section-title text-body-large text-white">
          Fantoken Lab
        </h2>

        <q-btn class="btn-medium text-h6 font-weight-medium col-12 col-md-auto" rounded unelevated color="primary" text-color="dark" padding="12px 28px">
          CREATE FANTOKEN <q-icon class="arrow-icon" name="svguse:icons.svg#arrow-right|0 0 14 14" size="14px" color="dark" />
        </q-btn>
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

.arrow-icon {
  margin-left: 40px;
}
</style>
