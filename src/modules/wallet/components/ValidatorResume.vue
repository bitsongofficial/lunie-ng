<template>
  <div class="validator-resume column">
    <div class="row items-center no-wrap">
      <q-avatar class="validator-avatar" size="100px">
        <img src="https://cdn.quasar.dev/img/avatar.png">
      </q-avatar>

      <div class="validator-header col">
        <div class="validator-header-row row no-wrap items-center">
          <h2 class="text-body-large text-white q-my-none">
            Forbole
          </h2>

          <q-chip class="validator-status proposal-status text-uppercase text-weight-medium q-mx-none q-my-none text-body3" text-color="white" color="info">
            active
          </q-chip>
        </div>
        <div class="row no-wrap items-center justify-between">
          <p class="text-subtitle2 text-white q-my-none">
            Co-building the interchain
          </p>

          <p class="text-subtitle2 text-half-transparent-white q-my-none">
            https://twitter.com/forbolestaking
          </p>
        </div>
      </div>
    </div>

    <div class="validator-footer row items-start justify-around">
      <div class="column items-center">
        <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">REWARDS</label>

        <p class="text-body-large text-white q-my-none">
          29,66 %
        </p>
      </div>
      <div class="column items-center">
        <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">VOTING POWER</label>

        <p class="text-body-large text-white q-my-none">
          29,66 %
        </p>

        <label class="text-body4 text-weight-medium text-uppercase text-white q-mt-xs">4.456.283,23 BTSG</label>
      </div>
      <div class="column items-center">
        <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">TOTAL STAKE</label>

        <p class="text-body-large text-white q-my-none">
          4.467.268,78
        </p>
      </div>
      <div class="column items-center">
        <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">STAKERS</label>

        <p class="text-body-large text-white q-my-none">
          64
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ValidatorResume',
});
</script>


<style lang="scss" scoped>
.validator-resume {
  background-color: $transparent-gray;
  backdrop-filter: blur(60px);
  border-radius: 10px;
  padding: 45px 47px 17px;
}

.validator-avatar {
  margin-right: 35px;
  box-shadow: $black-box-shadow;
}

.validator-header {
  padding-top: 10px;
  padding-bottom: 38px;
  border-bottom: 1px solid transparentize($color: $accent-3, $amount: 0.5);
}

.validator-header-row {
  margin-right: 10px;
  margin-bottom: 5px;
}

.validator-status {
  margin-left: 15px;
}

.validator-footer {
  margin-top: 24px;
}

.validator-footer-title {
  margin-bottom: 6px;
}
</style>
