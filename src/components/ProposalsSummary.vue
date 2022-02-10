<template>
  <div class="proposals-summary">
    <div class="row" :class="{
      'q-gutter-y-md': quasar.screen.lt.md,
      'items-center': !quasar.screen.lt.md
    }">
      <p class="description text-subtitle2 text-half-transparent-white col-12 col-md-6 white-space-break-spaces">
        {{ $t('proposals.empty') }}
      </p>

      <q-btn @click="reset" class="btn-medium text-h6 font-weight-medium col-12 col-md-auto" rounded unelevated color="white" text-color="secondary" padding="12px 28px 10px 29px">
        {{ $t('proposals.allProposals') }}
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
  box-shadow: $full-secondary-box-shadow;
  backdrop-filter: blur(60px);
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
