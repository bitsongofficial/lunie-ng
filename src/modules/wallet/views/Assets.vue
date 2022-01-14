<template>
  <q-page class="assets">
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
      appear
    >
      <div class="balance-section">
        <div class="section-header-small row items-center no-wrap">
          <h2 class="section-title text-body-large text-white">
            Your Assets
          </h2>
        </div>

        <balances-table :rows="balances" :loading="!balancesLoaded || loading" />
      </div>
    </transition>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'src/store';
import { Balance } from 'src/models';

import BalancesTable from 'src/components/BalancesTable.vue';

export default defineComponent({
  name: 'Assets',
  components: {
    BalancesTable
  },
  setup() {
    const store = useStore();

    const balances = computed(() => store.getters['data/balances'] as Balance[]);
    const balancesLoaded = computed(() => store.state.data.balancesLoaded);
    const loading = computed(() => store.state.authentication.loading || store.state.authentication.changing);

    return {
      balances,
      balancesLoaded,
      loading
    }
  }
});
</script>

<style lang="scss" scoped>
.assets {
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

.balance-section {
  margin-bottom: 62px;
}
</style>
