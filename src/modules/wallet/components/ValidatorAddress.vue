<template>
  <div class="validator-address" :class="{
    'row': !quasar.screen.lt.md,
  }">
    <div class="validator-address-left column col-12 col-md">
      <div class="validator-address-row row items-center justify-between no-wrap">
        <div class="column">
          <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">operator address</label>

          <h5 class="text-white q-mt-none q-mb-xs word-break-break-word">{{ address }}</h5>
        </div>

        <q-btn class="copy-btn" rounded unelevated flat @click="onCopy(validator.operatorAddress)">
          <q-icon name="svguse:icons.svg#copy|0 0 18 18" color="quart-transparent-white" size="18px" />
        </q-btn>
      </div>
      <div class="validator-address-row column">
        <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">uptime</label>

        <h5 class="text-white q-mt-none q-mb-xs">{{ validator.uptimePercentage ? percent(validator.uptimePercentage) : 'N/A' }}</h5>
      </div>
      <div class="validator-address-row column">
        <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">MAX COMMISSION RATE</label>

        <h5 class="text-white q-mt-none q-mb-xs">{{ validator.maxCommission ? percent(validator.maxCommission) : 'N/A' }}</h5>
      </div>
      <div class="validator-address-row column">
        <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">LAST COMMISSION CHANGE</label>

        <h5 class="text-white q-mt-none q-mb-xs">{{ fromNow(validator.commissionUpdateTime) }} ago</h5>
      </div>
    </div>
    <div class="validator-address-right column col-12 col-md">
      <div class="validator-address-row column" v-if="userAddress">
        <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">ACCOUNT ADDRESS</label>

        <h5 class="text-white q-mt-none q-mb-xs word-break-break-word">{{ userAddress }}</h5>
      </div>
      <div class="validator-address-row column">
        <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">CURRENT COMMISSION RATE</label>

        <h5 class="text-white q-mt-none q-mb-xs">{{ validator.commission ? percent(validator.commission) : 'N/A' }}</h5>
      </div>
      <div class="validator-address-row column">
        <label class="title text-body3 text-weight-medium text-half-transparent-white text-uppercase">Max Daily Commission Change</label>

        <h5 class="text-white q-mt-none q-mb-xs">{{ validator.maxChangeCommission ? percent(validator.maxChangeCommission) : 'N/A' }}</h5>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { percent } from 'src/common/numbers';
import { fromNow } from 'src/common/date';
import { Validator } from 'src/models';
import { defineComponent, PropType, computed } from 'vue';
import { useStore } from 'src/store';
import { useClipboard } from 'src/hooks';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'ValidatorAddress',
  props: {
    validator: {
      type: Object as PropType<Validator>,
      required: true
    },
  },
  setup(props) {
    const quasar = useQuasar();
    const store = useStore();
    const address = computed(() => props.validator.operatorAddress);
    const userAddress = computed(() => store.state.authentication.session?.address);

    return {
      quasar,
      address,
      userAddress,
      percent,
      fromNow,
      ...useClipboard()
    };
  }
});
</script>


<style lang="scss" scoped>
.validator-address {
  position: relative;
  grid-gap: 76px;
  background-color: $dark-2;
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
  padding: 6px;
  min-width: 30px;
}

.validator-address-left {
  margin-bottom: 24px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: 0;
  }
}

.validator-address-left > .validator-address-row:not(:last-of-type) {
  margin-bottom: 13px;
}

.validator-address-right > .validator-address-row:not(:last-of-type) {
  margin-bottom: 13px;
}
</style>
