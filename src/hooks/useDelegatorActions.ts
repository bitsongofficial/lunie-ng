import { useQuasar } from 'quasar';
import { computed } from 'vue';
import { MessageTypes, Validator } from 'src/models';
import DelegationDialog from 'src/components/DelegationDialog.vue';
import ClaimDialog from 'src/components/ClaimDialog.vue';
import { useStore } from 'src/store';

export const useDelegatorActions = () => {
  const store = useStore();
  const quasar = useQuasar();
  const network = computed(() => store.state.authentication.network);

  const openClaimDialog = (validator: Validator) => {
    quasar.dialog({
      component: ClaimDialog,
      componentProps: {
        validator,
      },
      fullWidth: true,
      maximized: true,
    });
  }

  const openStakeDialog = (validator: Validator) => {
    quasar.dialog({
      component: DelegationDialog,
      componentProps: {
        type: MessageTypes.STAKE,
        title: 'Delegate',
        toLabel: 'Delegate to',
        amountLabel: 'Amount to delegate',
        submit: 'Delegate',
        successTitle: 'Successfully delegate',
        successSubtitle: `You have successfully delegated your ${network.value.stakingDenom}s.`,
        defaultTo: validator
      },
      fullWidth: true,
      maximized: true,
    });
  }

  const openUnstakeDialog = (validator: Validator) => {
    quasar.dialog({
      component: DelegationDialog,
      componentProps: {
        type: MessageTypes.UNSTAKE,
        title: 'Undelegate',
        toLabel: 'Undelegate to',
        fromLabel: 'Undelegate from',
        amountLabel: 'Amount to undelegate',
        submit: 'Undelegate',
        successTitle: 'Successfully undelegated',
        successSubtitle: `You have successfully undelegated your ${network.value.stakingDenom}s.`,
        defaultFrom: validator
      },
      fullWidth: true,
      maximized: true,
    });
  }

  const openRestakeDialog = (validator: Validator) => {
    quasar.dialog({
      component: DelegationDialog,
      componentProps: {
        type: MessageTypes.RESTAKE,
        title: 'Redelegate',
        toLabel: 'Redelegate to',
        amountLabel: 'Amount to redelegate',
        submit: 'Redelegate',
        successTitle: 'Successfully redelegated',
        successSubtitle: `You have successfully redelegated your ${network.value.stakingDenom}s.`,
        defaultFrom: validator
      },
      fullWidth: true,
      maximized: true,
    });
  }

  return {
    openStakeDialog,
    openUnstakeDialog,
    openRestakeDialog,
    openClaimDialog
  }
}
