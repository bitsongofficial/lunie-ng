<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="body column items-center">
      <div class="dialog-header row items-center justify-between full-width">
        <h2 class="title text-body-large text-white q-my-none">{{ $t('disclaimer.title') }}</h2>
      </div>

      <div class="disclaimer-wrapper">
        <div class="disclaimer text-white text-body3 scroll scroll--transparent">
          <p v-html="$t('disclaimer.description')"></p>
        </div>
      </div>

      <q-checkbox class="confirm" v-model="accept" label="I understand the risks and would like to proceed." dark size="md" />

      <q-btn :disable="!accept" @click="onAccept" class="proceed-btn btn-medium text-h6" rounded unelevated color="accent-2" text-color="white" padding="14px 36px">
        {{ $t('actions.proceed') }} <q-icon class="btn-icon q-ml-auto" name="svguse:icons.svg#arrow-right|0 0 14 14" size="14px" color="white" />
      </q-btn>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { useStore } from 'src/store';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DisclaimerDialog',
  emits: [
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const store = useStore();
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const accept = ref(false);

    const close = () => {
      dialogRef.value?.hide();
    };

    const onAccept = () => {
      store.commit('settings/setDisclaimer', true);
      close();
    };

    return {
      accept,
      dialogRef,
      onDialogHide,
      onAccept
    }
  },
})
</script>

<style lang="scss" scoped>
.dialog-header {
  margin-bottom: 32px;
}

.body {
  width: 100%;
  min-height: 480px;
  max-width: 508px;
  border-radius: 10px;
  background: $alternative-4;
  padding: 50px 36px 28px;
  box-shadow: $secondary-box-shadow;
}

.close-icon {
  margin-left: 15px;
}

.disclaimer-wrapper {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    background: linear-gradient(180deg, rgba(53, 53, 75, 0) 50%, #38384D 100%);
    height: 100%;
    width: 100%;
    pointer-events: none;
    left: 0;
    bottom: 0;
    border-radius: 10px;
  }
}

.disclaimer {
  display: flex;
  border-radius: 10px !important;
  backdrop-filter: blur(60px);
  background-color: $full-transparent-white;
  padding: 26px;
  line-height: 21px;
  max-height: 230px;

  & p {
    height: 100%;
    margin: 0;
  }
}

.confirm {
  margin-top: 14px;
  width: 100%;
  padding-left: 15px;
}

.proceed-btn {
  margin-top: 20px;
  max-width: 178px;
  width: 100%;
}
</style>
