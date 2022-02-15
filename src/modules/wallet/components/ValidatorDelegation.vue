<template>
  <div class="validator-delegation column items-center">
    <label class="text-body4 text-weight-medium text-uppercase text-half-transparent-white">{{ $t('general.myDelegation') }}</label>

    <h5 class="validator-delegation-amount text-body5 text-white" v-if="!loading">
      {{ delegated }}
    </h5>
    <q-skeleton type="text" width="160px" height="50px" animation-speed="700" dark square v-else></q-skeleton>

    <div class="btns row items-center justify-evenly q-gutter-sm">
      <q-btn :disable="!session || (session && session.sessionType !== 'keplr') || loading" class="btn btn-medium-small text-body4 col col-md-auto" rounded unelevated color="accent-2" text-color="white" @click="openStakeDialog(validator)">
        {{ $t('actions.delegate') }}
      </q-btn>
      <q-btn :disable="!session || (session && session.sessionType !== 'keplr') || !hasDelegations || loading" class="btn btn-medium-small text-body4 col col-md-auto" rounded unelevated color="secondary" text-color="white" @click="openUnstakeDialog(validator)">
        {{ $t('actions.undelegate') }}
      </q-btn>
      <q-btn :disable="!session || (session && session.sessionType !== 'keplr') || !hasDelegations || loading" class="btn btn-medium-small text-body4 col col-md-auto" rounded unelevated color="accent" text-color="white" @click="openRestakeDialog(validator)">
        {{ $t('actions.redelegate') }}
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
      type: Object as PropType<Validator>
    },
    loading: {
      type: Boolean
    }
  },
  setup(props) {
    const store = useStore();
    const delegations = computed(() => store.state.data.delegations);
    const session = computed(() => store.state.authentication.session);

    const hasDelegations = computed(() => {
      return delegations.value.filter(({ validator }) => props.validator && validator.operatorAddress === props.validator.operatorAddress).length > 0;
    });

    const delegated = computed(() => {
      const delegation = delegations.value.find(({ validator }) =>
        props.validator && validator.operatorAddress === props.validator.operatorAddress
      );

      const amount = delegation ? new BigNumber(delegation.amount).toString() : '0';

      return bigFigureOrShortDecimals(amount);
    });

    return {
      session,
      delegated,
      hasDelegations,
      ...useDelegatorActions(),
    };
  },
});
</script>


<style lang="scss" scoped>
.validator-delegation {
  background-color: $transparent-gray2;
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
