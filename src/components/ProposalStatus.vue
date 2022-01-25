<template>
  <q-chip class="status text-uppercase text-weight-medium q-mx-none q-my-none text-body3" :text-color="textColor" :color="color" :outline="outline">
    {{ status }}
  </q-chip>
</template>

<script lang="ts">
import { getProposalStatusColor, getProposalTextStatusColor, getProposalStatusOutline } from 'src/common/status';
import { ProposalStatus } from 'src/models';
import { defineComponent, PropType, computed } from 'vue';

export default defineComponent({
  name: 'ProposalStatus',
  props: {
    status: {
      type: String as PropType<ProposalStatus>,
      required: true
    }
  },
  setup(props) {
    const color = computed(() => getProposalStatusColor(props.status));
    const textColor = computed(() => getProposalTextStatusColor(props.status));
    const outline = computed(() => getProposalStatusOutline(props.status));

    return {
      color,
      textColor,
      outline
    };
  }
});
</script>

<style lang="scss" scoped>
.status {
  padding-left: 16px;
  padding-right: 16px;
  min-height: 24px;
  border-radius: 25px;
  padding-top: 0;
  padding-bottom: 0;

  &.q-chip--outline {
    border-width: 2px;
  }

  &::v-deep(.q-chip__content) {
    line-height: 1;
  }
}
</style>
