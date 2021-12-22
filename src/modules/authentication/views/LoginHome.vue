<template>
  <div class="login-home-content">
    <h1 class="text-body-large text-white text-weight-medium q-mt-none q-mb-md text-center">Welcome</h1>
    <p class="subtitle text-subtitle2 text-half-transparent-white text-weight-medium q-mt-none text-center">Bitsong Mainnet</p>

    <q-list>
      <item clickable details to="login/any-address" v-ripple leftIcon="svguse:icons.svg#anchor" title="Explore with any address" />
      <item clickable details disable leftIcon="svguse:icons.svg#chrome" title="Bitsong Browser Extension" />
      <item clickable details v-ripple leftIcon="svguse:icons.svg#chrome" title="Keplr Browser Extension" />
      <item clickable details to="login/ledger" v-ripple class="q-my-none" leftIcon="svguse:icons.svg#battery|0 0 24 14" title="Ledger Nano" />
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Item from 'src/components/Item.vue';

export default defineComponent({
  name: 'LoginHome',
  components: {
    Item,
  },
});
</script>

<style lang="scss" scoped>
.login-home-content {
  padding: 0 7px;
}

.subtitle {
  margin-bottom: 48px;
}
</style>
