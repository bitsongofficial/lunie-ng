<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="body">
      <div class="dialog-header row items-center justify-between full-width">
        <h2 class="title text-body-large text-white q-my-none" v-if="!error && ! success">{{ $t('actions.claim') }}</h2>

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

      <template v-if="!error">
        <q-form class="col column items-center fit no-wrap" @submit="onSubmit" v-if="!success">
          <div class="field-block column full-width" v-for="(reward, index) in totalRewards" :key="index">
            <label class="field-label text-uppercase text-primary text-h6 text-weight-medium">{{ $t('general.amount') }}</label>

            <q-input
              v-model="reward.amount"
              color="transparent-white"
              label-color="accent-5"
              bg-color="transparent-white"
              round
              standout
              no-error-icon
              hide-bottom-space
              disable
              class="quantity-input full-width large"
              :rules="[
                val => !!val || $t('errors.required'),
                val => !isNaN(val) || $t('errors.nan'),
                val => gtnZero(val) || $t('errors.gtnZero'),
                val => compareBalance(val, availableCoins) || $t('errors.balanceMissing'),
                val => !isNegative(val) || $t('errors.negative')
              ]"
            >
              <template v-slot:append>
                <label class="text-body2 text-primary" v-if="reward.networkCoin">{{ reward.denom }}</label>
                <div class="ibc-info" v-else>
                  <q-icon class="info-icon" name="svguse:icons.svg#info|0 0 15 15" size="16px" color="primary" />
                  <q-tooltip anchor="top middle" self="bottom middle">
                    {{ reward.denom }}
                  </q-tooltip>
                </div>
              </template>
            </q-input>
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
              <label class="text-h5 text-capitalize no-pointer-events">{{ $t('actions.cancel') }}</label>
            </q-btn>

            <q-btn type="submit" class="submit btn-medium text-h5" rounded unelevated color="accent-2" text-color="white" padding="15px 20px 14px" :loading="loading">
              {{ $t('actions.claim') }}
            </q-btn>
          </div>
        </q-form>

        <div class="success col column fit" v-else>
          <q-icon class="success-icon" name="svguse:icons.svg#check|0 0 70 70" size="64px" color="positive" />

          <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center">{{ $t('success.withdraw') }}</h3>

          <p class="text-h4 text-half-transparent-white text-center">{{ $t('success.withdrawDescription') }}</p>

          <q-btn @click="close" type="a" target="_blank" :href="network.explorerURL + 'txs/' + hash" class="transaction-btn q-mx-auto btn-medium text-body2 text-untransform text-weight-medium" rounded unelevated color="accent-gradient" text-color="white" padding="15px 20px 14px">
            {{ $t('actions.transactions') }}
          </q-btn>
        </div>
      </template>

      <div class="success col column fit" v-else>
        <q-icon class="success-icon" name="svguse:icons.svg#error-outlined|0 0 70 70" size="64px" color="negative" />

        <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center">{{ $t('errors.title') }}</h3>

        <p class="text-h4 text-half-transparent-white word-break-break-word text-center">{{ error }}</p>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Balance, MessageTypes, Reward, SessionType, Validator } from 'src/models';
import { useStore } from 'src/store';
import { defineComponent, ref, computed, PropType } from 'vue';
import { BigNumber } from 'bignumber.js';
import { compareBalance, isNegative, isNaN, gtnZero } from 'src/common/numbers';
import { getRewardsValidators } from 'src/common/ledger';
import { Dictionary } from 'lodash';
export default defineComponent({
  name: 'ClaimDialog',
  props: {
    validator: {
      type: Object as PropType<Validator>,
    }
  },
  emits: [
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const store = useStore();
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const amount = ref<string>('0');
    const hash = ref<string>();
    const success = ref<boolean>(false);
    const error = ref<string>();
    const balance = computed(() => store.getters['data/currentRawBalance'] as Balance | undefined);
    const network = computed(() => store.state.authentication.network);
    const availableCoins = computed(() => {
      return balance.value ? new BigNumber(balance.value.available).toString() : '0';
    });
    const isLedger = computed(() => store.state.authentication.session?.sessionType === SessionType.LEDGER);
    const rewards = computed(() => {
      if (props.validator) {
        return store.state.data.rewards.filter(el => el.validator.operatorAddress === props.validator?.operatorAddress);
      }
      return store.state.data.rewards;
    });
    const validators = computed(() => {
      return getRewardsValidators(rewards.value, isLedger.value);
    });
    const totalRewards = computed(() => {
      let filteredRewards: Reward[] = [];
      filteredRewards = store.state.data.rewards.filter(({ validator }) => {
        return validators.value.includes(validator.operatorAddress);
      });
      const validatorsRewardsObject = (store.getters['data/totalRewardsPerDenomByValidator'] as (rewards: Reward[]) => Dictionary<number>)(filteredRewards);
      const rewardsDenomArray = Object.entries(validatorsRewardsObject);
      return rewardsDenomArray.map(([denom, amount]) => ({
        networkCoin: denom.includes(network.value.stakingDenom),
        denom,
        amount
      }))
      .sort((a, b) => b.amount - a.amount);
    });
    const loading = computed(() => store.state.data.loadingSignTransaction);
    const close = () => {
      dialogRef.value?.hide();
    };
    const onSubmit = async () => {
      try {
        const request = {
          type: MessageTypes.CLAIM_REWARDS,
          amounts: totalRewards.value,
          froms: validators.value
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
      totalRewards,
      isLedger,
      error,
      loading,
      availableCoins,
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
      onSubmit
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
  margin-top: 60px;

  @media screen and (min-width: $breakpoint-md-min) {
    flex-direction: row;
    margin-top: 150px;
  }
}
.ibc-info {
  pointer-events: all;
  cursor: help;
}
</style>
