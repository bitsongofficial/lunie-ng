<template>
  <q-page class="deposit">
    <div class="section-header row items-center">
      <h2 class="section-title text-body-large text-white text-weight-medium col-12 col-md-auto">
        {{ $t('menu.bridge') }}
      </h2>

      <div class="col-auto q-ml-auto" v-if="ethereumAddress">
        <q-btn type="submit" @click="scrollToTable" class="btn-medium-large-small text-body2 full-width text-capitalize" :disable="transactions.length === 0" rounded unelevated color="primary" outline text-color="white" padding="12px 33px">
          {{ $t('actions.pendingTx') }}
        </q-btn>
      </div>
    </div>
    <div class="row items-start justify-center">
      <div class="col-12">
        <div class="form">
          <q-form
            class="column q-col-gutter-y-md"
            @submit="transferRequest.from && transferRequest.from.id !== 'ethereum' ? submit() : ethereumSubmit()"
          >
            <div class="row q-col-gutter-y-md">
              <div class="col-12 col-md-5">
                <p class="text-uppercase text-primary text-h6 text-weight-medium q-mt-none q-mb-sm">{{ $t('general.from') }}</p>

                <q-select
                  v-model="transferRequest.from"
                  rounded
                  standout
                  map-options
                  :options="fromChains"
                  bg-color="transparent-white"
                  color="transparent-white"
                  label-color="primary"
                  class="full-width large"
                  option-label="name"
                  no-error-icon
                  hide-bottom-space
                  :rules="[val => !!val || $t('errors.required')]"
                >
                  <template v-slot:selected-item="{ opt }">
                    <div class="row items-center cursor-pointer">
                      <q-avatar class="coin-avatar" size="32px">
                        <img :src="opt.icon">
                      </q-avatar>

                      <label class="text-white text-body2 cursor-pointer">{{ opt.name }}</label>
                    </div>
                  </template>
                  <template v-slot:option="{ itemProps, opt }">
                    <q-item class="row items-center cursor-pointer bg-secondary q-px-md q-py-sm" v-bind="itemProps">
                      <q-avatar class="coin-avatar" size="32px">
                        <img :src="opt.icon">
                      </q-avatar>

                      <label class="text-white text-body2 cursor-pointer">{{ opt.name }}</label>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="column items-center justify-center col-12 col-md-2 gt-sm">
                <q-icon class="arrow-icon" name="svguse:icons.svg#arrow-right|0 0 14 14" color="white" size="16px" />
              </div>
              <div class="col-12 col-md-5">
                <p class="text-uppercase text-primary text-h6 text-weight-medium q-mt-none q-mb-sm">{{ $t('general.to') }}</p>

                <q-select
                  v-model="transferRequest.to"
                  :disable="!transferRequest.from"
                  rounded
                  standout
                  map-options
                  :options="toChains"
                  bg-color="transparent-white"
                  color="transparent-white"
                  label-color="primary"
                  option-label="name"
                  class="full-width large"
                  no-error-icon
                  hide-bottom-space
                  :rules="[val => !!val || $t('errors.required')]"
                >
                  <template v-slot:selected-item="{ opt }">
                    <div class="row items-center cursor-pointer">
                      <q-avatar class="coin-avatar" size="32px">
                        <img :src="opt.icon">
                      </q-avatar>

                      <label class="text-white text-body2 cursor-pointer">{{ opt.name }}</label>
                    </div>
                  </template>
                  <template v-slot:option="{ itemProps, opt }">
                    <q-item class="row items-center cursor-pointer bg-secondary q-px-md q-py-sm" v-bind="itemProps">
                      <q-avatar class="coin-avatar" size="32px">
                        <img :src="opt.icon">
                      </q-avatar>

                      <label class="text-white text-body2 cursor-pointer">{{ opt.name }}</label>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>

            <transition
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
              mode="out-in"
            >
              <div class="row q-col-gutter-y-md" v-if="transferRequest.from?.id !== 'ethereum' || ethereumAddress">
                <div class="col-12" v-if="transferRequest.from">
                  <p class="text-uppercase text-primary text-h6 text-weight-medium q-mt-none q-mb-sm">{{ $t('general.addressFrom') }}</p>

                  <q-input
                    readonly
                    class="large"
                    color="transparent-gray"
                    label-color="half-transparent-white"
                    bg-color="transparent-gray"
                    rounded
                    standout
                    v-model="transferRequest.fromAddress"
                    no-error-icon
                    hide-bottom-space
                  >
                    <template v-slot:append>
                      <q-icon name="svguse:icons.svg#anchor" size="16px" color="gray3" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12">
                  <p class="text-uppercase text-primary text-h6 text-weight-medium q-mt-none q-mb-sm">{{ $t('general.addressTo') }}</p>

                  <q-input
                    :disable="!transferRequest.to"
                    class="large"
                    color="transparent-gray"
                    label-color="half-transparent-white"
                    bg-color="transparent-gray"
                    rounded
                    standout
                    v-model="transferRequest.toAddress"
                    :rules="[
                      val => !!val || $t('errors.required'),
                      val => !(transferRequest.to && !isValidAddress(val, transferRequest.to.addressPrefix)) || $t('errors.invalidAddress')
                    ]"
                    no-error-icon
                    hide-bottom-space
                  >
                    <template v-slot:append>
                      <q-icon name="svguse:icons.svg#anchor" size="16px" color="gray3" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12">
                  <p class="text-uppercase text-primary text-h6 text-weight-medium q-mt-none q-mb-sm">{{ $t('general.amount') }}</p>

                  <q-input
                    color="transparent-white"
                    label-color="accent-5"
                    bg-color="transparent-white"
                    round
                    standout
                    v-model="transferRequest.amount"
                    no-error-icon
                    hide-bottom-space
                    reverse-fill-mask
                    :disable="!transferRequest.from || !transferRequest.to"
                    :readonly="transferRequest.from"
                    class="quantity-input full-width large"
                    :rules="transferRequest.from && transferRequest.from.id !== 'ethereum' ? [
                      val => !!val || $t('errors.required'),
                      val => !isNaN(val) || $t('errors.nan'),
                      val => gtnZero(val) || $t('errors.gtnZero'),
                      val => compareBalance(val, totalBtsg) || $t('errors.balanceMissing'),
                      val => !isNegative(val) || $t('errors.negative')
                    ] : ethereumAddress ?
                    [
                      val => !!val || $t('errors.required'),
                      val => !isNaN(val) || $t('errors.nan'),
                      val => gtnZero(val) || $t('errors.gtnZero'),
                    ] :
                    []
                    "
                  >
                    <template v-slot:append>
                      <q-btn v-if="transferRequest.from && transferRequest.from.id !== 'ethereum'" @click="maxClick" class="max-btn btn-super-extra-small text-body3 q-mr-md" rounded unelevated color="accent-2" text-color="white" padding="4px 7px 3px">
                        {{ $t('actions.max') }}
                      </q-btn>
                      <label class="text-body2 text-primary text-uppercase">BTSG</label>
                    </template>
                  </q-input>

                  <p class="text-body2 text-primary q-px-sm q-mt-sm q-mb-none">{{ $t('general.availableCoins', { amount: transferRequest.from && transferRequest.from.id !== 'ethereum' ? totalBtsg : (erc20Balance) }) }} <span class="text-uppercase">BTSG</span></p>
                </div>

                <div class="col-12">
                  <alert-box class="col-12 full-width" color="primary" :title="transferRequest.from?.id === 'ethereum' ? $t('general.disclaimerBridgeEthereum') : $t('general.disclaimerBridge')" />
                </div>

                <div class="col-12">
                  <q-checkbox v-model="enableForm" color="primary" dark>
                    <label class="text-subtitle2 text-white text-weight-medium cursor-pointer q-ml-sm">{{ $t('general.risk') }}</label>
                  </q-checkbox>
                </div>
              </div>
            </transition>

            <div class="col-12" v-if="transferRequest.from && transferRequest.from.id !== 'ethereum'">
              <q-btn type="submit" class="btn-medium text-body2 full-width q-mt-md" rounded unelevated color="accent-2" text-color="white" padding="16px 48px" :disable="!enableForm" :loading="sending">
                {{ $t('actions.send') }}
              </q-btn>
            </div>
            <div class="col-12" v-else>
              <q-btn v-if="!ethereumAddress" type="submit" class="btn-medium text-body2 full-width q-mt-md" rounded unelevated color="accent-2" text-color="white" padding="16px 48px" :loading="sending">
                {{ $t('actions.connectWallet') }}
              </q-btn>
              <template v-else>
                <transition
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut"
                  mode="out-in"
                >
                  <q-btn type="submit" v-if="mustApprove || loadingAllowance" :loading="approveLoading || pendingTransactions.length > 0 || loadingAllowance" class="btn-medium text-body2 full-width q-mt-md" :disable="!enableForm || pendingTransactions.length > 0 || loadingAllowance" rounded unelevated color="accent-2" text-color="white" padding="16px 48px">
                    {{ $t('actions.approve') }}
                  </q-btn>
                </transition>
                <q-btn type="submit" :loading="depositLoading || pendingTransactions.length > 1" class="btn-medium text-body2 full-width q-mt-md" :disable="!enableForm || pendingTransactions.length > 0 || mustApprove || loadingAllowance" rounded unelevated color="accent-2" text-color="white" padding="16px 48px">
                  {{ $t('actions.migrate') }}
                </q-btn>
              </template>
            </div>
          </q-form>
        </div>
      </div>

      <div class="col-8" v-if="ethereumAddress && transactions.length > 0" id="transactions-table">
        <transactions-table class="transactions-table" :rows="transactions" />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { compareBalance, isNegative, isNaN, gtnZero } from 'src/common/numbers';
import { isValidAddress } from 'src/common/address';
import { useIbcTransfer, useEthereumTransfer } from 'src/hooks';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';

import AlertBox from 'src/components/AlertBox.vue';
import TransactionsTable from 'src/components/TransactionsTable.vue';
import { SessionType } from 'src/models';

export default defineComponent({
  name: 'Bridge',
  components: {
    AlertBox,
    TransactionsTable
  },
  setup() {
    const {
      fromChains,
      toChains,
      totalBtsg,
      sending,
      transferRequest,
      submit
    } = useIbcTransfer();

    const store = useStore();
    const router = useRouter();
    const enableForm = ref<boolean>(false);

    const maxClick = () => {
      transferRequest.amount = totalBtsg.value;
    };

    store.watch((state) => state.authentication.network, async (currentNet) => {
      if (currentNet.id !== 'bitsong-2b') {
        await router.replace({ name: 'wallet' });
      }
    }, { immediate: true });

    store.watch((state) => state.authentication.session, async (session) => {
      if (session?.sessionType !== SessionType.KEPLR) {
        await router.replace({ name: 'wallet' });
      }
    }, { immediate: true });

    return {
      enableForm,
      transferRequest,
      sending,
      fromChains,
      toChains,
      totalBtsg,
      maxClick,
      isValidAddress,
      compareBalance,
      isNegative,
      isNaN,
      gtnZero,
      submit,
      // Ethereum
      ...useEthereumTransfer(transferRequest)
    }
  }
});
</script>

<style lang="scss" scoped>
.deposit {
  padding-top: 40px;
  padding-bottom: 40px;
}

.section-header {
  margin-top: 0;
  margin-bottom: 16px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: 34px;
  }
}

.section-title {
  margin: 0 auto 0 0;

  @media screen and (min-width: $breakpoint-md-min) {
    margin: 0 32px 0 0;
  }
}

.form {
  background: $transparent-gray2;
  box-shadow: $full-secondary-box-shadow;
  backdrop-filter: blur(60px);
  border-radius: $generic-border-radius;
  padding: 24px;
  width: 100%;

  @media screen and (min-width: $breakpoint-md-min) {
    max-width: 520px;
    margin: 0 auto;
  }
}

.coin-avatar {
  margin-right: 16px;
}

.separator {
  opacity: 0.3;
}

.arrow-icon {
  margin-top: 23px;
}

.transactions-table {
  margin-top: 62px;
}

.countdown {
  margin-top: 20px;
}
</style>
