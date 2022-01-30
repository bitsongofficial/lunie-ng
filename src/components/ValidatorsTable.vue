<template>
  <q-table
    :rows="rows"
    :columns="columns"
    :visible-columns="visibleColumns"
    :loading="loading"
    :pagination="pagination"
    row-key="id"
    class="validators-table"
    flat
    square
    :rows-per-page-options="[0]"
    :bordered="false"
    hide-pagination
  >
    <template v-slot:no-data>
      <h5 class="text-half-transparent-white text-weight-medium">No validators available</h5>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props" class="validators-table-head-row">
        <q-th
          v-for="col in columns"
          :key="col.name"
          :props="props"
          class="text-body4 text-uppercase text-half-transparent-white text-weight-medium validators-table-head-col"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr class="validators-table-row cursor-pointer" @click="rowClick(props.row)" :props="props">
        <q-td key="name" class="text-subtitle2 text-white" :props="props">
          <div class="row no-wrap items-center">
            <q-avatar size="32px" :color="props.row.picture ? 'transparent' : 'secondary'">
              <img :src="props.row.picture" v-if="props.row.picture">
              <p class="text-subtitle2 text-uppercase q-my-none" v-else>
                {{ props.row.name[0] }}
              </p>
            </q-avatar>
            <p class="validator-name q-my-none text-subtitle2">
              {{ props.row.name }}
            </p>
            <!-- <q-icon class="info-icon" name="svguse:icons.svg#info|0 0 15 15" size="13px" color="primary" /> -->
          </div>
        </q-td>
        <q-td key="status" class="text-subtitle2 text-white" :props="props">
          <div class="validator-status bg-dark">
            <div class="validators-status-dot" :class="props.row.status === 'ACTIVE' ? 'bg-primary' : 'bg-negative'"></div>
          </div>
        </q-td>
        <q-td key="staked" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.delegation ? bigFigureOrShortDecimals(props.row.delegation.amount) : 'N/A' }}
          </p>
          <p class="text-overline q-my-none text-positive" v-if="hasRewards(props.row.operatorAddress)">
            + {{ filterStakingDenomReward(props.row.operatorAddress) }}
          </p>
        </q-td>
        <q-td key="rewards" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.expectedReturns ? bigFigureOrPercent(props.row.expectedReturns) : 'N/A' }}
          </p>
        </q-td>
        <q-td key="votingPower" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ bigFigureOrPercent(props.row.votingPower) }}
          </p>
          <p class="text-overline text-half-transparent-white q-my-none">
            {{ shortDecimals(props.row.tokens) }} {{ network.stakingDenom }}
          </p>
        </q-td>
        <q-td key="unstaked" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.undelegation ? bigFigureOrShortDecimals(props.row.undelegation.amount) : 'N/A' }}
          </p>
        </q-td>
        <q-td key="time" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.undelegation ? fromNow(props.row.undelegation.endTime) : 'N/A' }}
          </p>
        </q-td>
        <q-td key="actions" :props="props">
          <q-btn flat unelevated padding="2px" @click.stop="">
            <q-icon name="svguse:icons.svg#vertical-dots|0 0 4 16" size="16px" color="primary" />

            <q-menu class="menu-list" anchor="center left" self="center middle" :offset="[90, 0]">
              <q-item class="menu-item" active-class="active" clickable @click="openClaimDialog(props.row)" v-if="getRewards(props.row.operatorAddress).length > 0" v-close-popup>
                <q-item-section class="text-center text-subtitle2">Claim</q-item-section>
              </q-item>
              <q-item class="menu-item" active-class="active" clickable @click="openStakeDialog(props.row)" v-close-popup>
                <q-item-section class="text-center text-subtitle2">Delegate</q-item-section>
              </q-item>
              <q-item class="menu-item" active-class="active" @click="openRestakeDialog(props.row)" :disable="getDelegations(props.row.operatorAddress).length === 0" :clickable="getDelegations(props.row.operatorAddress).length > 0" v-close-popup>
                <q-item-section class="text-center text-subtitle2">Redelegate</q-item-section>
              </q-item>
              <q-item class="menu-item" active-class="active" @click="openUnstakeDialog(props.row)" :disable="getDelegations(props.row.operatorAddress).length === 0" :clickable="getDelegations(props.row.operatorAddress).length > 0" v-close-popup>
                <q-item-section class="text-center text-subtitle2">Undelegate</q-item-section>
              </q-item>
            </q-menu>
          </q-btn>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, onMounted } from 'vue';
import { Validator } from 'src/models';
import { LooseDictionary } from 'quasar';
import { useRouter } from 'vue-router';
import { useStore } from 'src/store';
import { bigFigureOrPercent, bigFigureOrShortDecimals, shortDecimals } from 'src/common/numbers';
import { fromNow } from 'src/common/date';
import { useDelegatorActions } from 'src/hooks/useDelegatorActions';

export default defineComponent({
  name: 'ValidatorsTable',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Array as PropType<Validator[]>,
      default: () => [],
    },
    unstaking: {
      type: Boolean,
      default: false,
    },
    staking: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const rewards = computed(() => store.state.data.rewards);
    const network = computed(() => store.state.authentication.network);
    const session = computed(() => store.state.authentication.session);

    const pagination = {
      sortBy: 'votingPower',
      descending: true,
      rowsPerPage: 0
    };

    const columns = computed(() => [
      {
        name: 'name',
        label: 'Name',
        align: 'left',
        field: 'name',
      },
      {
        name: 'status',
        label: 'Status',
        align: 'center',
        field: 'status',
      },
      {
        name: 'staked',
        label: `Delegated (${network.value.stakingDenom})`,
        align: 'center',
        field: 'staked',
      },
      {
        name: 'rewards',
        label: 'APR',
        align: 'center',
        field: 'rewards',
      },
      {
        name: 'votingPower',
        label: 'Voting Power',
        align: 'center',
        field: 'votingPower',
      },
      {
        name: 'unstaked',
        label: `Undelegated (${network.value.stakingDenom})`,
        align: 'center',
        field: 'unstaked',
      },
      {
        name: 'time',
        label: 'Remaining Time',
        align: 'center',
        field: 'time',
      },
      {
        name: 'actions',
        align: 'right'
      },
    ]);

    const visibleColumns = computed<string[]>(() => {
      const extra = !session.value || (session.value && session.value.sessionType !== 'keplr') ? [] : ['actions'];

      if (props.unstaking) {
        return ['name', 'unstaked', 'time'];
      }

      if (props.staking) {
        return ['name', 'status', 'staked', 'rewards', 'votingPower', ...extra];
      }

      return ['name', 'status', 'rewards', 'votingPower', ...extra];
    });

    const rowClick = async (row: LooseDictionary) => {
      try {
        const validator = row as Validator;
        await router.push(`/validators/${validator.id}`);
      } catch (error) {
        console.error(error);
      }
    };

    const getRewards = (operatorAddress: string) => {
      return rewards.value.filter(({ validator }) => validator.operatorAddress === operatorAddress);
    }

    const getDelegations = (operatorAddress: string) => {
      return store.state.data.delegations.filter(({ validator }) => validator.operatorAddress === operatorAddress);
    }

    const filterStakingDenomReward = (operatorAddress: string) => {
      const rewards = getRewards(operatorAddress);

      const stakingDenomRewards = rewards.filter(
        (reward) => reward.denom === network.value.stakingDenom
      );

      return stakingDenomRewards.length > 0 ? stakingDenomRewards[0].amount : 0
    }

    const hasRewards = (operatorAddress: string) => {
      const rewards = getRewards(operatorAddress);

      return rewards.find((reward) =>
        reward.denom === network.value.stakingDenom && reward.amount > 0.000001
      ) !== undefined;
    };

    onMounted(() => {
      store.dispatch('data/updateValidatorImages', { validators: props.rows }).catch((err) => console.error(err));
    });

    return {
      network,
      pagination,
      columns,
      visibleColumns,
      getDelegations,
      hasRewards,
      filterStakingDenomReward,
      rowClick,
      getRewards,
      bigFigureOrPercent,
      bigFigureOrShortDecimals,
      shortDecimals,
      fromNow,
      ...useDelegatorActions(),
    }
  }
});
</script>

<style lang="scss" scoped>
.validators-table {
  background: transparent;

  &::v-deep(.q-table) {
    border-spacing: 0 6px;
    padding-bottom: 20px;
  }
}

.validators-table-head-col {
  padding-top: 21px;
  padding-bottom: 21px;
  border: none;

  &:first-child {
    padding-left: 40px;
  }

  &:last-child {
    padding-right: 40px;
  }
}

.id-cell {
  width: 60px;
}

.validators-table-row {
  background: none;
  backdrop-filter: blur(60px);

  & .q-td {
    background: $transparent-gray2;
    border-bottom: none;
    height: 60px;

    &:first-child {
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      padding-left: 40px;
    }

    &:last-child {
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      padding-right: 40px;
    }
  }
}

.validator-name {
  margin-left: 17px;
  margin-right: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
}

.info-icon {
  min-width: 13px;
}

.validator-status {
  margin: 0 auto;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.validators-status-dot {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  border-radius: 50%;
}
</style>
