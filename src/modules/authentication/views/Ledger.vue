<template>
  <div class="ledger-content column items-center">
    <h1 class="title text-body-large text-white text-weight-medium q-mt-none text-center col-12">Ledger Trusted Wallets</h1>

    <q-btn @click="signIn" :disable="!isChromiumBrowser || !account" :loading="loading" class="connect btn-large text-capitalize text-body2 col-12" unelevated color="accent-2" text-color="white" padding="25px 48px">
      Connect Ledger
      <q-icon class="connect-icon" name="svguse:icons.svg#battery|0 0 24 14" color="secondary" size="22px" />
    </q-btn>

    <template v-if="error">
      <h6 class="error text-accent text-weight-medium text-center q-mt-none q-mb-lg col-12">
        There was an error connecting the Ledger Nano.
      </h6>

      <alert-box class="col-12 full-width" :title="error" />
    </template>
    <template v-else-if="isWindows && !hasHIDEnabled">
      <h6 class="error text-accent text-weight-medium text-center q-mt-none q-mb-lg col-12">
        Due to recent Ledger updates, using a Ledger on Windows now requires "Experimental Web Platform features" to be enabled.
      </h6>

      <alert-box class="col-12 full-width" v-if="isChrome" :title="chromeError" @click="onCopy(hidFeatureLink)" clickable />
    </template>
    <template v-else-if="isLinux">
      <alert-box class="col-12 full-width" :title="linuxError" @click="onCopy(linuxLedgerConnectionLink)" clickable />
    </template>

    <template v-if="!isChromiumBrowser">
      <alert-box class="col-12 q-mt-sm full-width" title="Please use Chrome or Brave, Ledger is not supported in this browser." />
    </template>

    <template v-if="!account && !error">
      <alert-box class="col-12 q-mt-sm full-width" title="No accounts found" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useLedger, useClipboard } from 'src/hooks';

import AlertBox from 'src/components/AlertBox.vue';

export default defineComponent({
  name: 'Ledger',
  components: {
    AlertBox,
  },
  setup() {
    return {
      ...useLedger(),
      ...useClipboard()
    }
  }
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
