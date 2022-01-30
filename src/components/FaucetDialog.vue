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
          <div class="field-block column full-width">
            <label class="field-label text-uppercase text-half-transparent-white text-h6 text-weight-medium">AMOUNT TO CLAIM</label>

            <q-input
              v-model="amount"
              color="transparent-white"
              label-color="accent-5"
              bg-color="transparent-white"
              round
              standout
              no-error-icon
              class="quantity-input full-width large"
              :rules="[
                val => !!val || 'Required field',
                val => !isNaN(val) || 'Amount must be a decimal value',
                val => gtnZero(val) || 'Amount must be a greater then zero',
                val => !isNegative(val) || 'Amount must be greater then zero'
              ]"
              placeholder="0"
            >
              <template v-slot:append>
                <label class="text-body2 text-half-transparent-white">{{ network.stakingDenom }}</label>
              </template>
            </q-input>
          </div>

          <pre class="description-block text-half-transparent-white text-h5 scroll scroll--transparent">
            {{ curl }}
          </pre>

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

            <q-btn @click="onCopy(curl)" class="submit btn-medium text-h5" rounded unelevated color="primary" text-color="dark" padding="15px 20px 14px" :loading="loading">
              copy
            </q-btn>
          </div>
        </q-form>

        <div class="success col column fit" v-else>
          <q-icon class="success-icon" name="svguse:icons.svg#check|0 0 70 70" size="86px" color="positive" />

          <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center">Successful withdrawal!</h3>

          <p class="text-h4 text-half-transparent-white text-center">You have successfully withdrawn your {{ network.stakingDenom }}s.</p>
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

/* import AlertBox from './AlertBox.vue'; */
import { BigNumber } from 'bignumber.js';
import { useClipboard } from 'src/hooks';

export default defineComponent({
  name: 'FaucetDialog',
  /* components: {
    AlertBox,
  }, */
  emits: [
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const store = useStore();
    const { onCopy } = useClipboard();
    const { dialogRef, onDialogHide } = useDialogPluginComponent();

    const amount = ref<string>('');
    const success = ref<boolean>(false);
    const error = ref<string>();
    const loading = ref<boolean>(false);

    const network = computed(() => store.state.authentication.network);
    const session = computed(() => store.state.authentication.session);

    const curl = computed(() => {
      const coinRaw = new BigNumber(amount.value);
      const coin = (coinRaw.isNaN() || coinRaw.isNegative()) ? new BigNumber(0) : coinRaw;

      return `curl -X POST -d '{"address": "${session.value?.address ?? ''}", "coins": ["${coin.div(1e-6).toString()}ubtsg"]}' https://faucet.testnet.bitsong.network`;
    });

    const close = () => {
      dialogRef.value?.hide();
    };

    const onSubmit = async () => {
      try {
        loading.value = true;
        await store.dispatch('data/getFaucet', [{
          amount: amount.value,
          denom: network.value.stakingDenom
        }]);

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
      curl,
      error,
      loading,
      network,
      amount,
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
  min-height: 446px;
  max-width: 508px;
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
