<template>
  <q-page class="column items-center">
    <div class="center-login-inner q-my-auto">
      <div class="content-login-inner bg-transparent-gray">
        <q-btn class="close-login-inner" round flat unelevated padding="4px" color="white" @click="router.back" v-if="canGoBack">
          <q-icon name="svguse:icons.svg#close|0 0 12 12" size="10px" />
        </q-btn>

        <router-view v-slot="{ Component }">
          <transition
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            mode="out-in"
            appear
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>

    <h6 class="warning center-login-inner text-accent text-center">{{ $t('general.disclaimerFull') }}</h6>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const canGoBack = computed<boolean>(() => router.currentRoute.value.name !== 'login-home');

    return {
      canGoBack,
      router
    }
  }
})
</script>

<style lang="scss" scoped>
.content-login-inner {
  position: relative;
  padding: 47px 26px 29px;
  box-shadow: $secondary-box-shadow;
  border-radius: 10px;
  width: 100%;
}

.center-login-inner {
  max-width: $container-center;
  width: 100%;
}

.close-login-inner {
  position: absolute;
  top: 31px;
  right: 34px;
}

.warning {
  padding: 0 26px;
  margin-top: 12px;
  margin-bottom: 44px;
}
</style>
