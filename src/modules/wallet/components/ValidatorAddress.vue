<template>
  <div class="validator-address row">
    <div class="validator-address-left column col-12 col-md">
      <div class="validator-address-row row items-center justify-between no-wrap">
        <div class="column">
          <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">operator address</label>

          <h5 class="text-white q-mt-none q-mb-xs word-break-break-word">bitsongvaloper1fg5...za9s3newleq60zt9</h5>
        </div>

        <q-btn class="copy-btn btn-extra-small text-body4" rounded unelevated color="accent-2" text-color="white" padding="10px 20px" @click="copyAddressToClipboard">
          COPY
        </q-btn>
      </div>
      <div class="validator-address-row column">
        <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">uptime</label>

        <h5 class="text-white q-mt-none q-mb-xs">100 %</h5>
      </div>
      <div class="validator-address-row column">
        <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">MAX COMMISSION RATE</label>

        <h5 class="text-white q-mt-none q-mb-xs">100 %</h5>
      </div>
    </div>
    <div class="validator-address-right column col-12 col-md">
      <div class="validator-address-row column">
        <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">ACCOUNT ADDRESS</label>

        <h5 class="text-white q-mt-none q-mb-xs word-break-break-word">bitsong1fg5g8acntt90n9303cm5fjza9s3newleq4rlmk</h5>
      </div>
      <div class="validator-address-row column">
        <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">ACCOUNT ADDRESS</label>

        <h5 class="text-white q-mt-none q-mb-xs">12,5 %</h5>
      </div>
      <div class="validator-address-row column">
        <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">LAST COMMISSION CHANGE</label>

        <h5 class="text-white q-mt-none q-mb-xs">9 months ago</h5>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { copyToClipboard } from 'quasar';
import { notifySuccess } from 'src/common/notify';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ValidatorAddress',
  setup() {
    const copyAddressToClipboard = async () => {
      try {
        await copyToClipboard('bitsongvaloper1fg5...za9s3newleq60zt9');
        notifySuccess('Text has been copied to the clipboard!');
      } catch (error) {
        console.error(error);
      }
    }

    return {
      copyAddressToClipboard,
    };
  }
});
</script>


<style lang="scss" scoped>
.validator-address {
  position: relative;
  grid-gap: 76px;
  background-color: $transparent-gray;
  backdrop-filter: blur(60px);
  border-radius: 10px;
  padding: 24px;

  @media screen and (min-width: $breakpoint-md-min) {
    padding: 24px 40px 24px;
  }

  &::before {
    @media screen and (min-width: $breakpoint-md-min) {
      content: '';
      position: absolute;
      left: calc(50% - 12px);
      bottom: 24px;
      height: calc(100% - 64px);
      width: 1px;
      background: transparentize($color: $accent-3, $amount: 0.5);
      transform: translate(-50%, 0);
    }
  }

}

.validator-address-amount {
  margin-top: 16px;
  margin-bottom: 20px;
}

.title {
  margin-bottom: 8px;
}

.copy-btn {
  margin-top: 14px;
  margin-left: 8px;
}

.validator-address-left > .validator-address-row:not(:last-of-type) {
  margin-bottom: 13px;
}

.validator-address-right > .validator-address-row:not(:last-of-type) {
  margin-bottom: 13px;
}
</style>
