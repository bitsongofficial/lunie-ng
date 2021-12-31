<template>
  <div class="balance-summary">
    <div class="row" :class="{
      'q-gutter-y-md': quasar.screen.lt.md,
      'items-center': !quasar.screen.lt.md
    }">
      <div class="balance-section column no-wrap col-12 col-md-2">
        <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium">
          TOTAL BTSG
        </h3>

        <p class="balance-subtitle text-body-extra-large text-white q-my-none">
          16.670,34
        </p>
      </div>
      <div class="balance-section column no-wrap col-12 col-md-2">
        <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-center">
          REWARDS
        </h3>

        <p class="balance-subtitle text-body-extra-large text-white q-my-none">
          239,87
        </p>
      </div>
      <div class="balance-section column no-wrap col-12 col-md-2">
        <h3 class="balance-title q-my-none text-half-transparent-white text-body4 text-weight-medium text-center">
          AVAILABLE
        </h3>

        <p class="balance-subtitle text-body-extra-large text-white q-my-none">
          10.670,44
        </p>
      </div>

      <q-btn class="send-btn btn-medium text-h6 col-12 col-md-2" rounded unelevated color="accent-2" text-color="white" padding="12px 24px 10px 26px">
        SEND <q-icon class="balance-icon rotate-270" name="svguse:icons.svg#arrow-right|0 0 14 14" size="12px" color="half-transparent-white" />
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BalanceSummary',
  setup() {
    const quasar = useQuasar();

    return {
      quasar,
    }
  }
});
</script>

<style lang="scss" scoped>
.balance-summary {
  background: $transparent-gray2;
  box-shadow: $full-secondary-box-shadow;
  backdrop-filter: blur(60px);
  border-radius: $generic-border-radius;
  padding: 34px 46px 30px 43px;
}

.balance-title {
  margin-bottom: 10px;
}

.balance-section {
  & .balance-title,
  & .balance-subtitle {
    text-align: center;
  }

  &:nth-child(1) {
    & .balance-title,
    & .balance-subtitle {
      @media screen and (min-width: $breakpoint-md-min) {
        text-align: left;
      }
    }
  }

  &:nth-child(2) {
    @media screen and (min-width: $breakpoint-md-min) {
      margin-left: auto;
      margin-right: 250px;
    }
  }

  &:nth-child(3) {
    @media screen and (min-width: $breakpoint-md-min) {
      margin-right: auto;
    }
  }
}

.balance-icon {
  margin-left: 32px;
}

.send-btn {
  @media screen and (min-width: $breakpoint-md-min) {
    max-width: 126px;
  }
}
</style>
