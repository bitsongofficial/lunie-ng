<template>
  <div class="any-address-content column items-center">
    <div class="col-12">
      <h1 class="title text-body-large text-white text-weight-medium q-mt-none text-center">{{ $t('login.explore') }}</h1>
    </div>

    <q-form class="col-12 column" @submit="signIn">
      <q-input
        color="transparent-gray"
        label-color="half-transparent-white"
        bg-color="transparent-gray"
        round
        standout
        v-model="address"
        :placeholder="$t('general.publicAddress')"
        :rules="[val => !!val || $t('errors.required'), val => isValidAddress(val) || $t('errors.invalidAddress')]"
        no-error-icon
        hide-bottom-space
        class="col-12"
      >
        <template v-slot:append>
          <q-icon name="svguse:icons.svg#anchor" size="16px" color="gray3" />
        </template>
      </q-input>

      <div class="explore-wrapper row items-center space-between">
        <h6 class="error text-accent text-weight-medium text-left q-my-none col-12 col-md-6">
          {{ $t('general.disclaimer') }}
        </h6>

        <q-btn class="explore btn-medium text-body2 col-12 col-md-6 text-center items-center" type="submit" rounded unelevated color="accent-2" text-color="white" padding="16px 48px">
          {{ $t('actions.explore') }}
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'src/store';
import { useQuasar } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { isValidAddress } from 'src/common/address';
import { SessionType } from 'src/models';
import { notifyError } from 'src/common/notify';

export default defineComponent({
  name: 'Explore',
  setup() {
    const quasar = useQuasar();
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const address = ref<string>('');

    const signIn = async () => {
      try {
        quasar.loading.show();
        await store.dispatch('authentication/signIn', {
          address,
          sessionType: SessionType.EXPLORE,
        });

        const path = (route.query.r as string) || { name: 'wallet' };
        await router.replace(path);
      } catch (error) {
        console.error(error);
        notifyError('Login Failed');
      } finally {
        quasar.loading.hide();
      }
    };

    return {
      address,
      signIn,
      isValidAddress
    }
  }
})
</script>

<style lang="scss" scoped>
.any-address-content {
  padding: 9px 16px 9px;
}

.title {
  margin-bottom: 32px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: 60px;
  }
}

.explore-wrapper {
  margin-top: 27px;
}

.error {
  margin-bottom: 12px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: 12px;
  }
}

.explore {
  width: 100%;

  @media screen and (min-width: $breakpoint-md-min) {
    width: unset;
    min-width: 145px !important;
    margin-left: auto;
  }
}

.warning {
  padding: 0 26px;
  margin-top: 47px;
  margin-bottom: 12px;
}
</style>
