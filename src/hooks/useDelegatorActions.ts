import { useQuasar } from 'quasar';
import { MessageTypes, Validator } from 'src/models';
import DelegationDialog from 'src/components/DelegationDialog.vue';
import ClaimDialog from 'src/components/ClaimDialog.vue';

export const useDelegatorActions = () => {
  const quasar = useQuasar();

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
        title: 'actions.delegate',
        toLabel: 'general.delegateTo',
        amountLabel: 'general.delegateAmount',
        submit: 'actions.delegate',
        successTitle: 'success.delegateTitle',
        successSubtitle: 'success.delegateDescription',
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
        title: 'actions.undelegate',
        toLabel: 'general.undelegateTo',
        fromLabel: 'general.undelegateFrom',
        amountLabel: 'general.undelegateAmount',
        submit: 'actions.undelegate',
        successTitle: 'success.undelegateTitle',
        successSubtitle: 'success.undelegateDescription',
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
        title: 'actions.redelegate',
        toLabel: 'general.redelegateTo',
        fromLabel: 'general.redelegateFrom',
        amountLabel: 'general.redelegateAmount',
        submit: 'actions.redelegate',
        successTitle: 'success.redelegateTitle',
        successSubtitle: 'success.redelegateDescription',
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
