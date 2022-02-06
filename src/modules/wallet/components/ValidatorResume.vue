<template>
  <div class="validator-resume column">
    <div class="validator-top row items-center">
      <q-avatar class="validator-avatar col-auto" size="132px" :color="validator.picture ? 'transparent' : 'secondary'" v-if="validator">
        <img :src="validator.picture" v-if="validator.picture">
        <p class="text-h3 text-uppercase text-white q-my-none" v-else>
          {{ validator.name[0] }}
        </p>
      </q-avatar>
      <q-skeleton class="validator-avatar col-auto" type="QAvatar" width="132px" height="132px" animation-speed="700" dark v-else-if="loading"></q-skeleton>

      <div class="validator-header col-12 col-md">
        <div class="validator-header-row row items-center">
          <h2 class="text-body-extra-large text-white q-my-none" v-if="validator">
            {{ validator.name }}
          </h2>
          <q-skeleton type="text" width="260px" height="60px" animation-speed="700" dark square v-else-if="loading"></q-skeleton>

          <validator-status class="validator-status" :status="validator.status" v-if="validator" />
          <q-skeleton class="validator-status" type="QBadge" width="74px" height="24px" animation-speed="700" dark v-else-if="loading"></q-skeleton>

          <a :href="validator.website" target="_blank" class="website text-subtitle2 text-transparent-gray4 col-md-auto q-my-none q-ml-auto" v-if="validator && validator.website && validator.website.length > 0">
            {{ validator.website }}
          </a>
        </div>
        <div class="row items-center justify-between">
          <p class="text-h4 text-half-transparent-gray4 q-my-none col-12 col-md-8" v-if="validator">
            {{ validator.details }}
          </p>
          <q-skeleton type="text" width="180px" height="30px" animation-speed="700" dark square v-else-if="loading"></q-skeleton>
        </div>
      </div>
    </div>

    <div class="validator-footer" v-if="validator">
      <div class="socials">
        <q-icon color="gray4" name="svguse:icons.svg#twitter|0 0 30 24" size="30px" />
      </div>
      <div v-if="!loadingDetails " class="stats row items-start justify-between" :class="{
        'q-col-gutter-md': quasar.screen.lt.md
      }">
        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">{{ $t('general.apr') }}</label>

          <p class="text-body-large text-white q-my-none">
            {{ validator.expectedReturns ? bigFigureOrPercent(validator.expectedReturns) : 'N/A' }}
          </p>
        </div>

        <q-separator class="stats-separator" color="full-transparent-white" vertical />

        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">{{ $t('general.votingPower') }}</label>

          <p class="text-body-large text-white q-my-none">
            {{ bigFigureOrPercent(validator.votingPower) }}
          </p>

          <label class="text-body4 text-weight-medium text-uppercase text-half-transparent-white q-mt-xs">{{ shortDecimals(validator.tokens) }} {{ network.stakingDenom }}</label>
        </div>

        <q-separator class="stats-separator" color="full-transparent-white" vertical />

        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">{{ $t('general.selfStake') }}</label>

          <p class="text-body-large text-white q-my-none">
            {{ shortDecimals(selfStake) }}
          </p>
        </div>

        <q-separator class="stats-separator" color="full-transparent-white" vertical />

        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">{{ $t('general.stakers') }}</label>

          <p class="text-body-large text-white q-my-none">
            {{ validatorDelegations.length }}
          </p>
        </div>
      </div>
      <div v-else class="stats row items-start justify-between" :class="{
        'q-col-gutter-md': quasar.screen.lt.md
      }">
        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">{{ $t('general.apr') }}</label>

          <q-skeleton class="q-mx-auto" width="80px" height="36px" animation-speed="700" dark></q-skeleton>
        </div>

        <q-separator class="stats-separator" color="full-transparent-white" vertical />

        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">{{ $t('general.votingPower') }}</label>

          <q-skeleton class="q-mx-auto" width="80px" height="36px" animation-speed="700" dark></q-skeleton>
        </div>

        <q-separator class="stats-separator" color="full-transparent-white" vertical />

        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">{{ $t('general.selfStake') }}</label>

          <q-skeleton class="q-mx-auto" width="80px" height="36px" animation-speed="700" dark></q-skeleton>
        </div>

        <q-separator class="stats-separator" color="full-transparent-white" vertical />

        <div class="column items-center col-6 col-md-auto">
          <label class="validator-footer-title text-body4 text-weight-medium text-uppercase text-half-transparent-white">{{ $t('general.stakers') }}</label>

          <q-skeleton class="q-mx-auto" width="80px" height="36px" animation-speed="700" dark></q-skeleton>
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

    const loadingDetails = computed(() => store.state.data.validatorDelegationsLoading || store.state.data.selfStakeValidatorLoading);

    return {
      loadingDetails,
      quasar,
      network,
      bigFigureOrPercent,
      shortDecimals
    }
  }
});
</script>


<style lang="scss" scoped>
.website {
  margin-top: 16px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-top: 0;
  }
}

.validator-avatar {
  min-width: 132px;
  margin-bottom: 28px;
  box-shadow: $black-box-shadow2;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-right: 28px;
    margin-bottom: 0;
  }
}

.validator-header-row {
  margin-right: 10px;
  margin-bottom: 8px;
}

.validator-status {
  margin-left: 15px;
}

.validator-header {
  margin-bottom: 30px;
}

.validator-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $transparent-gray2;
  box-shadow: $full-secondary-box-shadow;
  backdrop-filter: blur(60px);
  border-radius: 20px;
  flex-direction: column;
  padding: 24px;

  @media screen and (min-width: $breakpoint-md-min) {
    flex-direction: row;
    min-height: 120px;
    padding-left: 86px;
    padding-right: 76px;
  }
}

.validator-footer-title {
  margin-bottom: 6px;
}

.validator-top {
  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: -18px;
    z-index: 1;
    padding-left: 32px;
  }
}

.socials {
  opacity: 0.1;
  margin-bottom: 24px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-right: 100px;
    margin-bottom: 0;
  }
}

.stats {
  flex: 1;
}

.stats-separator {
  margin: auto 0;
  height: 61px;
  display: none;

  @media screen and (min-width: $breakpoint-md-min) {
    margin-bottom: 0;
    display: block;
  }
}
</style>
