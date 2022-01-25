<template>
  <div class="validators-summary">
    <div class="row" :class="{
      'q-gutter-y-md': quasar.screen.lt.md,
      'items-center': !quasar.screen.lt.md
    }">
      <p class="description text-subtitle2 text-half-transparent-white col-12 col-md-6">
        No validators in your portfolio.<br/>
        Head over the validator list to start staking.
      </p>

      <q-btn to="/validators" class="btn-medium text-h6 font-weight-medium col-12 col-md-auto" rounded unelevated color="full-transparent-white" text-color="white" padding="12px 28px">
        VALIDATOR LIST <q-icon class="validators-icon" name="svguse:icons.svg#arrow-right|0 0 14 14" size="14px" color="primary" />
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ValidatorsSummary',
  setup() {
    const quasar = useQuasar();

    return {
      quasar,
    }
  }
});
</script>

<style lang="scss" scoped>
.validators-summary {
  background: $transparent-gray2;
  border-radius: $generic-border-radius;
  padding: 38px 48px 36px 41px;
}

.validators-icon {
  margin-left: 60px;
}

.description {
  margin-bottom: 0;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-right: auto;
    margin-top: 0;
  }
}
</style>
