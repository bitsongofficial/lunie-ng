<template>
  <q-page class="bridge deposit">
    <div class="section-header row items-center">
      <div class="col-12 col-md-auto">
        <h2 class="section-title text-body-large text-white col-12 col-md-auto">
          Bridge
        </h2>
      </div>
    </div>
    <q-form class="column q-col-gutter-y-md" @submit="submit">
      <div class="networks-row form-row">
        <q-select
          v-model="transferRequest.from"
          rounded
          standout
          map-options
          :options="fromChains"
          bg-color="transparent-white"
          color="transparent-white"
          label-color="primary"
          class="full-width xxxl"
          option-label="name"
          no-error-icon
          hide-bottom-space
          popup-content-class="network-menu"
          :menu-offset="[0,12]"
          :rules="[(val) => !!val || 'Required field']"
        >
          <p
            class="select-label text-uppercase text-half-transparent-white text-weight-medium q-mt-none q-mb-sm"
          >
            From
          </p>

          <template v-slot:selected-item="{ opt }">
            <div class="cursor-pointer network-info">
              <q-avatar class="network-avatar" size="40px">
                <img :src="opt.logo" />
              </q-avatar>

              <label class="text-white text-subtitle1 cursor-pointer network-name">{{
                opt.name
              }}</label>
            </div>
          </template>
          <template v-slot:option="{ itemProps, opt }">
            <q-item
              class="row items-center cursor-pointer bg-alternative-4 q-px-md q-py-sm"
              v-bind="itemProps"
            >
              <q-avatar class="network-avatar">
                  <img :src="opt.logo" />
                </q-avatar>

                <label class="text-white text-body2 cursor-pointer">{{
                  opt.name
                }}</label>
            </q-item>
          </template>
        </q-select>
        <div class="arrow-container">
          <q-icon
            class="arrow-icon"
            name="svguse:icons.svg#arrow-right|0 0 14 14"
            color="accent-2"
            size="16px"
          />
        </div>
        <div>
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
            class="full-width xxxl"
            no-error-icon
            hide-bottom-space
            popup-content-class="network-menu"
            :menu-offset="[0,12]"
            :rules="[(val) => !!val || 'Required field']"
          >
            <p
              class="select-label text-uppercase text-primary text-h6 text-weight-medium q-mt-none q-mb-sm"
            >
              To
            </p>
            <template v-slot:selected-item="{ opt }">
              <div class="cursor-pointer network-info">
                <q-avatar class="network-avatar" size="40px">
                  <img :src="opt.logo" />
                </q-avatar>

                <label class="text-white text-subtitle1 cursor-pointer network-name">{{
                  opt.name
                }}</label>
              </div>
            </template>
            <template v-slot:option="{ itemProps, opt }">
              <q-item
                class="row items-center cursor-pointer bg-alternative-4 q-px-md q-py-sm"
                v-bind="itemProps"
              >
                <q-avatar class="network-avatar">
                  <img :src="opt.logo" />
                </q-avatar>

                <label class="text-white text-body2 cursor-pointer">{{
                  opt.name
                }}</label>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>
      <div class="addresses-row form-row">
        <q-input
          readonly
          class="xxl"
          color="transparent-gray"
          placeholder="Sending address"
          label-color="half-transparent-white"
          bg-color="transparent-gray"
          rounded
          standout
          v-model="transferRequest.fromAddress"
          :rules="[
            (val) => !!val || 'Field is required',
            (val) =>
              !(
                transferRequest.from &&
                !isValidAddress(val, transferRequest.from.prefix)
              ) || 'Invalid address',
          ]"
          no-error-icon
          hide-bottom-space
        >
          <template v-slot:append>
            <q-icon
              name="svguse:icons.svg#anchor"
              size="16px"
              color="white"
              class="thirty-opacity"
            />
          </template>
        </q-input>
        <q-input
          class="xxl"
          color="transparent-gray"
          placeholder="Destination address"
          label-color="half-transparent-white"
          bg-color="transparent-gray"
          rounded
          standout
          v-model="transferRequest.toAddress"
          :rules="[
            (val) => !!val || 'Field is required',
            (val) =>
              !(
                transferRequest.to &&
                !isValidAddress(val, transferRequest.to.prefix)
              ) || 'Invalid address',
          ]"
          no-error-icon
          hide-bottom-space
        >
          <template v-slot:append>
            <q-icon
              name="svguse:icons.svg#anchor"
              size="16px"
              color="white"
              class="thirty-opacity"
            />
          </template>
        </q-input>
      </div>
      <div class="amount-row form-row">
        <q-input
          color="transparent-white"
          label-color="accent-5"
          bg-color="transparent-white"
          round
          standout
          v-model="transferRequest.amount"
          no-error-icon
          reverse-fill-mask
          :disable="!transferRequest.from || !transferRequest.to"
          class="quantity-input xxxl full-width"
          :rules="[
            (val) => !!val || 'Required field',
            (val) => !isNaN(val) || 'Amount must be a decimal value',
            (val) => gtnZero(val) || 'Amount must be a greater then zero',
            (val) =>
              compareBalance(val, totalBtsg) || 'You don\'t have enough coins',
            (val) => !isNegative(val) || 'Amount must be greater then zero',
          ]"
        >
          <template v-slot:append>
            <q-btn
              @click="maxClick"
              class="max-btn btn-super-extra-small q-mr-md"
              rounded
              unelevated
              color="accent-2"
              text-color="white"
            >
              MAX
            </q-btn>
            <label class="text-subtitle2 text-primary text-uppercase">BTSG</label>
          </template>
        </q-input>
        <p class="text-body2 text-primary q-px-sm q-mt-sm q-mb-none owned-quantity">
          Your balance is {{ totalBtsg }}
          <span class="text-uppercase">BTSG</span>
        </p>
      </div>
      <div class="alert-row form-row">
        <alert-box color="thirty-transparent-white" :title="alertMessage" iconFontSize="16px" textClasses="text-body2"/>
      </div>
      <div class="form-row accept-and-swap">
        <q-checkbox v-model="enableForm" color="primary" dark>
          <label
            class="text-subtitle2 text-white text-weight-medium cursor-pointer q-ml-sm"
            >I've read the alert and understood the risk</label
          >
        </q-checkbox>
        <q-btn
          type="submit"
          class="btn-medium text-body2"
          rounded
          unelevated
          color="accent-2"
          text-color="white"
          padding="16px 48px"
          :loading="sending"
          :disable="!enabledWallet || !enableForm"
        >
          {{ enabledWallet ? 'Send' : 'Connect Wallet' }}
        </q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  isValidAddress,
  compareBalance,
  isNegative,
  isNaN,
  gtnZero,
} from 'src/util';
import { useTransferIBC } from 'src/hooks/useTransferIBC';

import AlertBox from 'src/components/AlertBox.vue';

export default defineComponent({
  name: 'Deposit',
  components: {
    AlertBox,
  },
  setup() {
    const {
      enabledWallet,
      fromChains,
      toChains,
      totalBtsg,
      sending,
      transferRequest,
      submit,
    } = useTransferIBC();

    const enableForm = ref<boolean>(false);

    const moneyFormatForComponent = {
      decimal: '.',
      thousands: '',
      precision: 6,
      disableNegative: true,
      masked: true,
    };

    const maxClick = () => {
      transferRequest.amount = totalBtsg.value;
    };

    const alertMessage =
      'This is a newly developed tool and Bitsong assumes no responsability for bugs or token losses due to inappropriate us of it. Before executing transactions with a large amount of tokens it is highly reccomended to test the tool with smaller amounts.';

    return {
      enableForm,
      enabledWallet,
      moneyFormatForComponent,
      transferRequest,
      sending,
      fromChains,
      toChains,
      totalBtsg,
      alertMessage,
      maxClick,
      isValidAddress,
      compareBalance,
      isNegative,
      isNaN,
      gtnZero,
      submit,
    };
  },
});
</script>

<style lang="scss" scoped>
.deposit {
  padding-top: 20px;
}

.form {
  background: $transparent-gray2;
  box-shadow: $full-secondary-box-shadow;
  backdrop-filter: blur(60px);
  border-radius: $generic-border-radius;
  padding: 24px;
}

.networks-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 30px;
  position: relative;

  .select-label {
    font-size: 10px;
    left: 88px; //calc(40px + 20px + 28px);
    line-height: 24px;
    top: 21px;
    position: absolute;
  }

  &::v-deep(.q-field__native) {
    padding: 21px 21px 26px 18px;
  }

  &::v-deep(.q-field__append) {
    position: absolute;
    right: 53px;
  }

  &::v-deep(.q-avatar) {
    margin-bottom: 3px;
  }
}

.q-menu {
  & .q-item {
    padding-left: 62px;
    min-height: 30px;
  }

  & .q-avatar {
    font-size: 19px;
    margin-right: 38px; //calc(28px + 40px - 19px - 10px);
  }

  & .q-py-sm {
    padding-bottom: 6px;
    padding-top: 6px;
  }
}

.network-info {
    display: flex;
    align-items: flex-end; //baseline;
}

.network-name {
  padding-top: 26px;
}

// padding: 21px 18px 26px 21px;

.form-row {
  padding-top: 31px;
}

.arrow-container {
  align-items: center;
  background: $white;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  height: 46px;
  left: calc(50% - 40px);
  position: absolute;
  top: 58px; //calc(31px + 50px - 23px);
  width: 80px;
  z-index: 1;
}

.addresses-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 30px;
  position: relative;

  &::v-deep(.q-field__control-container) {
    font-size: 14px;
    line-height: 18px;
  }
}

.network-avatar {
  margin-right: 28px;
}

.amount-row {
  &::v-deep(.q-field__control) {
    padding: 0 38px 0 42px;
  }

  .max-btn {
    padding: 5px 10px;
    font-weight: 500;
    font-size: 11px;
    line-height: 14px;
  }

  .owned-quantity {
    margin-right: 30px;
    margin-top: 0px;
    text-align: right;
  }
}

.separator {
  opacity: 0.3;
}

.select-label {
  position: absolute;
}

.alert-row {
  padding-top: 39px;
}

.accept-and-swap {
  display: flex;
  justify-content: space-between;
  padding-bottom: 26px;
  padding-top: 34px;
}

</style>
