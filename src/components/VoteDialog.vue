<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="body">
      <div class="dialog-header row items-center justify-between full-width">
        <h2 class="title text-body-large text-white q-my-none">Vote</h2>

        <q-btn
          unelevated
          rounded
          text-color="white"
          class="close no-hoverable"
          padding="2px"
          @click="close"
        >
          <label class="text-body4 text-uppercase no-pointer-events">close</label>
          <q-icon class="close-icon" name="svguse:icons.svg#close|0 0 12 12" size="10px" />
        </q-btn>
      </div>

      <template v-if="!error">
        <q-form class="col column items-center fit no-wrap" @submit="onSubmit" v-if="!success">
          <div class="field-block column full-width">
            <label class="field-label text-uppercase text-primary text-h6 text-weight-medium">Option</label>

            <q-option-group
              v-model="vote"
              :options="voteOptions"
              color="primary"
              class="text-primary"
              keep-color
              :rules="[
                val => !!val || 'Required field',
              ]"
            />
          </div>

          <div class="btns full-width items-center justify-end q-mt-auto">
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

            <q-btn type="submit" class="submit btn-medium text-h5" rounded unelevated color="accent-2" text-color="white" padding="15px 20px 14px" :loading="loading">
              vote
            </q-btn>
          </div>
        </q-form>

        <div class="success col column fit" v-else>
          <q-icon class="success-icon" name="svguse:icons.svg#check|0 0 70 70" size="64px" color="positive" />

          <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center">Success!</h3>

          <p class="text-h4 text-half-transparent-white text-center">You have successfully voted the proposal.</p>
        </div>
      </template>

      <div class="success col column fit" v-else>
        <q-icon class="success-icon" name="svguse:icons.svg#error-outlined|0 0 70 70" size="64px" color="negative" />

        <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm text-center">Error!</h3>

        <p class="text-h4 text-half-transparent-white text-center">{{ error }}</p>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { MessageTypes } from 'src/models';
import { useStore } from 'src/store';
import { defineComponent, ref, computed } from 'vue';
import { voteOptions } from 'src/constants';

export default defineComponent({
  name: 'VoteDialog',
  props: {
    proposalId: {
      type: String,
      required: true
    }
  },
  emits: [
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const store = useStore();
    const { dialogRef, onDialogHide } = useDialogPluginComponent();

    const vote = ref<number>();
    const success = ref<boolean>(false);
    const error = ref<string>();

    const loading = computed(() => store.state.data.loadingSignTransaction);
    const network = computed(() => store.state.authentication.network);

    const close = () => {
      dialogRef.value?.hide();
    };

    const onSubmit = async () => {
      try {
        const request = {
          proposalId: props.proposalId,
          type: MessageTypes.VOTE,
          voteOption: vote.value
        };

        await store.dispatch('data/signTransaction', request);

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
      vote,
      voteOptions,
      error,
      loading,
      network,
      success,
      dialogRef,
      close,
      onDialogHide,
      onSubmit
    }
  },
})
</script>

<style lang="scss" scoped>
.dialog-header {
  margin-bottom: 41px;
}

.body {
  width: 100%;
  max-width: 508px;
  border-radius: 10px;
  background: $alternative-4;
  padding: 33px 36px 28px;
  box-shadow: $secondary-box-shadow;
}

.close {
  opacity: 0.4;
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
  margin-right: 15px;
}

.validator-avatar {
  margin-right: 17px;
  box-shadow: $black-box-shadow;
}

.success-icon {
  margin-top: 23px;
  margin-bottom: 45px;
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
  margin-top: 45px;

  @media screen and (min-width: $breakpoint-md-min) {
    flex-direction: row;
  }
}
</style>
