<template>
  <div class="validator-rewards column items-center">
    <label class="text-body4 text-weight-medium text-uppercase text-half-transparent-white">MY REWARDS</label>

    <h5 class="validator-rewards-amount text-body5 text-white">
      {{ stakingDenomReward }}
    </h5>

    <div class="row items-center justify-center full-width">
      <q-btn class="btn-medium-small text-body4" rounded unelevated color="accent-2" text-color="white" padding="12px 28px">
        CLAIM
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { network } from 'src/constants';
import { useStore } from 'src/store';
import { defineComponent, computed, PropType } from 'vue';
import { Validator } from 'src/models';
import { bigFigureOrShortDecimals } from 'src/common/numbers';

export default defineComponent({
  name: 'ValidatorRewards',
  props: {
    validator: {
      type: Object as PropType<Validator>,
      required: true
    },
  },
  setup(props) {
    const store = useStore();
    const rewards = computed(() => store.state.data.rewards);

    const stakingDenomReward = computed(() => {
      const rewardsFilter = rewards.value.filter(({ validator }) => validator.operatorAddress === props.validator.operatorAddress);

      const stakingDenomRewards = rewardsFilter.filter(
        (reward) => reward.denom === network.stakingDenom
      );

      const amount = stakingDenomRewards.length > 0 ? stakingDenomRewards[0].amount : 0;

      return bigFigureOrShortDecimals(amount);
    });

    return {
      stakingDenomReward,
    }
  }
});
</script>


<style lang="scss" scoped>
.validator-rewards {
  background-color: $transparent-gray;
  backdrop-filter: blur(60px);
  border-radius: 10px;
  padding: 24px 12px;

  @media screen and (min-width: $breakpoint-md-min) {
    padding: 18px 61px 22px;
  }
}

.validator-rewards-amount {
  margin-top: 16px;
  margin-bottom: 20px;
}
</style>
