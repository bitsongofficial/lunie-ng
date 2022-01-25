<template>
  <item :clickable="proposal !== undefined" reverse details v-ripple :to="!loading && proposal ? '/proposals/' + proposal.id : '/'" :disable="!proposal">
    <div class="full-width" :class="{
      'row items-center': !quasar.screen.lt.md,
      'column reverse items-start': quasar.screen.lt.md,
    }">
      <div class="title-content"  v-if="proposal && !loading">
        <h4 class="title text-white text-weight-medium q-my-none">{{ proposal.title }}</h4>
      </div>
      <q-skeleton class="title-skeleton" type="text" width="100%" height="23px" square dark v-else></q-skeleton>

      <proposal-status :status="proposal.status" v-if="proposal && !loading"/>
      <q-skeleton class="status" type="QBadge" width="69px" height="24px" dark v-else></q-skeleton>
    </div>
  </item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Item from 'src/components/Item.vue';
import { Proposal } from 'src/models';
import { useQuasar } from 'quasar';
import { percent } from 'src/common/numbers';
import ProposalStatus from 'src/components/ProposalStatus.vue';

export default defineComponent({
  name: 'ProposalItem',
  components: {
    Item,
    ProposalStatus,
  },
  props: {
    proposal: {
      type: Object as PropType<Proposal>
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const quasar = useQuasar();

    return {
      quasar,
      percent
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

.title-content {
  @media screen and (min-width: $breakpoint-md-min) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 120px);
  }
}

.title,
.title-skeleton {
  margin-bottom: 8px;

  @media screen and (min-width: $breakpoint-md-min) {
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0;
  }
}

.title-skeleton {
  max-width: 260px;
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
