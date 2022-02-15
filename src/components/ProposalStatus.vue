<template>
  <q-chip class="status text-uppercase text-weight-medium q-mx-none q-my-none text-body3" text-color="white" :color="color">
    {{ $t(`general.${status.toLowerCase()}`) }}
  </q-chip>
</template>

<script lang="ts">
import { getProposalStatusColor } from 'src/common/status';
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

    return {
      color,
    };
  }
});
</script>

<style lang="scss" scoped>
.status {
  padding-left: 12px;
  padding-right: 12px;
  min-height: 22px;
  border-radius: 25px;
}
</style>
