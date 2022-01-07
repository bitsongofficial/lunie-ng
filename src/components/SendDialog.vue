<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="body column items-center">
      <div class="dialog-header row items-center justify-between full-width">
        <h2 class="title text-body-large text-white q-my-none">Send</h2>

        <q-btn
          unelevated
          rounded
          text-color="white"
          class="close no-hoverable"
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
            <label class="field-label text-uppercase text-primary text-h6 text-weight-medium">Send To</label>

            <q-input
              v-model="to"
              color="transparent-white"
              label-color="accent-5"
              bg-color="transparent-white"
              round
              standout
              no-error-icon
              hide-bottom-space
              class="full-width large"
              :rules="[val => !!val || 'Field is required', val => isValidAddress(val) || 'Invalid address']"
            >
              <template v-slot:append>
                <q-icon name="svguse:icons.svg#anchor" size="16px" color="gray3" />
              </template>
            </q-input>
          </div>

          <div class="field-block column full-width">
            <label class="field-label text-uppercase text-primary text-h6 text-weight-medium">Amount</label>

            <q-input
              v-model="amount"
              color="transparent-white"
              label-color="accent-5"
              bg-color="transparent-white"
              round
              standout
              no-error-icon
              hide-bottom-space
              class="quantity-input full-width large"
              :rules="[
                val => !!val || 'Required field',
                val => !isNaN(val) || 'Amount must be a decimal value',
                val => gtnZero(val) || 'Amount must be a greater then zero',
                val => compareBalance(val, availableCoins) || 'You don\'t have enough coins',
                val => !isNegative(val) || 'Amount must be greater then zero'
              ]"
            >
              <template v-slot:append>
                <q-btn @click="amount = availableCoins" class="max-btn btn-super-extra-small text-body3" rounded unelevated color="accent-2" text-color="white" padding="4px 7px 3px">
                  MAX
                </q-btn>
                <label class="text-body2 text-primary">{{ network.stakingDenom }}</label>
              </template>
            </q-input>

            <p class="text-body2 text-primary q-px-sm q-mt-sm q-mb-none">Available: {{ availableCoins }} <span class="text-uppercase">{{ network.stakingDenom }}</span></p>
          </div>

          <div class="field-block column full-width justify-start items-start">
            <q-btn
              @click="showAdvanced = !showAdvanced"
              class="no-hoverable col-auto"
              toggle-color="primary"
              flat
              unelevated
              :ripple="false"
              text-color="accent"
              toggle-text-color="white"
              padding="0 0 0 11px"
            >{{ !showAdvanced ? 'Show Advanced' : 'Hide Advanced' }}</q-btn>
          </div>

          <transition
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            mode="out-in"
            appear
          >
            <div class="field-block column full-width" v-if="showAdvanced">
              <label class="field-label text-uppercase text-primary text-h6 text-weight-medium">Note</label>

              <q-input
                v-model="memo"
                color="transparent-white"
                label-color="accent-5"
                bg-color="transparent-white"
                round
                standout
                no-error-icon
                hide-bottom-space
                class="full-width large"
              />
            </div>
          </transition>

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

            <q-btn type="submit" class="submit btn-medium text-h5" rounded unelevated color="accent-2" text-color="white" padding="15px 20px 14px" :loading="loading">
              send
            </q-btn>
          </div>
        </q-form>

        <div class="success col column fit" v-else>
          <q-icon class="success-icon" name="svguse:icons.svg#check|0 0 70 70" size="64px" color="positive" />

          <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm">Success!</h3>

          <p class="text-h4 text-half-transparent-white">You have successfully send your BTSGs.</p>

          <q-btn @click="close" type="a" target="_blank" :href="network.explorerURL + 'txs/' + hash" class="transaction-btn btn-medium text-body2 text-untransform text-weight-medium" rounded unelevated color="accent-gradient" text-color="white" padding="15px 20px 14px">
            See your transaction
          </q-btn>
        </div>
      </template>

      <div class="success col column fit" v-else>
        <q-icon class="success-icon" name="svguse:icons.svg#error-outlined|0 0 70 70" size="64px" color="negative" />

        <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm">Error!</h3>

        <p class="text-h4 text-half-transparent-white">{{ error }}</p>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Balance, MessageTypes } from 'src/models';
import { useStore } from 'src/store';
import { defineComponent, ref, computed } from 'vue';
import { network } from 'src/constants';
import { BigNumber } from 'bignumber.js';
import { compareBalance, isNegative, isNaN, gtnZero } from 'src/common/numbers';
import { isValidAddress } from 'src/common/address';

export default defineComponent({
  name: 'SendDialog',
  emits: [
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const store = useStore();
    const { dialogRef, onDialogHide } = useDialogPluginComponent();

    const to = ref<string>('');
    const memo = ref<string>('');
    const amount = ref<string>('0');
    const hash = ref<string>();
    const success = ref<boolean>(false);
    const showAdvanced = ref<boolean>(false);
    const error = ref<string>();

    const balance = computed(() => store.getters['data/currentBalance'] as Balance | undefined);

    const availableCoins = computed(() => {
      return balance.value ? new BigNumber(balance.value.available).toString() : '0';
    });

    const loading = computed(() => store.state.data.loadingSignTransaction);

    const close = () => {
      dialogRef.value?.hide();
    };

    const onSubmit = async () => {
      try {
        const request = {
          type: MessageTypes.SEND,
          to: to.value,
          memo: memo.value,
          amounts: [{
            amount: amount.value,
            denom: network.stakingDenom
          }],
        };

        const hashres = await store.dispatch('data/signTransaction', request) as string;

        hash.value = hashres;
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
      hash,
      showAdvanced,
      memo,
      to,
      error,
      loading,
      availableCoins,
      network,
      amount,
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
  margin-bottom: 41px;
}

.body {
  width: 100%;
  min-height: 446px;
  max-width: 508px;
  border-radius: 10px;
  background: $alternative;
  padding: 33px 36px 28px;
  box-shadow: $secondary-box-shadow;
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
