<template>
  <div class="validator-resume column">
    <div class="row items-center">
      <q-avatar class="validator-avatar col-auto" size="100px">
        <img :src="validator.picture">
      </q-avatar>

      <div class="validator-header col-12 col-md">
        <div class="validator-header-row row items-center">
          <h2 class="text-body-extra-large text-white q-my-none">
            {{ validator.name }}
          </h2>

          <validator-status class="validator-status" :status="validator.status" />
        </div>
        <div class="row items-center justify-between">
          <p class="text-h4 text-white q-my-none col-12 col-md-8">
            {{ validator.details }}
          </p>

          <a :href="validator.website" target="_blank" class="website text-subtitle2 text-half-transparent-white col-md-auto q-my-none" v-if="validator.website && validator.website.length > 0">
            {{ validator.website }}
          </a>
        </div>
      </div>
    </div>

    <div class="validator-footer">
      <div class="row items-start justify-around" :class="{
        'q-col-gutter-md': quasar.screen.lt.md
      }">
        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">REWARDS</label>

          <p class="text-body-large text-white q-my-none">
            {{ validator.expectedReturns ? bigFigureOrPercent(validator.expectedReturns) : '--' }}
          </p>
        </div>
        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">VOTING POWER</label>

          <p class="text-body-large text-white q-my-none">
            {{ bigFigureOrPercent(validator.votingPower) }}
          </p>

          <label class="text-body4 text-weight-medium text-uppercase text-white q-mt-xs">{{ shortDecimals(validator.tokens) }} BTSG</label>
        </div>
        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">SELF STAKE</label>

          <p class="text-body-large text-white q-my-none">
            {{ shortDecimals(selfStake) }}
          </p>
        </div>
        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">STAKERS</label>

          <p class="text-body-large text-white q-my-none">
            {{ validatorDelegations.length }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { Delegation, Validator } from 'src/models';
import { defineComponent, PropType } from 'vue';
import { bigFigureOrPercent, shortDecimals } from 'src/common/numbers';
import ValidatorStatus from 'src/components/ValidatorStatus.vue';

export default defineComponent({
  name: 'ValidatorResume',
  components: {
    ValidatorStatus
  },
  props: {
    validator: {
      type: Object as PropType<Validator>,
      required: true
    },
    validatorDelegations: {
      type: Array as PropType<Delegation[]>,
      required: true
    },
    selfStake: {
      type: Number,
      required: true
    }
  },
  setup() {
    const quasar = useQuasar();

    return {
      quasar,
      bigFigureOrPercent,
      shortDecimals
    }
  }
});
</script>


<style lang="scss" scoped>
.validator-resume {
  background-color: $transparent-gray;
  backdrop-filter: blur(60px);
  border-radius: 10px;
  padding: 32px;

  @media screen and (min-width: $breakpoint-md-min) {
    padding: 45px 47px 17px;
  }
}

.website {
  margin-top: 16px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-top: 0;
  }
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
  margin-bottom: 8px;
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
