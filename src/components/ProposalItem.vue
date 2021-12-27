<template>
  <item clickable details v-ripple :to="to">
    <div class="row items-center no-wrap">
      <h4 class="text-white text-weight-medium q-my-none">{{ title }}</h4>

      <q-chip class="proposal-status status text-uppercase text-weight-medium q-mx-none q-my-none text-body3" text-color="white" :color="statusColor" v-if="status">
        {{ status }}
      </q-chip>

      <q-space />

      <div class="section row items-center" v-if="voted">
        <p class="section-title text-uppercase text-body3 text-weight-medium text-primary q-my-none">
          voted
        </p>

        <p class="text-h4 text-weight-medium text-white q-my-none">{{ voted }}%</p>
      </div>

      <div class="section row items-center" v-if="quorum">
        <p class="section-title text-uppercase text-body3 text-weight-medium text-primary q-my-none">
          quorum
        </p>

        <p class="text-h4 text-weight-medium text-white q-my-none">{{ quorum }}%</p>
      </div>
    </div>
  </item>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import Item from 'src/components/Item.vue';
import { ProposalStatus } from 'src/models';

export default defineComponent({
  name: 'ProposalItem',
  components: {
    Item,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    to: {
      type: String,
    },
    status: {
      type: String as PropType<ProposalStatus | string>,
    },
    voted: {
      type: Number,
    },
    quorum: {
      type: Number,
    },
  },
  setup(props) {
    const statusColor = computed(() => {
      switch (props.status) {
        case ProposalStatus.DEPOSIT:
        case ProposalStatus.PASSED:
          return 'info';
        case ProposalStatus.REJECTED:
          return 'negative';
        case ProposalStatus.VOTING:
          return 'accent-2';
        default:
          return 'gray2';
      }
    });

    return {
      statusColor,
    }
  }
});
</script>

<style lang="scss" scoped>
.status {
  margin-left: 34px;
}

.section {
  margin-right: 17px;

  &:last-of-type {
    margin-right: 9px;
  }
}

.section-title {
  margin-right: 14px;
}
</style>
