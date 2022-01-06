<template>
  <q-page class="validator">
    <div class="row grid">
      <validator-resume
        v-if="validator"
        :validator="validator"
        :validator-delegations="validatorDelegations"
        :self-stake="selfStakeValidator"
        class="col-12"
      />

      <validator-delegation v-if="validator" :validator="validator" class="col-12 col-md-auto validator-delegation" />
      <validator-rewards class="col-12 col-md-auto validator-rewards" />

      <validator-address v-if="validator" :validator="validator" class="col-12" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';

import ValidatorResume from 'src/modules/wallet/components/ValidatorResume.vue';
import ValidatorDelegation from 'src/modules/wallet/components/ValidatorDelegation.vue';
import ValidatorRewards from 'src/modules/wallet/components/ValidatorRewards.vue';
import ValidatorAddress from 'src/modules/wallet/components/ValidatorAddress.vue';

export default defineComponent({
  name: 'Validator',
  props: {
    address: {
      type: String,
      required: true
    }
  },
  components: {
    ValidatorResume,
    ValidatorDelegation,
    ValidatorRewards,
    ValidatorAddress
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const validator = computed(() => store.state.data.validators.find(el => el.id === props.address));
    const validatorDelegations = computed(() => store.state.data.validatorDelegations);
    const selfStakeValidator = computed(() => store.state.data.selfStakeValidator);

    onMounted(async () => {
      if (validator.value === undefined) {
        await router.replace({ name: 'wallet' });
      } else {
        store.dispatch('data/getValidatorDelegations', validator.value).catch(err => console.error(err));
        store.dispatch('data/getValidatorSelfStake', validator.value).catch(err => console.error(err));
      }
    });

    return {
      validator,
      validatorDelegations,
      selfStakeValidator
    }
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
