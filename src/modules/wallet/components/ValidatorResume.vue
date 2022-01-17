<template>
  <div class="validator-resume column">
    <div class="row items-center">
      <q-avatar class="validator-avatar col-auto" size="100px" :color="validator.picture ? 'transparent' : 'secondary'" v-if="validator">
        <img :src="validator.picture" v-if="validator.picture">
        <p class="text-h3 text-uppercase text-white q-my-none" v-else>
          {{ validator.name[0] }}
        </p>
      </q-avatar>
      <q-skeleton class="validator-avatar col-auto" type="QAvatar" width="100px" height="100px" animation-speed="700" dark v-else-if="loading"></q-skeleton>

      <div class="validator-header col-12 col-md">
        <div class="validator-header-row row items-center">
          <h2 class="text-body-extra-large text-white q-my-none" v-if="validator">
            {{ validator.name }}
          </h2>
          <q-skeleton type="text" width="260px" height="60px" animation-speed="700" dark square v-else-if="loading"></q-skeleton>

          <validator-status class="validator-status" :status="validator.status" v-if="validator" />
          <q-skeleton class="validator-status" type="QBadge" width="74px" height="24px" animation-speed="700" dark v-else-if="loading"></q-skeleton>
        </div>
        <div class="row items-center justify-between">
          <p class="text-h4 text-white q-my-none col-12 col-md-8" v-if="validator">
            {{ validator.details }}
          </p>
          <q-skeleton type="text" width="180px" height="30px" animation-speed="700" dark square v-else-if="loading"></q-skeleton>

          <a :href="validator.website" target="_blank" class="website text-subtitle2 text-half-transparent-white col-md-auto q-my-none" v-if="validator && validator.website && validator.website.length > 0">
            {{ validator.website }}
          </a>
        </div>
      </div>
    </div>

    <div class="validator-footer" v-if="validator">
      <div class="row items-start justify-around" :class="{
        'q-col-gutter-md': quasar.screen.lt.md
      }">
        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">APR</label>

          <p class="text-body-large text-white q-my-none">
            {{ validator.expectedReturns ? bigFigureOrPercent(validator.expectedReturns) : 'N/A' }}
          </p>
        </div>
        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">VOTING POWER</label>

          <p class="text-body-large text-white q-my-none">
            {{ bigFigureOrPercent(validator.votingPower) }}
          </p>

          <label class="text-body4 text-weight-medium text-uppercase text-white q-mt-xs">{{ shortDecimals(validator.tokens) }} {{ network.stakingDenom }}</label>
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
    <div class="validator-footer" v-else-if="loading">
      <div class="row items-start justify-around" :class="{
        'q-col-gutter-md': quasar.screen.lt.md
      }">
        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">APR</label>

          <q-skeleton type="text" width="60px" height="30px" animation-speed="700" dark square></q-skeleton>
        </div>
        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">VOTING POWER</label>

          <q-skeleton type="text" width="60px" height="30px" animation-speed="700" dark square></q-skeleton>

          <q-skeleton class="q-mt-xs" type="text" width="80px" height="12px" animation-speed="700" dark square></q-skeleton>
        </div>
        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">SELF STAKE</label>

          <q-skeleton type="text" width="60px" height="30px" animation-speed="700" dark square></q-skeleton>
        </div>
        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">STAKERS</label>

          <q-skeleton type="text" width="60px" height="30px" animation-speed="700" dark square></q-skeleton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { Delegation, Validator } from 'src/models';
import { defineComponent, PropType, computed } from 'vue';
import { bigFigureOrPercent, shortDecimals } from 'src/common/numbers';
import { useStore } from 'src/store';

import ValidatorStatus from 'src/components/ValidatorStatus.vue';

export default defineComponent({
  name: 'ValidatorResume',
  components: {
    ValidatorStatus
  },
  props: {
    validator: {
      type: Object as PropType<Validator>
    },
    validatorDelegations: {
      type: Array as PropType<Delegation[]>,
      required: true
    },
    selfStake: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean
    }
  },
  setup() {
    const store = useStore();
    const quasar = useQuasar();
    const network = computed(() => store.state.authentication.network);

    return {
      quasar,
      network,
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
  min-width: 100px;
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
