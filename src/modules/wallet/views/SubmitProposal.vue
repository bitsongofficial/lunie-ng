<template>
  <q-page class="issue-fantoken">
    <div class="undelegation-section">
      <div class="row items-center justify-between no-wrap section-header">
        <h2 class="delegations-title section-title text-body-large text-white">
          Create New Proposals
        </h2>
      </div>

      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
        appear
      >
        <q-form class="issue-form" @submit="submit" ref="proposalForm">
          <div class="row q-col-gutter-custom">
            <div class="column col-12">
              <label class="text-capitalize text-white text-h4 text-weight-medium q-mb-md">Name</label>

              <q-input
                v-model="request.title"
                color="transparent-gray2"
                bg-color="transparent-gray2"
                round
                standout
                no-error-icon
                hide-bottom-space
                class="full-width extra-large"
                :rules="[
                  val => !!val || 'Field is required'
                ]"
              />
            </div>
            <div class="column col-12 col-md-6">
              <label class="text-capitalize text-white text-h4 text-weight-medium q-mb-md">Typology</label>

              <q-select
                v-model="request.typology"
                color="transparent-gray2"
                bg-color="transparent-gray2"
                :options="proposalsSubmitTypeOptions"
                map-options
                emit-value
                round
                standout
                no-error-icon
                hide-bottom-space
                class="full-width extra-large"
                disable
                :rules="[
                  val => !!val || 'Field is required',
                ]"
              />
            </div>
            <div class="column col-12 col-md-6">
              <label class="text-capitalize text-white text-h4 text-weight-medium q-mb-md">Initial Deposit</label>

              <q-input
                v-model="request.initialDeposit"
                color="transparent-gray2"
                bg-color="transparent-gray2"
                round
                standout
                no-error-icon
                hide-bottom-space
                class="full-width extra-large"
                :rules="[
                  val => !!val || 'Field is required',
                  val => !isNaN(val) || 'Amount must be a decimal value',,
                  val => gtnZero(val) || 'Amount must be a greater then zero',
                  val => !minAmount(val, minDeposit) || `inimum amount required ${minDeposit} ${network.stakingDenom}`,
                  val => compareBalance(val, availableCoins) || 'You don\'t have enough coins',
                  val => !isNegative(val) || 'Amount must be greater then zero'
                ]"
                placeholder="0"
              >
                <template v-slot:append>
                  <label class="text-body3 text-half-transparent-white text-weight-medium">{{ network.stakingDenom }}</label>
                </template>
              </q-input>
            </div>
            <div class="column col-12">
              <label class="text-capitalize text-white text-h4 text-weight-medium q-mb-md">Text Proposal</label>

              <v-md-editor v-model="request.description" height="400px"></v-md-editor>
            </div>
          </div>

          <div class="submit-buttons row justify-end items-center">
            <q-btn
              unelevated
              rounded
              text-color="white"
              class="close no-hoverable"
              padding="2px"
              @click="saveDraft"
            >
              <label class="text-h5 text-capitalize no-pointer-events">Save Draft</label>
            </q-btn>

            <q-btn type="submit" :loading="loading" :disable="!session || (session && session.sessionType !== 'keplr')" class="create-btn btn-medium text-h6 q-ml-auto" rounded unelevated color="primary" text-color="dark" padding="12px 24px 10px 26px">
              Publish
            </q-btn>
          </div>
        </q-form>
      </transition>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref, onMounted } from 'vue';
import { isNegative, isNaN, gtnZero, compareBalance, minAmount } from 'src/common/numbers';
import { useStore } from 'src/store';
import { Balance, MessageTypes, ProposalSubmitRequest, ProposalSubmitType } from 'src/models';
import { notifyError, notifySuccess } from 'src/common/notify';
import { useRouter } from 'vue-router';
import { QForm } from 'quasar';
import { proposalsSubmitTypeOptions } from 'src/constants';
import { BigNumber } from 'bignumber.js';

export default defineComponent({
  name: 'SubmitProposal',
  props: {
    id: {
      type: String,
    }
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();
    const session = computed(() => store.state.authentication.session);
    const network = computed(() => store.state.authentication.network);
    const proposalForm = ref<QForm>();
    const request = reactive<ProposalSubmitRequest>({
      title: '',
      typology: ProposalSubmitType.TEXT,
      initialDeposit: '',
      description: ''
    });
    const balance = computed(() => {
      return store.getters['data/currentRawBalance'] as Balance | undefined;
    });
    const minDeposit = computed(() => {
      return store.getters['data/minDeposit'] as string;
    });
    const availableCoins = computed(() => {
      return new BigNumber(balance.value ? balance.value.available : '0').toString();
    });
    const loading = ref(false);

    const submit = async () => {
      try {
        loading.value = true;
        const requestToSign = {
          type: MessageTypes.SUBMIT_PROPOSAL,
          ...request,
          deposit: {
            amount: request.initialDeposit,
            denom: network.value.stakingDenom
          },
        };
        await store.dispatch('data/signTransaction', requestToSign);

        notifySuccess('Proposal submission success!');
        await router.replace({ name: 'proposals' });
      } catch (err) {
        console.error(err);
        notifyError('Something went wrong, please try again later');
      } finally {
        loading.value = false;
      }
    }

    const saveDraft = async () => {
      try {
        await proposalForm.value?.validate(false);
        if (props.id !== undefined) {
          store.commit('proposal/editProposal', request);
        } else {
          store.commit('proposal/setProposal', request);
        }
        await router.replace({ name: 'proposals' });
      } catch (err) {
        console.error(err);
        notifyError('Something went wrong, please try again later');
      }
    }

    onMounted(() => {
      const id = props.id;
      if (id) {
        const proposal = store.state.proposal.drafts.find(el => el.id === parseInt(id));
        if (proposal) {
          Object.assign(request, proposal);
        }
      }
    });

    return {
      proposalsSubmitTypeOptions,
      proposalForm,
      availableCoins,
      minDeposit,
      loading,
      network,
      session,
      request,
      submit,
      saveDraft,
      isNegative,
      isNaN,
      gtnZero,
      compareBalance,
      minAmount
    };
  },
});
</script>

<style lang="scss" scoped>
.issue-fantoken {
  padding-top: 40px;
  padding-bottom: 16px;
}
.section-header {
  margin-bottom: 16px;
  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: 40px;
  }
}
.section-header-small {
  margin-top: 10px;
  margin-bottom: 10px;
}
.section-title {
  margin: 0 auto 0 0;
  @media screen and (min-width: $breakpoint-md-min) {
    padding-left: 0;
    margin: 0 32px 0 0;
  }
}
.undelegation-section {
  margin-bottom: 62px;
}
.submit-buttons {
  margin-top: 40px;
  flex-direction: column-reverse;
  @media screen and (min-width: $breakpoint-md-min) {
    flex-direction: row;
  }
}
.create-btn {
  width: 100%;
  margin-bottom: 32px;
  @media screen and (min-width: $breakpoint-md-min) {
    margin-left: 32px;
    margin-bottom: 0;
    max-width: 168px;
  }
}
.issue-fee {
  margin-top: 24px;
  margin-left: auto;
  @media screen and (min-width: $breakpoint-md-min) {
    margin-top: 0;
    margin-right: 60px;
  }
}
.info {
  margin-left: 12px;
}
</style>
