<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="body column items-center no-wrap">
      <div class="dialog-header row items-center justify-between full-width">
        <h2 class="title text-body-large text-white q-my-none">{{ $t('actions.receive') }}</h2>

        <q-btn
          unelevated
          rounded
          text-color="white"
          class="close no-hoverable q-ml-auto"
          padding="2px"
          @click="close"
        >
          <label class="text-body4 text-uppercase no-pointer-events">{{ $t('actions.close') }}</label>
          <q-icon class="close-icon" name="svguse:icons.svg#close|0 0 12 12" size="10px" />
        </q-btn>
      </div>

      <div class="qr-code">
        <qr-code class="svg" tag="svg" :value="address" :size="240" :margin="1" level="M"></qr-code>
      </div>

      <div class="row justify-between items-end full-width footer no-wrap">
        <div class="column">
          <p class="address-title text-caption-2 text-half-transparent-white text-weight-medium">{{ $t('general.publicAddress') }}</p>
          <p class="address text-body2 text-white word-break-break-word">{{ address }}</p>
        </div>

        <q-btn class="copy-btn btn-medium-extra-small text-caption" rounded unelevated color="accent-2" text-color="white" padding="4px 16px" @click="onCopy(address)">
          {{ $t('actions.copy') }}
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { defineComponent } from 'vue';
import { formatShortAddress } from 'src/common/address';
import { useClipboard } from 'src/hooks';

import QrCode from 'qrcode.vue';

export default defineComponent({
  name: 'QrCodeDialog',
  components: {
    QrCode,
  },
  props: {
    address: {
      type: String,
      required: true
    },
  },
  emits: [
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const { onCopy } = useClipboard();

    const close = () => {
      dialogRef.value?.hide();
    };

    return {
      dialogRef,
      close,
      onDialogHide,
      formatShortAddress,
      onCopy
    }
  },
})
</script>

<style lang="scss" scoped>
.dialog-header {
  margin-bottom: 14px;
}

.body {
  width: 100%;
  max-width: 508px;
  border-radius: 10px;
  background: $alternative-4;
  padding: 33px 36px 28px;
  box-shadow: $secondary-box-shadow;
}

.close {
  opacity: 0.4;
}
.close-icon {
  margin-left: 15px;
}

.qr-code {
  display: flex;
  padding: 12px;
  border-radius: 20px !important;
  background-color: $full-transparent-white;

  & .svg {
    border-radius: 6px;
  }
}

.footer {
  margin-top: 26px;
}

.address-title {
  margin-top: 0;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.address {
  margin: 0;
}

.copy-btn {
  min-width: 62px !important;
  margin-left: 24px;
}
</style>
