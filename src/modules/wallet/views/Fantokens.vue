<template>
  <q-page class="fantokens">
    <div class="section">
      <div class="section-header row items-center justify-between">
        <h2 class="section-title text-body-large text-white col-12 col-md-auto">
          Fantoken Lab
        </h2>

        <q-btn :disable="!session || (session && session.sessionType !== 'keplr' && session.sessionType !== 'walletconnect')" v-if="fantokenByOwner.length > 0" class="create-btn btn-medium text-h6 text-weight-medium col-12 col-md-auto" rounded unelevated color="primary" text-color="dark" padding="12px 28px" to="/fantokens/issue">
          CREATE FANTOKEN <q-icon class="arrow-icon" name="svguse:icons.svg#arrow-right|0 0 14 14" size="14px" color="dark" />
        </q-btn>
      </div>

      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
        appear
      >
        <fantokens-table :rows="fantokenByOwner" :loading="loading" v-if="loading || fantokenByOwner.length > 0" />
      </transition>

      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
        appear
      >
        <fantokens-summary v-if="fantokenByOwner.length === 0 && !loading" />
      </transition>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import { useStore } from 'src/store';

import FantokensSummary from 'src/components/FantokensSummary.vue';
import FantokensTable from 'src/components/FantokensTable.vue';
import { FanTokenMapped } from 'src/models';

export default defineComponent({
  name: 'Fantokens',
  components: {
    FantokensSummary,
    FantokensTable
  },
  setup() {
    const store = useStore();

    const fantokenByOwner = computed(() => store.getters['fantoken/fantokenByOwner'] as FanTokenMapped[]);
    const session = computed(() => store.state.authentication.session);
    const loading = computed(() => store.state.fantoken.loading);

    return {
      session,
      fantokenByOwner,
      loading
    }
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

.section {
  margin-bottom: 62px;
}

.create-btn {
  margin-top: 16px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-top: 0;
  }
}

.section-title {
  margin-top: 10px;
}

.arrow-icon {
  margin-left: 40px;
}
</style>
