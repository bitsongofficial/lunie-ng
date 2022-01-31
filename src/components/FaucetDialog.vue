<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="body column items-center">
      <div class="dialog-header row items-center justify-between full-width">
        <h2 class="title text-body-large text-white q-my-none" v-if="!error && ! success">Get BTSG</h2>

        <q-btn
          unelevated
          rounded
          text-color="white"
          class="close no-hoverable q-ml-auto"
          padding="2px"
          @click="close"
        >
          <label class="text-body4 text-uppercase no-pointer-events">close</label>
          <q-icon class="close-icon" name="svguse:icons.svg#close|0 0 12 12" size="10px" />
        </q-btn>
      </div>

      <template v-if="!error">
        <q-form class="col column items-center fit" @submit="onSubmit" v-if="!success">
          <alert-box color="half-transparent-white" title="We reccomend that you verify the network details before proceeding."></alert-box>

          <div class="btns full-width items-center justify-end q-mt-auto">
            <q-btn
              unelevated
              rounded
              text-color="white"
              class="close no-hoverable"
              padding="2px"
              @click="close"
            >
              <label class="text-h5 text-capitalize no-pointer-events">cancel</label>
            </q-btn>

            <q-btn type="submit" class="submit btn-medium text-h5" rounded unelevated color="primary" text-color="dark" padding="15px 20px 14px" :loading="loading">
              claim
            </q-btn>
          </div>
        </q-form>

        <div class="success col column fit" v-else>
          <q-icon class="success-icon" name="svguse:icons.svg#check|0 0 70 70" size="86px" color="positive" />

          <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center">Successful claim!</h3>

          <p class="text-h4 text-half-transparent-white text-center">You have successfully claim your {{ network.stakingDenom }}s.</p>
        </div>
      </template>

      <div class="success col column fit" v-else>
        <q-icon class="success-icon" name="svguse:icons.svg#error-outlined|0 0 70 70" size="86px" color="negative" />

        <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center">Error!</h3>

        <p class="text-h4 text-half-transparent-white word-break-break-word text-center">{{ error }}</p>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { useStore } from 'src/store';
import { defineComponent, ref, computed } from 'vue';
import { compareBalance, isNegative, isNaN, gtnZero } from 'src/common/numbers';

import AlertBox from './AlertBox.vue';
import { useClipboard } from 'src/hooks';

export default defineComponent({
  name: 'FaucetDialog',
  components: {
    AlertBox,
  },
  emits: [
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const store = useStore();
    const { onCopy } = useClipboard();
    const { dialogRef, onDialogHide } = useDialogPluginComponent();

    const success = ref<boolean>(false);
    const error = ref<string>();
    const loading = ref<boolean>(false);

    const network = computed(() => store.state.authentication.network);

    const close = () => {
      dialogRef.value?.hide();
    };

    const onSubmit = async () => {
      try {
        loading.value = true;
        await store.dispatch('data/getFaucet');

        success.value = true;
      } catch (err) {
        console.error(err);

        if (err instanceof Error) {
          error.value = err.message;
        } else {
          error.value = 'Something went wrong, please try again later';
        }
      } finally {
        loading.value = false;
      }
    }

    return {
      error,
      loading,
      network,
      success,
      dialogRef,
      close,
      compareBalance,
      isNegative,
      isNaN,
      gtnZero,
      onDialogHide,
      onSubmit,
      onCopy
    }
  },
})
</script>

<style lang="scss" scoped>
.title {
  padding-left: 9px;
}

.dialog-header {
  margin-bottom: 40px;
}

.close {
  opacity: 0.5;
}

.body {
  width: 100%;
  min-height: 280px;
  max-width: 510px;
  border-radius: 10px;
  background: $dark-2;
  padding: 33px 36px 28px;
}

.close-icon {
  margin-left: 16px;
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
  margin-bottom: 14px;
  padding-left: 11px;
}

.field-block {
  &:not(:last-of-type) {
    margin-bottom: 26px;
  }
}

.max-btn {
  margin-left: 16px;
}

.success-icon {
  margin-top: 30px;
  margin-bottom: 86px;
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

.btns {
  display: flex;
  flex-direction: column;

  @media screen and (min-width: $breakpoint-md-min) {
    flex-direction: row;
  }
}

.ibc-info {
  pointer-events: all;
  cursor: help;
}

.description-block {
  word-break: break-word;
  white-space: nowrap;
  background-color: $transparent-gray;
  backdrop-filter: blur(60px);
  border-radius: 10px;
  padding: 26px;
  max-width: 100%;
}
</style>
