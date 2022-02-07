<template>
  <q-page class="proposals">
    <div class="section-header row items-center no-wrap">
      <h2 class="section-title text-body-large text-white">
        {{ $t('menu.proposals') }}
      </h2>

      <q-btn :disable="!session || (session && session.sessionType !== 'keplr')" to="/proposals/submit" class="create-btn btn-medium text-h6 q-ml-auto" rounded unelevated color="accent-2" text-color="white" padding="12px 24px 10px 26px">
        {{ $t('actions.createNew') }} <q-icon class="btn-icon q-ml-auto" name="svguse:icons.svg#add|0 0 12 12" size="12px" color="white" />
      </q-btn>
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
        <template v-if="proposals.length > 0 && type !== 'DRAFT'">
          <q-virtual-scroll :items="proposals">
            <template v-slot="{ item }">
              <proposal-item :key="item.id" :proposal="item" />
            </template>
          </q-virtual-scroll>
        </template>
        <template v-else-if="drafts.length > 0 && type === 'DRAFT'">
          <q-virtual-scroll :items="drafts">
            <template v-slot="{ item }">
              <draft-item :key="item.id" :draft="item" />
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
import { useI18n } from 'vue-i18n';

import ProposalItem from 'src/components/ProposalItem.vue';
import DraftItem from 'src/components/DraftItem.vue';
import ProposalsSummary from 'src/components/ProposalsSummary.vue';

export default defineComponent({
  name: 'Proposals',
  components: {
    ProposalItem,
    ProposalsSummary,
    DraftItem
  },
  setup() {
    const i18n = useI18n();
    const store = useStore();
    const type = ref<ProposalStatus | string>();

    const proposals = computed(() => {
      if (type.value) {
        return store.state.data.proposals.filter(el => el.status === type.value);
      }

      return store.state.data.proposals;
    });

    const drafts = computed(() => store.state.proposal.drafts);

    const session = computed(() => store.state.authentication.session);

    const loading = computed(() => !store.state.data.proposalsLoaded || store.state.data.loading);

    return {
      drafts,
      session,
      loading,
      proposals,
      type,
      options: proposalsTypeOptions.map(el => ({
        ...el,
        label: i18n.t(el.label),
        class: 'no-hoverable text-capitalize text-subtitle2'
      }))
    };
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
  min-height: 26px;
  padding-left: 32px;

  &::v-deep(.q-btn) {
    margin-right: 52px;
    position: relative;

    &:last-of-type {
      margin-right: 0;
      margin-left: 45px;

      &::before {
        content: '';
        position: absolute;
        width: 1px;
        height: 26px;
        background: $full-transparent-white;
        left: -46px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
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

.create-btn {
  width: 100%;
  max-width: 168px;
}

.btn-icon {
  opacity: 0.5;
}
</style>
