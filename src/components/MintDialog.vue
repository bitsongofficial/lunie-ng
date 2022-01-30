<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="body column items-center">
      <div class="dialog-header row items-center justify-between full-width">
        <h2 class="title text-body-large text-white q-my-none" v-if="!error && ! success">Mint</h2>

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
            <label class="field-label text-uppercase text-half-transparent-white text-h6 text-weight-medium">Send To</label>

            <q-input
              v-model="request.to"
              color="transparent-white"
              label-color="accent-5"
              bg-color="transparent-white"
              round
              standout
              no-error-icon
              class="full-width large"
              :rules="[val => !!val || 'Field is required', val => isValidAddress(val) || 'Invalid address']"
            >
              <template v-slot:append>
                <q-icon name="svguse:icons.svg#anchor" size="16px" color="gray3" />
              </template>
            </q-input>
          </div>

          <div class="field-block column full-width">
            <label class="field-label text-uppercase text-half-transparent-white text-h6 text-weight-medium">Amount to mint</label>

            <q-input
              v-model="request.amount"
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
                val => compareBalance(val, availableCoins) || 'You don\'t have enough coins',
                val => !isNegative(val) || 'Amount must be greater then zero'
              ]"
              placeholder="0"
            >
              <template v-slot:append>
                <label class="text-body2 text-half-transparent-white text-uppercase">{{ fantoken.metaData?.display }}</label>
                <q-btn @click="request.amount = availableCoins" class="max-btn btn-super-extra-small text-body3" rounded unelevated color="primary" text-color="white" padding="4px 7px 3px">
                  MAX
                </q-btn>
              </template>
            </q-input>

            <p class="text-body2 text-half-transparent-white text-right q-px-sm q-mt-sm q-mb-none">Available to mint: {{ availableCoins }} <span class="text-uppercase">{{ fantoken.metaData?.display }}</span></p>
          </div>

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

            <q-btn type="submit" class="submit btn-medium text-weight-medium text-h5" rounded unelevated color="primary" text-color="dark" padding="15px 20px 14px" :loading="loading">
              mint
            </q-btn>
          </div>
        </q-form>

        <div class="success col column fit" v-else>
          <q-icon class="success-icon" name="svguse:icons.svg#check|0 0 70 70" size="86px" color="positive" />

          <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center">Success!</h3>

          <p class="text-h4 text-half-transparent-white text-center">You have successfully send your <span class="text-uppercase">{{ fantoken.metaData?.display }}</span>s.</p>
        </div>
      </template>

      <div class="success col column fit" v-else>
        <q-icon class="success-icon" name="svguse:icons.svg#error-outlined|0 0 70 70" size="86px" color="negative" />

        <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center">Error!</h3>

        <p class="text-h4 text-half-transparent-white text-center word-break-break-word">{{ error }}</p>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { TransactionBitsongRequest, FanTokenWithStats, MessageTypes } from 'src/models';
import { useStore } from 'src/store';
import { defineComponent, ref, computed, reactive, PropType } from 'vue';
import { BigNumber } from 'bignumber.js';
import { compareBalance, isNegative, isNaN, gtnZero } from 'src/common/numbers';
import { isValidAddress } from 'src/common/address';
import { getCoinLookup } from 'src/common/network';

export default defineComponent({
  name: 'MintDialog',
  props: {
    fantoken: {
      type: Object as PropType<FanTokenWithStats>,
      required: true,
    }
  },
  emits: [
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const store = useStore();
    const { dialogRef, onDialogHide } = useDialogPluginComponent();

    const request = reactive<TransactionBitsongRequest>({
      to: '',
      amount: ''
    });

    const success = ref<boolean>(false);
    const error = ref<string>();

    store.commit('data/setLoadingSignTransaction', false);

    const network = computed(() => store.state.authentication.network);
    const coinLookup = computed(() => getCoinLookup(network.value.stakingDenom, 'viewDenom'));

    const availableCoins = computed(() => {
      const maxSupply = new BigNumber(props.fantoken.maxSupply);
      const supply = new BigNumber(props.fantoken.supply.amount);
      const burned = new BigNumber(props.fantoken.burned?.amount ?? '0');

      return maxSupply
        .minus(supply)
        .minus(burned)
        .multipliedBy(coinLookup.value?.chainToViewConversionFactor ?? 1e-6);
    });

    const loading = computed(() => store.state.data.loadingSignTransaction);

    const close = () => {
      dialogRef.value?.hide();
    };

    const onSubmit = async () => {
      try {
        const requestToSign = {
          type: MessageTypes.MINT_FANTOKEN,
          message: {
            ...request,
            denom: props.fantoken.metaData?.base ?? ''
          },
        };

        await store.dispatch('data/signBitsongTransaction', requestToSign);

        success.value = true;
      } catch (err) {
        console.error(err);

        if (err instanceof Error) {
          error.value = err.message;
        } else {
          error.value = 'Something went wrong, please try again later';
        }
      }
    }

    return {
      request,
      error,
      loading,
      availableCoins,
      network,
      success,
      dialogRef,
      close,
      compareBalance,
      isValidAddress,
      isNegative,
      isNaN,
      gtnZero,
      onDialogHide,
      onSubmit
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
  margin-left: 16px;
}

.validator-avatar {
  margin-right: 17px;
  box-shadow: $black-box-shadow;
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
