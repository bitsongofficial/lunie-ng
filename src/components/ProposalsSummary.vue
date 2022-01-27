<template>
  <div class="proposals-summary">
    <div class="row" :class="{
      'q-gutter-y-md': quasar.screen.lt.md,
      'items-center': !quasar.screen.lt.md
    }">
      <p class="description text-subtitle2 text-half-transparent-white col-12 col-md-6">
        No voting proposals at this moment.<br/>
        Come back in days to see what’s changed.
      </p>

      <q-btn @click="reset" class="btn-medium text-h6 text-weight-medium col-12 col-md-auto" rounded unelevated color="full-transparent-white" text-color="white" padding="12px 28px 10px 29px">
        SEE ALL PROPOSALS
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProposalsSummary',
  emits: ['click'],
  setup(props, { emit }) {
    const quasar = useQuasar();

    const reset = () => {
      emit('click');
    }

    return {
      quasar,
      reset
    }
  }
});
</script>

<style lang="scss" scoped>
.proposals-summary {
  background: $transparent-gray2;
  border-radius: $generic-border-radius;
  padding: 38px 48px 36px 41px;
}

.description {
  margin-bottom: 0;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-right: auto;
    margin-top: 0;
  }
}
</style>
