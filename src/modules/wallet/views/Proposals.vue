<template>
  <q-page class="proposals">
    <div class="section-header row items-center no-wrap">
      <h2 class="section-title text-body-large text-white">
        Proposals
      </h2>
    </div>

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
    />

    <q-list class="proposals-list">
      <proposal-item title="Increase minimum commission rate to 5%" to="/proposals/1" status="voting" :voted="24" :quorum="50" />
      <proposal-item title="Enable IBC Transfer" status="passed" :voted="12" :quorum="20" />
      <proposal-item title="Decrease of voting period" status="rejected" :voted="24" :quorum="20" />
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { proposalsTypeOptions } from 'src/constants';
import ProposalItem from 'src/components/ProposalItem.vue';

export default defineComponent({
  name: 'Proposals',
  components: {
    ProposalItem,
  },
  setup() {
    const type = ref<string>('all');

    return {
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
  padding-left: 32px;
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
</style>
