<template>
  <q-table
    :rows="rows"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
    row-key="hash"
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
          :class="{
            [col.name]: true,
          }"
        >
          {{ $t(col.label) }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr class="transactions-table-row cursor-pointer" @click="txClick(props.row)" :props="props">
        <q-td key="hash" class="text-subtitle2 text-white" :props="props">
          <p class="hash-name q-my-none text-subtitle2 text-uppercase">
            {{ shortHashTx(props.row.hash) }}
          </p>
        </q-td>
        <q-td key="status" class="text-subtitle2 text-white" :props="props">
          <q-spinner
            color="primary"
            size="20px"
            v-if="props.row.status === 'PENDING'"
          />
          <q-icon name="svguse:icons.svg#error-outlined|0 0 70 70" size="20px" color="negative" v-else-if="props.row.status === 'FAILED'" />
          <q-icon name="svguse:icons.svg#check|0 0 70 70" size="20px" color="positive" v-else />
        </q-td>
        <q-td key="time" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.time ? `${fromNow(props.row.time)} ${!compareNow(props.row.time) ? 'ago' : 'left'}` : 'N/A' }}
          </p>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { Transaction } from 'src/models';
import { fromNow, compareNow } from 'src/common/date';
import { shortHashTx, formatAddress } from 'src/common/address';

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
    ]);

    const txClick = (row: Transaction) => {
      window.open(`${process.env.VUE_APP_ETHERSCAN}tx/${row.hash}`)
    }

    return {
      pagination,
      columns,
      fromNow,
      compareNow,
      shortHashTx,
      formatAddress,
      txClick
    };
  }
});
</script>

<style lang="scss" scoped>
.transactions-table {
  background: transparent;

  &::v-deep(.q-table) {
    border-spacing: 0 6px;

    & tr {
      height: unset;
    }
  }
}

.transactions-table-head-col {
  padding-top: 0;
  padding-bottom: 8px;
  border: none;
  width: auto;

  &.status {
    width: 10%;
  }

  &.time {
    width: 20%;
  }
}

.transactions-table-row {
  background: none;
  backdrop-filter: blur(60px);

  & .q-td {
    background: $transparent-gray2;
    border-bottom: none;
    width: auto;
    height: 60px;

    &:first-child {
      padding-left: 24px;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
    }

    &:last-child {
      padding-right: 24px;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
    }

    &.actions {
      width: 10%;
    }

    &.available {
      width: 20%;
    }
  }
}

.hash-name {
  margin-left: 24px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box !important;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;

  & span {
    margin-left: 24px;
  }
}

.receive-btn {
  margin-left: 24px;
}

.action-btn.disabled {
  opacity: 0.3 !important;
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
