<template>
  <q-table
    :rows="rows"
    :columns="columns"
    :visible-columns="visibleColumns"
    :loading="loading"
    :pagination="pagination"
    row-key="id"
    class="balances-table"
    flat
    square
    :rows-per-page-options="[0]"
    :bordered="false"
    hide-pagination
    virtual-scroll
  >
    <template v-slot:no-data>
      <h5 class="text-half-transparent-white text-weight-medium">No assets available</h5>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props" class="balances-table-head-row">
        <q-th
          v-for="col in columns"
          :key="col.name"
          :props="props"
          class="text-body4 text-uppercase text-half-transparent-white text-weight-medium balances-table-head-col"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr class="balances-table-row cursor-pointer" :props="props">
        <q-td key="name" class="text-subtitle2 text-white" :props="props">
          <div class="row no-wrap items-center">
            <p class="balance-name q-my-none text-subtitle2">
              {{ props.row.denom }}
            </p>
          </div>
        </q-td>
        <q-td key="total" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.total }}
          </p>
        </q-td>
        <q-td key="available" class="text-subtitle2 text-white" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.available }}
          </p>
        </q-td>
        <q-td key="actions" :props="props">
          <q-btn flat unelevated padding="2px" @click.stop="">
            <q-icon name="svguse:icons.svg#vertical-dots|0 0 4 16" size="16px" color="primary" />

            <q-menu class="menu-list" anchor="center left" self="center middle" :offset="[90, 0]">
              <q-item class="menu-item" active-class="active" disable v-close-popup>
                <q-item-section class="text-center text-subtitle2">Send</q-item-section>
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
import { Balance } from 'src/models';
import { useQuasar } from 'quasar';
import SendDialog from './SendDialog.vue';
import { useStore } from 'src/store';

export default defineComponent({
  name: 'BalancesTable',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Array as PropType<Balance[]>,
      default: () => [],
    },
  },
  setup() {
    const store = useStore();
    const quasar = useQuasar();

    const network = computed(() => store.state.authentication.network);

    const pagination = {
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
        name: 'total',
        label: 'Total',
        align: 'center',
        field: 'total',
      },
      {
        name: 'available',
        label: 'Available',
        align: 'center',
        field: 'available',
      },
      {
        name: 'actions',
        align: 'center'
      },
    ]);

    const visibleColumns = computed<string[]>(() => ['name', 'total', 'available', 'actions']);

    const openSendDialog = (balance: Balance) => {
      quasar.dialog({
        component: SendDialog,
        componentProps: {
          denom: balance.denom === network.value.stakingDenom ? undefined : balance.denom,
        },
        fullWidth: true,
        maximized: true
      });
    }

    return {
      pagination,
      columns,
      visibleColumns,
      openSendDialog
    }
  }
});
</script>

<style lang="scss" scoped>
.balances-table {
  background: transparent;

  &::v-deep(.q-table) {
    border-spacing: 0 6px;
    padding-bottom: 20px;
  }
}

.balances-table-head-col {
  padding-top: 21px;
  padding-bottom: 21px;
  border: none;

  &:first-of-type {
    width: 60px;
  }
}

.id-cell {
  width: 60px;
}

.balances-table-row {
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

.balance-name {
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
</style>
