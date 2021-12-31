<template>
  <q-page class="proposal">
    <q-chip class="proposal-status status text-uppercase text-weight-medium q-mx-none q-my-none text-body3" text-color="white" color="info">
      passed
    </q-chip>

    <div class="row proposal-header justify-between">
      <div class="column">
        <h2 class="title text-body-large text-weight-medium text-white">
          Increase minimum commission rate to 5%
        </h2>

        <p class="description text-h5 text-accent">
          This is a text proposal. Text proposals can be proposed by anyone and are used as a signalling mechanism for this community. If this proposal is accepted, nothing will change without community coordination.
        </p>
      </div>

      <div class="column items-end q-ml-auto">
        <q-btn class="vote-btn btn-large text-weight-medium text-subtitle2" rounded unelevated color="accent-2" text-color="white" padding="10px 28px">
          vote
        </q-btn>

        <q-btn class="copy-btn btn-small text-untransform text-h6" rounded unelevated color="alternative-3" text-color="white" padding="11px 20px 10px">
          Copy link

          <q-icon class="q-ml-md" name="svguse:icons.svg#attachment|0 0 24 12" size="16px" color="white" />
        </q-btn>
      </div>
    </div>

    <div class="section-header row items-center justify-between">
      <h3 class="text-h4 text-weight-medium text-white q-my-none">Vote</h3>

      <div class="row items-center">
        <div class="row items-center">
          <h5 class="section-detail-title text-h6 text-primary text-weight-medium q-my-none">VOTED</h5>
          <p class="text-h4 text-white text-weight-medium q-my-none">24%</p>
        </div>

        <div class="row items-center q-ml-md">
          <h5 class="section-detail-title text-h6 text-primary text-weight-medium q-my-none">QUORUM</h5>
          <p class="text-h4 text-white text-weight-medium q-my-none">20%</p>
        </div>
      </div>
    </div>

    <vote-card class="section" :dataset="dataset" />

    <div class="section-header row items-center justify-between">
      <h3 class="text-h4 text-weight-medium text-white q-my-none">Timeline</h3>
    </div>

    <timeline class="section" :entries="entries" />

    <div class="section-header row items-center justify-between">
      <h3 class="text-h4 text-weight-medium text-white q-my-none">Description</h3>
    </div>

    <div class="description-block text-half-transparent-white text-h5">
      Increase the minimum commission rate to 5%. This will help provide network stability and stop 0% validators driving commissions down. It also ensures Validators are earning enough to support secure and stable validation.
<br/><br/>
If this proposal is accepted, it will imply having to update the blockchain so that it is possible to modify the commission of all validators automatically (see the Osmosis and/or Stargaze fork)
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ChartData, TimelineData } from 'src/models';

import VoteCard from 'src/components/VoteCard.vue';
import Timeline from 'src/components/Timeline.vue';

export default defineComponent({
  name: 'Proposal',
  components: {
    VoteCard,
    Timeline
},
  setup() {
    const dataset = ref<ChartData[]>([
      {
        label: 'Yes',
        color: 'white',
        value: 34.65
      },
      {
        label: 'No',
        color: 'primary',
        value: 12.12
      },
      {
        label: 'No with veto',
        color: 'accent-2',
        value: 23.87
      },
      {
        label: 'Abstain',
        color: 'secondary',
        value: 29.36
      },
    ]);

    const entries = ref<TimelineData[]>([
      {
        label: 'Created',
        active: true,
        subtitle: '1 month ago'
      },
      {
        label: 'Deposit Period Ends',
        active: true,
        subtitle: '1 month ago'
      },
      {
        label: 'Voting Period Starts',
        active: false,
        subtitle: '1 month ago'
      },
      {
        label: 'Voting Period Ends',
        active: false,
        subtitle: '1 month ago'
      },
    ]);

    return {
      dataset,
      entries,
    }
  }
});
</script>

<style lang="scss" scoped>
.proposal {
  padding-top: 20px;
  padding-bottom: 100px;
}

.proposal-header {
  margin-bottom: 80px;
}

.title {
  margin: 18px 0 26px 0;
}

.description {
  margin: 0;
  max-width: 400px;
}

.vote-btn {
  margin-top: 6px;
  margin-bottom: 16px;
  width: 126px;
  border-radius: 40px;
}

.copy-btn {
  width: 134px;
  margin-bottom: 6px;
}

.section-header {
  margin-bottom: 24px;
}

.section-detail-title {
  margin-right: 12px;
}

.section {
  margin-bottom: 46px;
}

.description-block {
  background-color: $transparent-gray;
  backdrop-filter: blur(60px);
  border-radius: 10px;
  padding: 32px 38px;
}
</style>
