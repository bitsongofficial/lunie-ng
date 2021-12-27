<template>
  <div class="validator-address">
    <div class="validator-address-left column">
      <div class="validator-address-row row items-center justify-between no-wrap">
        <div class="column">
          <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">operator address</label>

          <h5 class="text-white q-mt-none q-mb-xs">bitsongvaloper1fg5...za9s3newleq60zt9</h5>
        </div>

        <q-btn class="copy-btn btn-extra-small text-body4" rounded unelevated color="accent-2" text-color="white" padding="10px 20px">
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
    <div class="validator-address-right column">
      <div class="validator-address-row column">
        <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">ACCOUNT ADDRESS</label>

        <h5 class="text-white q-mt-none q-mb-xs">bitsong1fg5g8acntt90n9303cm5fjza9s3newleq4rlmk</h5>
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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ValidatorAddress',
});
</script>


<style lang="scss" scoped>
.validator-address {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 76px;
  background-color: $transparent-gray;
  backdrop-filter: blur(60px);
  border-radius: 10px;
  padding: 24px 63px 24px 40px;

  &::before {
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

.validator-address-amount {
  margin-top: 16px;
  margin-bottom: 20px;
}

.title {
  margin-bottom: 8px;
}

.copy-btn {
  margin-top: 14px;
}

.validator-address-left > .validator-address-row:not(:last-of-type) {
  margin-bottom: 13px;
}

.validator-address-right > .validator-address-row:not(:last-of-type) {
  margin-bottom: 13px;
}
</style>
