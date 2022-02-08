<template>
  <q-table
    :rows="rows"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    row-key="id"
    class="transactions-table"
    flat
    square
    :rows-per-page-options="[0]"
    :bordered="false"
    hide-pagination
  >
    <template v-slot:header="props">
      <q-tr :props="props" class="transactions-table-head-row">
        <q-th
          v-for="col in columns"
          :key="col.name"
          :props="props"
          class="text-body4 text-uppercase text-half-transparent-white text-weight-medium transactions-table-head-col"
        >
          {{ $t(col.label) }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr class="transactions-table-row cursor-pointer" :props="props">
        <q-td key="hash" class="text-subtitle2 text-white" :props="props">
          <p class="validator-name q-my-none text-subtitle2">
            {{ props.row.hash }}
          </p>
        </q-td>
        <q-td key="status" class="text-subtitle2 text-white" :props="props">
          <div class="transaction-status bg-secondary">
            <div class="transaction-status-dot" :class="props.row.status === 'ACTIVE' ? 'bg-info' : 'bg-accent-6'"></div>
          </div>
        </q-td>
        <q-td key="time" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.undelegation ? fromNow(props.row.time) : 'N/A' }}
          </p>
        </q-td>
        <q-td key="hash" class="text-subtitle2 text-white" :props="props">
          <p class="validator-name q-my-none text-subtitle2">
            {{ props.row.to }}
          </p>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { Transaction } from 'src/models';
import { fromNow } from 'src/common/date';

export default defineComponent({
  name: 'TransactionsTable',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Array as PropType<Transaction[]>,
      default: () => [],
    },
  },
  setup() {
    const pagination = {
      sortBy: 'time',
      descending: true,
      rowsPerPage: 0
    };

    const columns = computed(() => [
      {
        name: 'hash',
        label: 'general.txhash',
        align: 'left',
        field: 'hash',
      },
      {
        name: 'status',
        label: 'general.status',
        align: 'center',
        field: 'status',
      },
      {
        name: 'time',
        label: 'general.time',
        align: 'center',
        field: 'time',
      },
      {
        name: 'to',
        label: 'general.receiverAddress',
        align: 'center',
        field: 'to',
      },
    ]);

    return {
      pagination,
      columns,
      fromNow
    };
  }
});
</script>

<style lang="scss" scoped>
.transactions-table {
  background: transparent;

  &::v-deep(.q-table) {
    border-spacing: 0 6px;
    padding-bottom: 20px;
  }
}

.transactions-table-head-col {
  padding-top: 21px;
  padding-bottom: 21px;
  border: none;

  &:first-of-type {
    width: 60px;
  }
}

.transactions-table-row {
  background: none;
  backdrop-filter: blur(60px);

  & .q-td {
    background: $transparent-gray2;
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

.transaction-status {
  margin: 0 auto;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.transaction-status-dot {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  border-radius: 50%;
}
</style>
