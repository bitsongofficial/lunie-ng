<template>
  <item clickable reverse details v-ripple :to="'/proposals/' + proposal.id">
    <div class="row items-center">
      <div class="col-12 col-md-8" :class="{
        'row items-center': !quasar.screen.lt.md,
        'column reverse items-start': quasar.screen.lt.md,
      }">
        <h4 class="title text-white text-weight-medium q-my-none">{{ proposal.title }}</h4>

        <proposal-status :status="proposal.status" />
      </div>

      <q-space />

      <!-- <div class="row items-center col-12 col-md-auto">
        <div class="section row items-center" v-if="voted">
          <p class="section-title text-uppercase text-h6 text-weight-medium text-primary q-my-none">
            voted
          </p>

          <p class="text-h4 text-weight-medium text-white q-my-none">{{ voted }}%</p>
        </div>

        <div class="section row items-center" v-if="quorum">
          <p class="section-title text-uppercase text-h6 text-weight-medium text-primary q-my-none">
            quorum
          </p>

          <p class="text-h4 text-weight-medium text-white q-my-none">{{ quorum }}%</p>
        </div>
      </div> -->
    </div>
  </item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Item from 'src/components/Item.vue';
import { Proposal } from 'src/models';
import { useQuasar } from 'quasar';
import ProposalStatus from 'src/components/ProposalStatus.vue';

export default defineComponent({
  name: 'ProposalItem',
  components: {
    Item,
    ProposalStatus,
  },
  props: {
    proposal: {
      type: Object as PropType<Proposal>,
      required: true
    }
  },
  setup() {
    const quasar = useQuasar();

    return {
      quasar,
    }
  }
});
</script>

<style lang="scss" scoped>
.status {
  margin-bottom: 16px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-left: 34px;
    margin-bottom: 0;
  }
}

.title {
  margin-bottom: 8px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: 0;
  }
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
