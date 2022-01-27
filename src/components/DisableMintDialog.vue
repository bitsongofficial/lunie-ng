<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="body column items-center">
      <div class="dialog-header row items-center justify-between full-width">
        <h2 class="title text-body-large text-white q-my-none" v-if="!error && ! success">Disable Mint</h2>

        <q-btn
          unelevated
          rounded
          text-color="white"
          class="close no-hoverable q-ml-auto"
          padding="2px"
          @click="close"
        >
          <label class="text-body4 text-uppercase no-pointer-events">close</label>
          <q-icon class="close-icon" name="svguse:icons.svg#close|0 0 12 12" size="10px" />
        </q-btn>
      </div>

      <template v-if="!error">
        <q-form class="col column items-center fit" @submit="onSubmit" v-if="!success">
          <div class="field-block column full-width">
            <p class="text-half-transparent-white text-h4">
              Are you sure to disable minting for your fantoken?
            </p>
          </div>

          <alert-box class="q-mt-auto" color="half-transparent-white" title="If you edit your fantoken to disable minting, you cannot make it mintable anymore."></alert-box>

          <div class="btns full-width items-center justify-end">
            <q-btn
              unelevated
              rounded
              text-color="white"
              class="close no-hoverable"
              padding="2px"
              @click="close"
            >
              <label class="text-h5 text-capitalize no-pointer-events">cancel</label>
            </q-btn>

            <q-btn type="submit" class="submit btn-medium text-weight-medium text-h5" rounded unelevated color="primary" text-color="dark" padding="15px 20px 14px" :loading="loading">
              Disable
            </q-btn>
          </div>
        </q-form>

        <div class="success col column fit" v-else>
          <q-icon class="success-icon" name="svguse:icons.svg#check|0 0 70 70" size="86px" color="positive" />

          <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center">Success!</h3>

          <p class="text-h4 text-half-transparent-white text-center">You have successfully disabled minting for <span class="text-uppercase">{{ fantoken.metaData?.display }}</span>s.</p>
        </div>
      </template>

      <div class="success col column fit" v-else>
        <q-icon class="success-icon" name="svguse:icons.svg#error-outlined|0 0 70 70" size="86px" color="negative" />

        <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center">Error!</h3>

        <p class="text-h4 text-half-transparent-white text-center word-break-break-word">{{ error }}</p>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { FanTokenWithStats, MessageTypes } from 'src/models';
import { useStore } from 'src/store';
import { defineComponent, ref, computed, PropType } from 'vue';
import { compareBalance, isNegative, isNaN, gtnZero } from 'src/common/numbers';
import { isValidAddress } from 'src/common/address';

import AlertBox from './AlertBox.vue';

export default defineComponent({
  name: 'DisableMintDialog',
  components: {
    AlertBox,
  },
  props: {
    fantoken: {
      type: Object as PropType<FanTokenWithStats>,
      required: true,
    }
  },
  emits: [
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const store = useStore();
    const { dialogRef, onDialogHide } = useDialogPluginComponent();

    const success = ref<boolean>(false);
    const error = ref<string>();

    store.commit('data/setLoadingSignTransaction', false);

    const network = computed(() => store.state.authentication.network);

    const loading = computed(() => store.state.data.loadingSignTransaction);

    const close = () => {
      dialogRef.value?.hide();
    };

    const onSubmit = async () => {
      try {
        const requestToSign = {
          type: MessageTypes.DISABLE_MINT_FANTOKEN,
          message: {
            denom: props.fantoken.metaData?.base ?? ''
          },
        };

        await store.dispatch('data/signBitsongTransaction', requestToSign);

        success.value = true;
      } catch (err) {
        console.error(err);

        if (err instanceof Error) {
          error.value = err.message;
        } else {
          error.value = 'Something went wrong, please try again later';
        }
      }
    }

    return {
      error,
      loading,
      network,
      success,
      dialogRef,
      close,
      compareBalance,
      isValidAddress,
      isNegative,
      isNaN,
      gtnZero,
      onDialogHide,
      onSubmit
    }
  },
})
</script>

<style lang="scss" scoped>
.title {
  padding-left: 9px;
}

.dialog-header {
  margin-bottom: 40px;
}

.close {
  opacity: 0.5;
}

.body {
  width: 100%;
  min-height: 446px;
  max-width: 508px;
  border-radius: 10px;
  background: $dark-2;
  padding: 33px 36px 28px;
}

.close-icon {
  margin-left: 15px;
}

.submit {
  width: 100%;
  margin-top: 12px;

  @media screen and (min-width: $breakpoint-md-min) {
    max-width: 217px;
    margin-left: 34px;
    margin-top: 0;
  }
}

.field-label {
  margin-bottom: 17px;
  padding-left: 11px;
}

.field-block {
  &:not(:last-of-type) {
    margin-bottom: 27px;
  }
}

.max-btn {
  margin-left: 16px;
}

.validator-avatar {
  margin-right: 17px;
  box-shadow: $black-box-shadow;
}

.success-icon {
  margin-top: 30px;
  margin-bottom: 86px;
  margin-left: auto;
  margin-right: auto;
}

.success {
  padding: 0 12px 10px;
}

.transaction-btn {
  width: 100%;
  max-width: 197px;
  margin-top: 36px;
}

.validator-item {
  padding: 16px 24px;
}

.btns {
  display: flex;
  flex-direction: column;
  margin-top: 40px;

  @media screen and (min-width: $breakpoint-md-min) {
    flex-direction: row;
  }
}
</style>
