<template>
  <q-dialog ref="dialogRef" :no-backdrop-dismiss="true" :no-esc-dismiss="true" :no-route-dismiss="true" @hide="onDialogHide">
    <q-card class="body column items-center">
      <div class="dialog-header row items-center justify-between full-width">
        <h2 class="title text-body-large text-white q-my-none" v-if="title">{{ title }}</h2>
      </div>

      <div class="success col column fit">
        <q-icon class="success-icon" name="svguse:icons.svg#check|0 0 70 70" size="100px" color="positive" v-if="success" />
        <q-icon class="success-icon" name="svguse:icons.svg#close-outlined|0 0 70 70" size="100px" color="negative" v-else />

        <h3 class="text-body-extra-large text-white text-weight-medium q-mt-none q-mb-md" :class="{
          'text-center': !success
        }">{{ subtitle }}</h3>

        <a class="link text-h4 text-half-transparent-white" :href="mintscanLink" target="_blank" v-if="mintscanLink">{{ hash }}</a>

        <q-btn @click="close" class="btn btn-medium text-body2 text-untransform text-weight-medium" rounded unelevated color="accent-2" text-color="white" padding="15px 20px 14px">
          Continue
        </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { mintScanLink } from 'src/util';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MessageDialog',
  props: {
    title: {
      type: String,
      default: 'Success!'
    },
    subtitle: {
      type: String,
      default: 'You have successfully transferred your btsg'
    },
    hash: {
      type: String,
    },
    mintscan: {
      type: String,
    },
    success: {
      type: Boolean,
      default: true,
    }
  },
  emits: [
    ...useDialogPluginComponent.emits,
  ],
  setup(props) {
    const { dialogRef, onDialogHide } = useDialogPluginComponent();
    const mintscanLink = props.hash && props.mintscan ? mintScanLink(props.hash, props.mintscan) : undefined;

    const close = () => {
      dialogRef.value?.hide();
    };

    return {
      mintscanLink,
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
  background: $alternative;
  backdrop-filter: blur(60px);
  padding: 33px 36px 28px;
  box-shadow: $secondary-box-shadow;
}

.success-icon {
  margin: 0 auto 16px;
}

.success {
  padding: 0 12px 10px;
}

.btn {
  width: 100%;
  margin-top: auto;
}

.link {
  word-break: break-all;
  margin-bottom: 36px;
}
</style>
