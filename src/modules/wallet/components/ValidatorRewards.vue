<template>
  <div class="validator-rewards column items-center">
    <label class="text-body4 text-weight-medium text-uppercase text-half-transparent-white">MY REWARDS</label>

    <h5 class="validator-rewards-amount text-body5 text-white">
      {{ stakingDenomReward }}
    </h5>

    <div class="row items-center justify-center full-width">
      <q-btn @click="openClaimDialog" :disable="validatorReward.length === 0" class="btn-medium-small text-body4" rounded unelevated color="accent-2" text-color="white" padding="12px 28px">
        CLAIM
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from 'src/store';
import { defineComponent, computed, PropType } from 'vue';
import { Validator } from 'src/models';
import { useQuasar } from 'quasar';
import ClaimDialog from 'src/components/ClaimDialog.vue';

export default defineComponent({
  name: 'ValidatorRewards',
  props: {
    validator: {
      type: Object as PropType<Validator>,
      required: true
    },
  },
  setup(props) {
    const quasar = useQuasar();
    const store = useStore();
    const rewards = computed(() => store.state.data.rewards);
    const network = computed(() => store.state.authentication.network);

    const validatorReward = computed(() => rewards.value.filter(
      ({ validator }) => validator.operatorAddress === props.validator.operatorAddress)
    );

    const stakingDenomReward = computed(() => {
      const stakingDenomRewards = validatorReward.value.filter(
        (reward) => reward.denom === network.value.stakingDenom
      );

      const amount = stakingDenomRewards.length > 0 ? stakingDenomRewards[0].amount : 0;

      return amount;
    });

    const openClaimDialog = () => {
      quasar.dialog({
        component: ClaimDialog,
        componentProps: {
          validator: props.validator,
        },
        fullWidth: true,
        maximized: true,
      });
    }

    return {
      validatorReward,
      stakingDenomReward,
      openClaimDialog
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
