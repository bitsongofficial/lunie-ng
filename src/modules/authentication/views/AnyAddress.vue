<template>
  <div class="any-address-content column items-center">
    <h1 class="title text-body-large text-white text-weight-medium q-mt-none text-center">Explore with any address</h1>

    <q-form>
      <q-input
        color="transparent-gray"
        label-color="half-transparent-white"
        bg-color="transparent-gray"
        round
        standout
        v-model="address"
        placeholder="Public address"
        :rules="[val => !!val || 'Field is required']"
        no-error-icon
        hide-bottom-space
      >
        <template v-slot:append>
          <q-icon name="svguse:icons.svg#anchor" size="16px" color="gray3" />
        </template>
      </q-input>

      <div class="explore-wrapper row no-wrap items-center space-between">
        <h6 class="error text-accent text-weight-medium text-left q-my-none">
          Use this software at your own risk. never enter your seed phrase into untrusted software.
        </h6>

        <q-btn class="explore btn-medium text-body2" rounded unelevated color="accent-2" text-color="white" padding="16px 48px">
          Explore
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AnyAddress',
  setup() {
    const address = ref<string>('');

    return {
      address,
    }
  }
})
</script>

<style lang="scss" scoped>
.any-address-content {
  padding: 9px 16px 9px;
}

.title {
  margin-bottom: 60px;
}

.explore-wrapper {
  margin-top: 27px;
}

.explore {
  min-width: 145px !important;
  margin-left: 62px;
}

.warning {
  padding: 0 26px;
  margin-top: 47px;
  margin-bottom: 12px;
}
</style>
