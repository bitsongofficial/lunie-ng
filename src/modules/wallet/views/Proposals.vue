<template>
  <q-page class="proposals">
    <div class="section-header row items-center no-wrap">
      <h2 class="section-title text-body-large text-white">
        Proposals
      </h2>
    </div>

    <div class="toggle-btn-wrapper scroll">
      <q-btn-toggle
        v-model="type"
        class="filter"
        toggle-color="primary"
        flat
        unelevated
        :ripple="false"
        text-color="accent"
        toggle-text-color="white"
        padding="0"
        :options="options"
        stretch
      />
    </div>

    <q-list class="proposals-list">
      <template v-if="!loading" >
        <template v-if="proposals.length > 0">
          <q-virtual-scroll :items="proposals">
            <template v-slot="{ item }">
              <proposal-item :key="item.id" :proposal="item" />
            </template>
          </q-virtual-scroll>
        </template>
        <proposals-summary @click="type = undefined" v-else></proposals-summary>
      </template>
      <proposal-item v-for="index in 6" :key="index" loading v-else />
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { proposalsTypeOptions } from 'src/constants';
import { useStore } from 'src/store';
import { ProposalStatus } from 'src/models';

import ProposalItem from 'src/components/ProposalItem.vue';
import ProposalsSummary from 'src/components/ProposalsSummary.vue';

export default defineComponent({
  name: 'Proposals',
  components: {
    ProposalItem,
    ProposalsSummary
  },
  setup() {
    const store = useStore();
    const type = ref<ProposalStatus>();

    const proposals = computed(() => {
      if (type.value) {
        return store.state.data.proposals.filter(el => el.status === type.value);
      }

      return store.state.data.proposals;
    });

    const loading = computed(() => !store.state.data.proposalsLoaded || store.state.data.loading);

    return {
      loading,
      proposals,
      type,
      options: proposalsTypeOptions.map(el => ({ ...el, class: 'no-hoverable text-capitalize text-subtitle2' }))
    }
  }
});
</script>

<style lang="scss" scoped>
.proposals {
  padding-top: 40px;
  padding-bottom: 100px;
}

.section-header {
  margin-bottom: 46px;
}

.section-title {
  margin: 0 32px 0 0;
}

.filter {
  padding-left: 32px;

  &::v-deep(.q-btn) {
    margin-right: 52px;
  }
}

.proposals-list {
  margin-top: 40px;
}

.toggle-btn-wrapper {
  padding: 16px 0;

  @media screen and (min-width: $breakpoint-md-min) {
    padding: 0;
  }
}
</style>
