<template>
  <div class="validator-delegation column items-center">
    <label class="text-body4 text-weight-medium text-uppercase text-half-transparent-white">MY DELEGATION</label>

    <h5 class="validator-delegation-amount text-body5 text-white">
      {{ delegated }}
    </h5>

    <div class="btns row items-center justify-evenly q-gutter-sm">
      <q-btn class="btn btn-medium-small text-body4 col col-md-auto" rounded unelevated color="accent-2" text-color="white" @click="openStakeDialog(validator)">
        delegate
      </q-btn>
      <q-btn :disable="!hasDelegations" class="btn btn-medium-small text-body4 col col-md-auto" rounded unelevated color="secondary" text-color="white" @click="openUnstakeDialog(validator)">
        undelegate
      </q-btn>
      <q-btn :disable="!hasDelegations" class="btn btn-medium-small text-body4 col col-md-auto" rounded unelevated color="accent" text-color="white" @click="openRestakeDialog(validator)">
        redelegate
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { Validator } from 'src/models';
import { useDelegatorActions } from 'src/hooks/useDelegatorActions';
import { useStore } from 'src/store';
import { BigNumber } from 'bignumber.js';
import { bigFigureOrShortDecimals } from 'src/common/numbers';

export default defineComponent({
  name: 'ValidatorDelegation',
  props: {
    validator: {
      type: Object as PropType<Validator>,
      required: true
    },
  },
  setup(props) {
    const store = useStore();
    const delegations = computed(() => store.state.data.delegations);

    const hasDelegations = computed(() => {
      return delegations.value.filter(({ validator }) => validator.operatorAddress === props.validator.operatorAddress).length > 0;
    });

    const delegated = computed(() => {
      const delegation = delegations.value.find(({ validator }) =>
        validator.operatorAddress === props.validator.operatorAddress
      );

      const amount = delegation ? new BigNumber(delegation.amount).toString() : '0';

      return bigFigureOrShortDecimals(amount);
    });

    return {
      delegated,
      hasDelegations,
      ...useDelegatorActions(),
    };
  },
});
</script>


<style lang="scss" scoped>
.validator-delegation {
  background-color: $transparent-gray;
  backdrop-filter: blur(60px);
  border-radius: 10px;
  padding: 24px 12px;

  @media screen and (min-width: $breakpoint-md-min) {
    padding: 18px 61px 22px;
  }
}

.validator-delegation-amount {
  margin-top: 16px;
  margin-bottom: 20px;
}

.btns {
  width: 100%;
}

.btn {
  padding: 12px;

  @media screen and (min-width: $breakpoint-md-min) {
    padding: 12px 28px;
  }
}
</style>
