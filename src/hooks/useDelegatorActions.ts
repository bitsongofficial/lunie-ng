import { useQuasar } from 'quasar';
import { MessageTypes, Validator } from 'src/models';
import DelegationDialog from 'src/components/DelegationDialog.vue';

export const useDelegatorActions = () => {
  const quasar = useQuasar();

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
        successSubtitle: 'You have successfully delegated your BTSGs.',
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
        successSubtitle: 'You have successfully undelegated your BTSGs.',
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
        successSubtitle: 'You have successfully redelegated your BTSGs.',
        defaultFrom: validator
      },
      fullWidth: true,
      maximized: true,
    });
  }

  return {
    openStakeDialog,
    openUnstakeDialog,
    openRestakeDialog
  }
}
