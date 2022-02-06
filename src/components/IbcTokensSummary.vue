<template>
  <div class="ibc-tokens-summary">
    <div class="row" :class="{
      'q-gutter-y-md': quasar.screen.lt.md,
      'items-center': !quasar.screen.lt.md
    }">
      <p class="description text-subtitle2 text-half-transparent-white col-12 col-md-6">
        {{ $t('assets.emptyIbcTokens') }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IbcTokensSummary',
  setup() {
    const quasar = useQuasar();

    return {
      quasar,
    }
  }
});
</script>

<style lang="scss" scoped>
.ibc-tokens-summary {
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
