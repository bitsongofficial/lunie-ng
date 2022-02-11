<template>
  <q-dialog ref="dialogRef" :no-backdrop-dismiss="mintscanLink !== undefined" :no-esc-dismiss="mintscanLink !== undefined" :no-route-dismiss="mintscanLink !== undefined" @hide="onDialogHide">
    <q-card class="body">
      <div class="dialog-header row items-center justify-between full-width">
        <h2 class="title text-body-large text-white q-my-none" v-if="!info">{{ $t(title) }}</h2>

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

      <template v-if="success">
        <div class="success col column fit">
          <q-icon class="success-icon" name="svguse:icons.svg#check|0 0 70 70" size="64px" color="positive" v-if="!info" />
          <q-icon class="success-icon" name="svguse:icons.svg#info|0 0 15 15" size="64px" color="primary" v-else />

          <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center white-space-break-spaces">{{ $t(subtitle, { symbol: 'btsg', network: bridgeNetworkName }) }}</h3>

          <p class="text-h4 text-half-transparent-white word-break-break-word text-center" v-if="description">{{ $t(description) }}</p>

          <q-btn v-if="mintscanLink" @click="close" type="a" target="_blank" :href="mintscanLink" class="transaction-btn q-mx-auto btn-medium text-body2 text-untransform text-weight-medium" rounded unelevated color="accent-gradient" text-color="white" padding="15px 20px 14px">
            {{ $t('actions.transactions') }}
          </q-btn>
        </div>
      </template>

      <div class="success col column fit" v-else>
        <q-icon class="success-icon" name="svguse:icons.svg#error-outlined|0 0 70 70" size="64px" color="negative" v-if="!info" />

        <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center white-space-break-spaces">{{ $t(subtitle, { symbol: 'btsg', network: bridgeNetworkName }) }}</h3>

        <p class="text-h4 text-half-transparent-white word-break-break-word text-center" v-if="description">{{ $t(description) }}</p>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MessageDialog',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    description: {
      type: String,
    },
    mintscan: {
      type: String,
    },
    hash: {
      type: String,
    },
    success: {
      type: Boolean,
      default: true,
    },
    info: {
      type: Boolean,
      default: false,
    }
  },
  emits: [
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const mintscanLink = props.hash && props.mintscan ? `${props.mintscan}/txs/${props.hash}` : undefined;
    const bridgeNetworkName = process.env.VUE_APP_NETWORK_NAME;

    const close = () => {
      dialogRef.value?.hide();
    };

    return {
      bridgeNetworkName,
      mintscanLink,
      dialogRef,
      close,
      onDialogHide
    }
  },
})
</script>

<style lang="scss" scoped>
.dialog-header {
  margin-bottom: 41px;
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

.submit {
  width: 100%;
  margin-top: 12px;

  @media screen and (min-width: $breakpoint-md-min) {
    max-width: 217px;
    margin-left: 34px;
    margin-top: 0;
  }
}

.field-label {
  margin-bottom: 17px;
  padding-left: 11px;
}

.field-block {
  &:not(:last-of-type) {
    margin-bottom: 27px;
  }
}

.max-btn {
  margin-right: 15px;
}

.validator-avatar {
  margin-right: 17px;
  box-shadow: $black-box-shadow;
}

.success-icon {
  margin-top: 23px;
  margin-bottom: 45px;
  margin-left: auto;
  margin-right: auto;
}

.success {
  padding: 0 12px 10px;
}

.transaction-btn {
  width: 100%;
  max-width: 197px;
  margin-top: 36px;
}

.validator-item {
  padding: 16px 24px;
}

.btns {
  display: flex;
  flex-direction: column;

  @media screen and (min-width: $breakpoint-md-min) {
    flex-direction: row;
  }
}
</style>
