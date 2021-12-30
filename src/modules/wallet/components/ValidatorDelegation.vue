<template>
  <div class="validator-delegation column items-center">
    <label class="text-body4 text-weight-medium text-uppercase text-half-transparent-white">MY DELEGATION</label>

    <h5 class="validator-delegation-amount text-body5 text-white">
      7.268,78
    </h5>

    <div class="row items-center justify-evenly full-width">
      <q-btn class="btn-medium-small text-body4" rounded unelevated color="accent-2" text-color="white" padding="12px 28px" @click="openStakeDialog">
        STAKE
      </q-btn>
      <q-btn class="btn-medium-small text-body4" rounded unelevated color="secondary" text-color="white" padding="12px 28px" @click="openUnstakeDialog">
        UNSTAKE
      </q-btn>
      <q-btn class="btn-medium-small text-body4" rounded unelevated color="accent" text-color="white" padding="12px 28px" @click="openRestakeDialog">
        RESTAKE
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';
import Dialog from 'src/components/Dialog.vue';

export default defineComponent({
  name: 'ValidatorDelegation',
  setup() {
    const quasar = useQuasar();

    const openStakeDialog = () => {
      quasar.dialog({
        component: Dialog,
        componentProps: {
          title: 'Stake',
          toLabel: 'Stake to',
          amountLabel: 'Amount to stake',
          submit: 'Stake',
          successTitle: 'Successfully staked',
          successSubtitle: 'You have successifully staked your BTSGs.'
        },
        fullWidth: true,
        maximized: true,
      });
    }

    const openUnstakeDialog = () => {
      quasar.dialog({
        component: Dialog,
        componentProps: {
          title: 'Unstake',
          toLabel: 'Redelegate to',
          amountLabel: 'Amount to redelegate',
          submit: 'Redelegate',
          successTitle: 'Successfully redelegated',
          successSubtitle: 'You have successifully redelegated your BTSGs.'
        },
        fullWidth: true,
        maximized: true,
      });
    }

    const openRestakeDialog = () => {
      quasar.dialog({
        component: Dialog,
        componentProps: {
          title: 'Restake',
          toLabel: 'Redelegate to',
          amountLabel: 'Amount to redelegate',
          submit: 'Redelegate',
          successTitle: 'Successfully redelegated',
          successSubtitle: 'You have successifully redelegated your BTSGs.'
        },
        fullWidth: true,
        maximized: true,
      });
    }

    return {
      openUnstakeDialog,
      openStakeDialog,
      openRestakeDialog,
    };
  },
});
</script>


<style lang="scss" scoped>
.validator-delegation {
  background-color: $transparent-gray;
  backdrop-filter: blur(60px);
  border-radius: 10px;
  padding: 18px 61px 22px;
}

.validator-delegation-amount {
  margin-top: 16px;
  margin-bottom: 20px;
}
</style>
