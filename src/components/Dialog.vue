<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="body column items-center">
      <div class="dialog-header row items-center justify-between full-width">
        <h2 class="title text-body-large text-white q-my-none" v-if="title">{{ title }}</h2>

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

      <q-form class="col column items-center fit" @submit="success = true" v-if="!success">
        <div class="field-block column full-width">
          <label class="field-label text-uppercase text-primary text-h6 text-weight-medium">{{ toLabel }}</label>

          <q-select
            v-model="to"
            rounded
            standout
            emit-value
            map-options
            :options="[{ 'label': 'BasBlock', 'value': 'basblock' }]"
            bg-color="transparent-white"
            color="transparent-white"
            label-color="primary"
            class="full-width large"
            no-error-icon
            hide-bottom-space
            :rules="[val => !!val || 'Required field']"
          >
            <template v-slot:selected-item="{ opt }">
              <div class="row items-center cursor-pointer">
                <q-avatar class="validator-avatar" size="32px">
                  <img src="https://cdn.quasar.dev/img/avatar.png">
                </q-avatar>

                <label class="text-white text-body2 cursor-pointer">{{ opt.label }}</label>
              </div>
            </template>
          </q-select>
        </div>

        <div class="field-block column full-width">
          <label class="field-label text-uppercase text-primary text-h6 text-weight-medium">{{ amountLabel }}</label>

          <q-input
            color="transparent-white"
            label-color="accent-5"
            bg-color="transparent-white"
            round
            standout
            v-model.number="amount"
            no-error-icon
            hide-bottom-space
            class="quantity-input full-width large"
            :rules="[val => !!val || 'Required field']"
          >
            <template v-slot:append>
              <q-btn class="max-btn btn-super-extra-small text-body3" rounded unelevated color="accent-2" text-color="white" padding="4px 7px 3px">
                MAX
              </q-btn>
              <label class="text-body2 text-primary">BTSG</label>
            </template>
          </q-input>
        </div>

        <div class="row full-width items-center justify-end q-mt-auto">
          <q-btn
            unelevated
            rounded
            text-color="white"
            class="close no-hoverable"
            padding="2px"
            @click="close"
          >
            <label class="text-h6 text-capitalize no-pointer-events">{{ cancel }}</label>
          </q-btn>

          <q-btn type="submit" class="submit btn-medium text-h6" rounded unelevated color="accent-2" text-color="white" padding="15px 20px 14px">
            {{ submit }}
          </q-btn>
        </div>
      </q-form>

      <div class="success col column fit" v-else>
        <q-icon class="success-icon" name="svguse:icons.svg#check|0 0 70 70" size="64px" color="accent" />

        <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-sm">{{ successTitle }}</h3>

        <p class="text-h4 text-half-transparent-white">{{ successSubtitle }}</p>

        <q-btn type="submit" class="transaction-btn btn-medium text-body2 text-untransform text-weight-medium" rounded unelevated color="accent-gradient" text-color="white" padding="15px 20px 14px">
          See your transaction
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Dialog',
  props: {
    title: {
      type: String,
    },
    cancel: {
      type: String,
      default: 'Cancel'
    },
    submit: {
      type: String,
      default: 'Confirm'
    },
    toLabel: {
      type: String,
      default: 'Stake to'
    },
    amountLabel: {
      type: String,
      default: 'Amount to stake'
    },
    successTitle: {
      type: String,
      default: 'Successfully staked'
    },
    successSubtitle: {
      type: String,
      default: 'You have successifully staked your BTSGs.'
    }
  },
  emits: [
    ...useDialogPluginComponent.emits,
  ],
  setup() {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();

    const to = ref<string>('basblock');
    const amount = ref<number>(0);
    const success = ref<boolean>(false);

    const close = () => {
      dialogRef.value?.hide();
    };

    return {
      to,
      amount,
      success,
      dialogRef,
      close,
      onDialogHide
    }
  },
})
</script>

<style lang="scss" scoped>
.title {
  padding-left: 9px;
}

.dialog-header {
  margin-bottom: 41px;
}

.body {
  width: 100%;
  min-height: 446px;
  max-width: 508px;
  border-radius: 10px;
  background: $transparent-gray;
  backdrop-filter: blur(60px);
  padding: 33px 36px 28px;
  box-shadow: $secondary-box-shadow;
}

.close-icon {
  margin-left: 15px;
}

.submit {
  width: 100%;
  max-width: 217px;
  margin-left: 34px;
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
}

.success {
  padding: 0 12px 10px;
}

.transaction-btn {
  width: 100%;
  max-width: 197px;
  margin-top: 36px;
}
</style>
