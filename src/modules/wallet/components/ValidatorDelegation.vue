<template>
  <div class="validator-delegation column items-center">
    <label class="text-body4 text-weight-medium text-uppercase text-half-transparent-white">MY DELEGATION</label>

    <h5 class="validator-delegation-amount text-body5 text-white">
      7.268,78
    </h5>

    <div class="btns row items-center justify-evenly q-gutter-sm">
      <q-btn class="btn btn-medium-small text-body4 col col-md-auto" rounded unelevated color="accent-2" text-color="white" @click="openStakeDialog">
        delegate
      </q-btn>
      <q-btn class="btn btn-medium-small text-body4 col col-md-auto" rounded unelevated color="secondary" text-color="white" @click="openUnstakeDialog">
        undelegate
      </q-btn>
      <q-btn class="btn btn-medium-small text-body4 col col-md-auto" rounded unelevated color="accent" text-color="white" @click="openRestakeDialog">
        redelegate
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
      quasar,
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
