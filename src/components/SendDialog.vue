<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="body">
      <div class="dialog-header row items-center justify-between full-width">
        <h2 class="title text-body-large text-white q-my-none" v-if="!error && !success">{{ $t('actions.send') }}</h2>

        <q-btn unelevated rounded text-color="white" class="close no-hoverable q-ml-auto" padding="2px" @click="close">
          <label class="text-body4 text-uppercase no-pointer-events">{{ $t('actions.close') }}</label>
          <q-icon class="close-icon" name="svguse:icons.svg#close|0 0 12 12" size="10px" />
        </q-btn>
      </div>

      <template v-if="!error">
        <q-form class="col column items-center fit no-wrap" @submit="onSubmit" v-if="!success">
          <div class="field-block column full-width">
            <label class="field-label text-uppercase text-primary text-h6 text-weight-medium">{{
              $t('general.sendTo')
            }}</label>

            <q-input v-model="to" color="transparent-white" label-color="accent-5" bg-color="transparent-white" round
              standout no-error-icon hide-bottom-space class="full-width large"
              :rules="[val => !!val || $t('errors.required'), val => isValidAddress(val) || $t('actions.invalidAddress')]">
              <template v-slot:append>
                <q-icon name="svguse:icons.svg#anchor" size="16px" color="gray3" />
              </template>
            </q-input>
          </div>

          <div class="field-block column full-width">
            <label class="field-label text-uppercase text-primary text-h6 text-weight-medium">{{
              $t('general.amount')
            }}</label>

            <q-input v-model="amount" color="transparent-white" label-color="accent-5" bg-color="transparent-white"
              round standout no-error-icon hide-bottom-space class="quantity-input full-width large" :rules="[
                val => !!val || $t('errors.required'),
                val => !isNaN(val) || $t('errors.nan'),
                val => gtnZero(val) || $t('errors.gtnZero'),
                val => compareBalance(val, availableCoins) || $t('errors.balanceMissing'),
                val => !isNegative(val) || $t('errors.negative')
              ]">
              <template v-slot:append>
                <q-btn @click="amount = getMaxAmount()" class="max-btn btn-super-extra-small text-body3" rounded
                  unelevated color="accent-2" text-color="white" padding="4px 7px 3px">
                  {{ $t('actions.max') }}
                </q-btn>
                <label class="text-body2 text-primary" v-if="!denom">{{ network.stakingDenom }}</label>
                <label class="text-body2 text-primary" v-else-if="symbol">{{ symbol }}</label>
              </template>
            </q-input>

            <p class="text-body2 text-primary q-px-sm q-mt-sm q-mb-none">
              {{ $t('general.availableCoins', { amount: denom ? availableCoins.toFixed() : availableCoins.toFormat() })
              }}
              <span class="text-uppercase" v-if="!denom">{{ network.stakingDenom }}</span>
              <span class="text-uppercase" v-else-if="symbol">{{ symbol }}</span>
            </p>
          </div>

          <div class="field-block column full-width justify-start items-start">
            <q-btn @click="showAdvanced = !showAdvanced" class="no-hoverable col-auto" toggle-color="primary" flat
              unelevated :ripple="false" text-color="accent" toggle-text-color="white" padding="0 0 0 11px">{{
              !showAdvanced ? $t('actions.showAdvanced') : $t('actions.hideAdvanced') }}</q-btn>
          </div>

          <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" appear>
            <div class="field-block column full-width" v-if="showAdvanced">
              <label class="field-label text-uppercase text-primary text-h6 text-weight-medium">{{
                $t('general.note')
              }}</label>

              <q-input v-model="memo" color="transparent-white" label-color="accent-5" bg-color="transparent-white"
                round standout no-error-icon hide-bottom-space class="full-width large" />
            </div>
          </transition>

          <div class="btns full-width items-center justify-end q-mt-auto">
            <q-btn unelevated rounded text-color="white" class="close no-hoverable" padding="2px" @click="close">
              <label class="text-h5 text-capitalize no-pointer-events">{{ $t('actions.cancel') }}</label>
            </q-btn>

            <q-btn type="submit" class="submit btn-medium text-h5" rounded unelevated color="accent-2"
              text-color="white" padding="15px 20px 14px" :loading="loading">
              {{ $t('actions.send') }}
            </q-btn>
          </div>
        </q-form>

        <div class="success col column fit" v-else>
          <q-icon class="success-icon" name="svguse:icons.svg#check|0 0 70 70" size="64px" color="positive" />

          <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center">{{
            $t('success.title')
          }}</h3>

          <p class="text-h4 text-half-transparent-white text-center">{{
        $t('success.send', { symbol: symbol ? symbol:
          network.stakingDenom }) }}</p>

          <q-btn @click="close" type="a" target="_blank" :href="network.explorerURL + 'txs/' + hash"
            class="transaction-btn q-mx-auto btn-medium text-body2 text-untransform text-weight-medium" rounded
            unelevated color="accent-gradient" text-color="white" padding="15px 20px 14px">
            {{ $t('actions.transactions') }}
          </q-btn>
        </div>
      </template>

      <div class="success col column fit" v-else>
        <q-icon class="success-icon" name="svguse:icons.svg#error-outlined|0 0 70 70" size="64px" color="negative" />

        <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center">{{
          $t('errors.title')
        }}</h3>

        <p class="text-h4 text-half-transparent-white text-center word-break-break-word">{{ error }}</p>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Balance, MessageTypes } from 'src/models';
import { useStore } from 'src/store';
import { defineComponent, ref, computed } from 'vue';
import { BigNumber } from 'bignumber.js';
import { compareBalance, isNegative, isNaN, gtnZero } from 'src/common/numbers';
import { isValidAddress } from 'src/common/address';
import { useMaxAmount } from 'src/hooks/useMaxAmount';

export default defineComponent({
  name: 'SendDialog',
  props: {
    denom: {
      type: String,
    },
    symbol: {
      type: String,
    }
  },
  emits: [
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const store = useStore();
    const { dialogRef, onDialogHide } = useDialogPluginComponent();

    const to = ref<string>('');
    const memo = ref<string>('');
    const amount = ref<string>('0');
    const hash = ref<string>();
    const success = ref<boolean>(false);
    const showAdvanced = ref<boolean>(false);
    const error = ref<string>();

    store.commit('data/setLoadingSignTransaction', false);

    const balance = computed(() => {
      if (!props.denom) {
        return store.getters['data/currentRawBalance'] as Balance | undefined;
      }

      const balances = store.state.data.balances;

      return balances.find(el => el.denom === props.denom);
    });

    const network = computed(() => store.state.authentication.network);

    console.log(props.denom)

    const availableCoins = computed(() => {
      if (props.denom) {
        return new BigNumber(balance.value ? balance.value.available : '0').multipliedBy('1e-6');
      }

      return new BigNumber(balance.value ? balance.value.available : '0');
    });

    const loading = computed(() => store.state.data.loadingSignTransaction);

    const close = () => {
      dialogRef.value?.hide();
    };

    const onSubmit = async () => {
      let amt = "0"
      if (props.denom) {
        amt = new BigNumber(amount.value).multipliedBy(1000000).toFixed(0).toString();
      } else {
        amt = new BigNumber(amount.value).toFixed(0).toString();
      }

      try {
        const request = {
          type: MessageTypes.SEND,
          to: to.value,
          memo: memo.value,
          amounts: [{
            amount: amt,
            denom: props.denom ? props.denom : network.value.stakingDenom
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

    console.log(availableCoins.value.toString())

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
      onSubmit,
      ...useMaxAmount(props.denom, availableCoins)
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
