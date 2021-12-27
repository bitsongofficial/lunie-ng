<template>
  <q-page class="validator">
    <validator-resume class="validator-resume" />

    <div class="center">
      <validator-delegation />
      <validator-rewards />
    </div>

    <validator-address />
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

.validator-resume {
  margin-bottom: 30px;
}

.center {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;
  margin-bottom: 30px;
}
</style>
