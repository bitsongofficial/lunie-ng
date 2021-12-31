<template>
  <q-page class="validator">
    <div class="row grid">
      <validator-resume class="col-12" />

      <validator-delegation class="col-12 col-md-auto validator-delegation" />
      <validator-rewards class="col-12 col-md-auto validator-rewards" />

      <validator-address class="col-12" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ValidatorResume from 'src/modules/wallet/components/ValidatorResume.vue';
import ValidatorDelegation from 'src/modules/wallet/components/ValidatorDelegation.vue';
import ValidatorRewards from 'src/modules/wallet/components/ValidatorRewards.vue';
import ValidatorAddress from 'src/modules/wallet/components/ValidatorAddress.vue';

export default defineComponent({
  name: 'Validator',
  components: {
    ValidatorResume,
    ValidatorDelegation,
    ValidatorRewards,
    ValidatorAddress
}
});
</script>

<style lang="scss" scoped>
.validator {
  padding-top: 60px;
  padding-bottom: 20px;
}

.validator-rewards,
.validator-delegation {
  @media screen and (min-width: $breakpoint-md-min) {
    flex: 1;
  }
}

.grid {
  grid-gap: 30px;
}
</style>
