<template>
  <div class="ledger-content column items-center">
    <h1 class="title text-body-large text-white text-weight-medium q-mt-none text-center col-12">Ledger Trusted Wallets</h1>

    <q-btn class="connect btn-large text-capitalize text-body2 col-12" unelevated color="accent-2" text-color="white" padding="25px 48px">
      Connect Ledger
      <q-icon class="connect-icon" name="svguse:icons.svg#battery|0 0 24 14" color="secondary" size="22px" />
    </q-btn>

    <h6 class="error text-accent text-weight-medium text-center q-mt-none q-mb-lg col-12">
      There was an error connecting the Ledger Nano.
    </h6>

    <alert-box class="col-12" title="Failed to execute 'requestDevice' on 'USB': Must be handiling a user gesture to show a permission request." />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AlertBox from 'src/components/AlertBox.vue';

export default defineComponent({
  name: 'Ledger',
  components: {
    AlertBox,
  },
})
</script>

<style lang="scss" scoped>
.ledger-content {
  padding-top: 9px;
}

.title {
  margin-bottom: 63px;
}

.connect {
  width: 100%;
  max-width: 236px;
  margin-bottom: 64px;
}

.connect-icon {
  margin-left: 16px;
}

.warning {
  padding: 0 26px;
  margin-top: 47px;
  margin-bottom: 12px;
}
</style>
