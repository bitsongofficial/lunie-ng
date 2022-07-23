<template>
  <q-page class="issue-fantoken">
    <div class="undelegation-section">
      <div class="row items-center justify-between no-wrap section-header">
        <h2 class="delegations-title section-title text-body-large text-white">
          Create Istance
        </h2>
      </div>

      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        mode="out-in"
        appear
      >
        <q-form class="issue-form" @submit="submit">
          <div class="row q-col-gutter-custom">
            <div class="column col-12">
              <label class="text-capitalize text-white text-h4 text-weight-medium q-mb-md">Name</label>

              <q-input
                v-model="request.name"
                color="transparent-white"
                bg-color="transparent-white"
                round
                standout
                no-error-icon
                hide-bottom-space
                class="full-width extra-large"
                placeholder="Ex. Adam Clay, Bitsong"
                :rules="[
                  val => !!val || 'Required field'
                ]"
              />
            </div>
            <div class="column col-12 col-md-6">
              <label class="text-capitalize text-white text-h4 text-weight-medium q-mb-md">Symbol</label>

              <q-input
                v-model="request.symbol"
                color="transparent-white"
                bg-color="transparent-white"
                round
                standout
                no-error-icon
                hide-bottom-space
                class="full-width extra-large"
                placeholder="Ex. CLAY, BTSG"
                :rules="[
                  val => !!val || 'Required field',
                ]"
              />
            </div>
            <div class="column col-12 col-md-6">
              <label class="text-capitalize text-white text-h4 text-weight-medium q-mb-md">Max Supply</label>

              <q-input
                v-model="request.maxSupply"
                color="transparent-white"
                bg-color="transparent-white"
                round
                standout
                no-error-icon
                hide-bottom-space
                class="full-width extra-large"
                :rules="[
                  val => !!val || 'Required field',
                  val => !isNaN(val) || 'Amount must be a decimal value',
                  val => gtnZero(val) || 'Amount must be a greater then zero',
                  val => !isNegative(val) || 'Amount must be greater then zero'
                ]"
                placeholder="Amount"
              />
            </div>
            <div class="column col-12">
              <label class="text-capitalize text-white text-h4 text-weight-medium q-mb-md">Description</label>

              <q-input
                v-model="request.description"
                color="transparent-white"
                bg-color="transparent-white"
                round
                standout
                no-error-icon
                hide-bottom-space
                class="full-width extra-large-fluid"
                placeholder="Write a simple description"
                autogrow
              />
            </div>
          </div>

          <div class="submit-buttons row justify-end items-center">
            <div class="issue-fee row items-center">
              <p class="text-subtitle2 text-weight-medium text-white q-mb-none q-mr-lg">Issue Fee</p>
              <p class="text-subtitle2 text-weight-medium text-half-transparent-white q-mb-none">
                {{ issueFee }} <span class="text-body3">{{ network.stakingDenom }}</span>
              </p>
              <!-- <div class="info">
                <q-icon class="info-icon" name="svguse:icons.svg#info|0 0 15 15" size="14px" color="gray4" />
                <q-tooltip anchor="top middle" self="bottom middle">
                  ciao
                </q-tooltip>
              </div> -->
            </div>
            <q-btn type="submit" :loading="loading" :disable="!session || (session && session.sessionType !== 'keplr' && session.sessionType !== 'walletconnect')" class="issue-btn btn-large text-body2 text-weight-medium" rounded unelevated color="primary" text-color="dark" padding="12px 26px">
              ISSUE
            </q-btn>
          </div>
        </q-form>
      </transition>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref } from 'vue';
import { isNegative, isNaN, gtnZero } from 'src/common/numbers';
import { useStore } from 'src/store';
import { IssueFantokenRequest, MessageTypes } from 'src/models';
import { notifyError, notifySuccess } from 'src/common/notify';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'IssueFantoken',
  setup() {
    const router = useRouter();
    const store = useStore();
    const session = computed(() => store.state.authentication.session);
    const network = computed(() => store.state.authentication.network);
    const issueFee = computed(() => store.getters['fantoken/issueFee'] as string);

    const request = reactive<IssueFantokenRequest>({
      name: '',
      symbol: '',
      maxSupply: '0',
      description: ''
    });
    const loading = ref(false);

    const submit = async () => {
      try {
        loading.value = true;

        const requestToSign = {
          type: MessageTypes.ISSUE_FANTOKEN,
          message: {
            ...request,
            symbol: request.symbol.toLowerCase()
          },
        };

        await store.dispatch('data/signBitsongTransaction', requestToSign);

        notifySuccess('Fantoken issue success!');

        await router.replace({ name: 'fantokens' });
      } catch (err) {
        console.error(err);

        notifyError('Something went wrong, please try again later');
      } finally {
        loading.value = false;
      }
    }

    return {
      loading,
      network,
      session,
      request,
      issueFee,
      submit,
      isNegative,
      isNaN,
      gtnZero
    };
  },
});
</script>

<style lang="scss" scoped>
.issue-fantoken {
  padding-top: 85px;
  padding-bottom: 16px;
}

.section-header {
  margin-bottom: 16px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: 82px;
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

.issue-btn {
  width: 100%;

  @media screen and (min-width: $breakpoint-md-min) {
    max-width: 210px;
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
