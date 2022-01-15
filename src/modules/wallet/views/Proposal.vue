<template>
  <q-page class="proposal">
    <proposal-status v-if="proposal" :status="proposal.status" />

    <div class="row proposal-header justify-between">
      <div class="column col-12 col-md-9">
        <h2 class="title text-body-large text-weight-medium text-white">
          {{ proposal?.title }}
        </h2>

        <p class="description text-h5 text-accent">
          {{ proposal?.summary }}
        </p>
      </div>

      <div class="column col-12 col-md-3 items-end q-ml-auto" v-if="proposal">
        <template v-if="session && session.sessionType !== 'explore'">
          <q-btn v-if="proposal.status === 'DEPOSIT'" @click="openDepositDialog" class="vote-btn btn-large text-weight-medium text-subtitle2" rounded unelevated color="accent-2" text-color="white" padding="10px 28px">
            deposit
          </q-btn>
          <q-btn v-else @click="openVoteDialog" :disable="proposal.status !== 'VOTING'" class="vote-btn btn-large text-weight-medium text-subtitle2" rounded unelevated color="accent-2" text-color="white" padding="10px 28px">
            vote
          </q-btn>
        </template>

        <q-btn @click="onCopy(href)" class="copy-btn btn-small text-untransform text-h6" rounded unelevated color="alternative-3" text-color="white" padding="11px 20px 10px">
          Copy link

          <q-icon class="q-ml-md" name="svguse:icons.svg#attachment|0 0 24 12" size="16px" color="white" />
        </q-btn>
      </div>
    </div>

    <div class="section-header row items-center justify-between" v-if="proposal">
      <h3 class="text-h4 text-weight-medium text-white q-my-none">Vote</h3>

      <div class="row items-center">
        <div class="row items-center" v-if="proposal.tally && proposal.tally.totalVotedPercentage !== -1">
          <h5 class="section-detail-title text-h6 text-primary text-weight-medium q-my-none">VOTED</h5>
          <p class="text-h4 text-white text-weight-medium q-my-none">{{ proposal.tally ? percent(proposal.tally.totalVotedPercentage) : 'N/A' }}</p>
        </div>

        <div class="row items-center q-ml-md">
          <h5 class="section-detail-title text-h6 text-primary text-weight-medium q-my-none">QUORUM</h5>
          <p class="text-h4 text-white text-weight-medium q-my-none">{{ proposal.detailedVotes ? percent(proposal.detailedVotes.votingQuorum) : 'N/A' }}</p>
        </div>
      </div>
    </div>

    <vote-card class="section" :dataset="dataset" v-if="dataset.length > 0" />

    <template v-if="entries.length > 0">
      <div class="section-header row items-center justify-between">
        <h3 class="text-h4 text-weight-medium text-white q-my-none">Timeline</h3>
      </div>

      <timeline class="section" :entries="entries" />
    </template>

    <div class="section-header row items-center justify-between">
      <h3 class="text-h4 text-weight-medium text-white q-my-none">Description</h3>
    </div>

    <pre class="proposal-description description-block text-half-transparent-white text-h5" v-html="description"></pre>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { ChartData, TimelineData } from 'src/models';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
import { getMappedTimeline, getMappedVotes } from 'src/common/chart';
import { useClipboard } from 'src/hooks';
import { percent } from 'src/common/numbers';
import { useQuasar } from 'quasar';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

import VoteCard from 'src/components/VoteCard.vue';
import Timeline from 'src/components/Timeline.vue';
import ProposalStatus from 'src/components/ProposalStatus.vue';
import DepositDialog from 'src/components/DepositDialog.vue';
import VoteDialog from 'src/components/VoteDialog.vue';

export default defineComponent({
  name: 'Proposal',
  components: {
    VoteCard,
    Timeline,
    ProposalStatus
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const quasar = useQuasar();
    const store = useStore();
    const router = useRouter();
    const proposalID = parseInt(props.id);

    const session = computed(() => store.state.authentication.session);

    const proposal = computed(() => store.state.data.proposals.find(el => el.id === proposalID));

    const description = computed(() => marked(sanitizeHtml(proposal.value?.description ?? '').replace(/\\n/gm, '\n')));

    const dataset = computed<ChartData[]>(() => {
      if (proposal.value && proposal.value.detailedVotes) {
        return getMappedVotes(proposal.value.detailedVotes);
      }

      return [];
    });

    const entries = computed<TimelineData[]>(() => {
      if (proposal.value && proposal.value.detailedVotes) {
        return getMappedTimeline(proposal.value.detailedVotes);
      }

      return [];
    });

    const openDepositDialog = () => {
      quasar.dialog({
        component: DepositDialog,
        componentProps: {
          proposalId: proposal.value?.proposalId
        },
        fullWidth: true,
        maximized: true,
      });
    }

    const openVoteDialog = () => {
      quasar.dialog({
        component: VoteDialog,
        componentProps: {
          proposalId: proposal.value?.proposalId
        },
        fullWidth: true,
        maximized: true,
      });
    }

    onMounted(async () => {
      if (proposal.value === undefined) {
        await router.replace({ name: 'wallet' });
      }
    });

    return {
      session,
      proposal,
      description,
      dataset,
      entries,
      href: window.location.href,
      percent,
      openDepositDialog,
      openVoteDialog,
      ...useClipboard()
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
  margin-top: 24px;
  margin-bottom: 16px;
  width: 126px;
  border-radius: 40px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-top: 6px;
  }
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
  word-break: break-word;
  white-space: pre-wrap;
  background-color: $transparent-gray;
  backdrop-filter: blur(60px);
  border-radius: 10px;
  padding: 32px 38px;
}
</style>
