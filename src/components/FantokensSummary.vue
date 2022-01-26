<template>
  <div class="fantokens-summary">
    <div class="row" :class="{
      'q-gutter-y-md': quasar.screen.lt.md,
      'items-center': !quasar.screen.lt.md
    }">
      <p class="description text-subtitle2 text-half-transparent-white col-12 col-md-6">
        No fantokens in your portfolio.<br/>
Try to istance your first fantoken serie.
      </p>

      <q-btn class="btn-medium text-h6 text-weight-medium col-12 col-md-auto" rounded unelevated color="primary" text-color="dark" padding="12px 28px" to="/fantokens/issue">
        CREATE FANTOKEN <q-icon class="validators-icon" name="svguse:icons.svg#arrow-right|0 0 14 14" size="14px" color="dark" />
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FantokensSummary',
  setup() {
    const quasar = useQuasar();

    return {
      quasar,
    }
  }
});
</script>

<style lang="scss" scoped>
.fantokens-summary {
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
