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
    virtual-scroll
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
        <q-td key="id" class="text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.rowIndex + 1 }}
          </p>
        </q-td>
        <q-td key="name" class="text-subtitle2 text-white" :props="props">
          <div class="row no-wrap items-center">
            <q-avatar size="32px">
              <img :src="props.row.picture">
            </q-avatar>
            <p class="validator-name q-my-none text-subtitle2">
              {{ props.row.name }}
            </p>
            <q-icon name="svguse:icons.svg#info|0 0 15 15" size="13px" color="primary" />
          </div>
        </q-td>
        <q-td key="status" class="text-subtitle2 text-white" :props="props">
          <q-chip class="status q-mx-none q-my-none text-body3" text-color="white" color="info">
            {{ props.row.status }}
          </q-chip>
        </q-td>
        <q-td key="staked" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.staked }} %
          </p>
        </q-td>
        <q-td key="rewards" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.expectedReturns ? bigFigureOrPercent(props.row.expectedReturns) : '--' }}
          </p>
        </q-td>
        <q-td key="votingPower" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ bigFigureOrPercent(props.row.votingPower) }}
          </p>
        </q-td>
        <q-td key="available" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.available }} %
          </p>
        </q-td>
        <q-td key="unstaked" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.unstaked }} %
          </p>
        </q-td>
        <q-td key="time" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.time }} days
          </p>
        </q-td>
        <q-td key="actions" :props="props">
          <q-btn flat unelevated padding="2px" @click.stop="">
            <q-icon name="svguse:icons.svg#vertical-dots|0 0 4 16" size="16px" color="primary" />

            <q-menu class="menu-list" anchor="center left" self="center middle" :offset="[90, 0]">
              <q-item class="menu-item" active-class="active" clickable>
                <q-item-section class="text-center text-subtitle2">Delegate</q-item-section>
              </q-item>
              <q-item class="menu-item" active-class="active" clickable>
                <q-item-section class="text-center text-subtitle2">Redelegate</q-item-section>
              </q-item>
              <q-item class="menu-item" active-class="active" clickable>
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
import { defineComponent, computed, PropType } from 'vue';
import { Validator } from 'src/models';
import { LooseDictionary } from 'quasar';
import { useRouter } from 'vue-router';
import { useStore } from 'src/store';
import { bigFigureOrPercent } from 'src/common/numbers';

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

    const delegations = computed(() => store.state.data.delegations);
    const rewards = computed(() => store.state.data.rewards);
    const pagination = {
      sortBy: 'votingPower',
      descending: true,
      rowsPerPage: 0
    };

    const columns = [
      {
        name: 'id',
        label: '',
        align: 'center',
        field: 'id'
      },
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
        label: 'Staked',
        align: 'center',
        field: 'staked',
      },
      {
        name: 'rewards',
        label: 'Rewards',
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
        name: 'available',
        label: 'Available',
        align: 'center',
        field: 'available',
      },
      {
        name: 'unstaked',
        label: 'Unstaked',
        align: 'center',
        field: 'unstaked',
      },
      {
        name: 'time',
        label: 'Time',
        align: 'center',
        field: 'time',
      },
      {
        name: 'actions',
        align: 'center'
      },
    ];

    const visibleColumns = computed<string[]>(() => {
      if (props.unstaking) {
        return ['id', 'name', 'unstaked', 'time', 'actions'];
      }

      if (props.staking) {
        return ['id', 'name', 'status', 'staked', 'rewards', 'votingPower', 'actions'];
      }

      return ['id', 'name', 'status', 'rewards', 'votingPower', 'actions'];
    });

    const rowClick = async (row: LooseDictionary) => {
      try {
        const validator = row as Validator;
        await router.push(`/validators/${validator.id}`);
      } catch (error) {
        console.error(error);
      }
    };

    const getDelegation = ({ operatorAddress }: Validator) => {
      return delegations.value.find(({ validator }) => validator.operatorAddress === operatorAddress);
    }

    const getRewards = ({ operatorAddress }: Validator) => {
      return rewards.value.find(({ validator }) => validator.operatorAddress === operatorAddress);
    }

    return {
      pagination,
      columns,
      visibleColumns,
      rowClick,
      getDelegation,
      getRewards,
      bigFigureOrPercent
    }
  }
});
</script>

<style lang="scss" scoped>
.validators-table {
  background: transparent;

  &::v-deep(.q-table) {
    border-spacing: 0 6px;
  }
}

.validators-table-head-col {
  padding-top: 21px;
  padding-bottom: 21px;
  border: none;
}

.validators-table-row {
  background: none;

  & .q-td {
    background: $transparent-gray;
    backdrop-filter: blur(60px);
    border-bottom: none;
    height: 60px;

    &:first-child {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }

    &:last-child {
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }
  }
}

.status {
  padding-left: 12px;
  padding-right: 12px;
  min-height: 22px;
}

.validator-name {
  margin-left: 17px;
  margin-right: 12px;
}
</style>
