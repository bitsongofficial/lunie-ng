<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="body column items-center">
      <div class="dialog-header row items-center justify-between full-width">
        <h2 class="title text-body-large text-white q-my-none" v-if="title">{{ title }}</h2>

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

      <q-form class="col column items-center fit" @submit="success = true" v-if="!success">
        <div class="field-block column full-width">
          <label class="field-label text-uppercase text-primary text-h6 text-weight-medium">{{ toLabel }}</label>

          <q-select
            v-model="to"
            rounded
            standout
            map-options
            :options="validators"
            :disable="defaultTo !== undefined"
            bg-color="transparent-white"
            color="transparent-white"
            label-color="primary"
            class="full-width large"
            no-error-icon
            hide-bottom-space
            :options-cover="false"
            :rules="[val => !!val || 'Required field']"
          >
            <template v-slot:selected-item="{ opt }">
              <div class="row items-center cursor-pointer">
                <q-avatar class="validator-avatar" size="26px" :color="opt.picture ? 'transparent' : 'primary'" v-if="opt">
                  <img :src="opt.picture" v-if="opt.picture">
                  <p class="text-subtitle2 text-uppercase q-my-none" v-if="opt.name">
                    {{ opt.name[0] }}
                  </p>
                </q-avatar>

                <label class="text-white text-body2 cursor-pointer">{{ opt.name }}</label>
              </div>
            </template>
            <template v-slot:option="{ itemProps, opt }">
              <q-item class="validator-item row items-center cursor-pointer bg-secondary" v-bind="itemProps">
                <q-avatar class="validator-avatar" size="26px" :color="opt.picture ? 'transparent' : 'primary'">
                  <img :src="opt.picture" v-if="opt.picture">
                  <p class="text-subtitle2 text-uppercase q-my-none" v-if="opt.name">
                    {{ opt.name[0] }}
                  </p>
                </q-avatar>

                <label class="text-white text-body2 cursor-pointer">{{ opt.name }}</label>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="field-block column full-width">
          <label class="field-label text-uppercase text-primary text-h6 text-weight-medium">{{ amountLabel }}</label>

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

        <div class="btns full-width items-center justify-end q-mt-auto">
          <q-btn
            unelevated
            rounded
            text-color="white"
            class="close no-hoverable"
            padding="2px"
            @click="close"
          >
            <label class="text-h5 text-capitalize no-pointer-events">{{ cancel }}</label>
          </q-btn>

          <q-btn type="submit" class="submit btn-medium text-h5" rounded unelevated color="accent-2" text-color="white" padding="15px 20px 14px">
            {{ submit }}
          </q-btn>
        </div>
      </q-form>

      <div class="success col column fit" v-else>
        <q-icon class="success-icon" name="svguse:icons.svg#check|0 0 70 70" size="64px" color="accent" />

        <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm">{{ successTitle }}</h3>

        <p class="text-h4 text-half-transparent-white">{{ successSubtitle }}</p>

        <q-btn type="submit" class="transaction-btn btn-medium text-body2 text-untransform text-weight-medium" rounded unelevated color="accent-gradient" text-color="white" padding="15px 20px 14px">
          See your transaction
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { Balance, Validator } from 'src/models';
import { useStore } from 'src/store';
import { defineComponent, ref, computed, PropType } from 'vue';
import { network } from 'src/constants';
import { BigNumber } from 'bignumber.js';
import { compareBalance, isNegative, isNaN } from 'src/common/numbers';

export default defineComponent({
  name: 'Dialog',
  props: {
    title: {
      type: String,
    },
    cancel: {
      type: String,
      default: 'Cancel'
    },
    submit: {
      type: String,
      default: 'Confirm'
    },
    toLabel: {
      type: String,
      default: 'Stake to'
    },
    amountLabel: {
      type: String,
      default: 'Amount to stake'
    },
    successTitle: {
      type: String,
      default: 'Successfully staked'
    },
    successSubtitle: {
      type: String,
      default: 'You have successifully staked your BTSGs.'
    },
    defaultTo: {
      type: Object as PropType<Validator>
    },
    defaultFrom: {
      type: Object as PropType<Validator>
    }
  },
  emits: [
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const store = useStore();
    const { dialogRef, onDialogHide } = useDialogPluginComponent();

    const validators = computed(() => store.getters['data/activeValidators'] as Validator[]);
    const balance = computed(() => store.getters['data/currentBalance'] as Balance | undefined);
    const availableCoins = computed(() => balance.value ? new BigNumber(balance.value.available).toString() : '0');

    const to = ref<Validator | undefined>(props.defaultTo);
    const amount = ref<string>('0');
    const success = ref<boolean>(false);

    const close = () => {
      dialogRef.value?.hide();
    };

    return {
      availableCoins,
      balance,
      network,
      validators,
      to,
      amount,
      success,
      dialogRef,
      close,
      compareBalance,
      isNegative,
      isNaN,
      onDialogHide
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
