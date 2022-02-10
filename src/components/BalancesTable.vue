<template>
  <q-table
    :rows="rows"
    :columns="columns"
    :visible-columns="visibleColumns"
    :loading="loading"
    :pagination="pagination"
    :hide-header="hideHeader"
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
      <h5 class="text-half-transparent-white text-weight-medium">{{ $t('errors.emptyBalances') }}</h5>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props" class="balances-table-head-row">
        <q-th
          v-for="col in columns"
          :key="col.name"
          :props="props"
          class="text-body4 text-uppercase text-half-transparent-white text-weight-medium balances-table-head-col"
          :class="{
            [col.name]: true,
          }"
        >
          {{ $t(col.label ?? '') }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr class="balances-table-row cursor-pointer" :props="props">
        <q-td key="name" class="text-subtitle2 text-white name" :props="props">
          <div class="row no-wrap items-center">
            <q-avatar class="token" size="24px" :color="props.row.image ? 'transparent' : 'primary'">
              <img :src="props.row.image" v-if="props.row.image">
              <p class="text-subtitle2 text-uppercase q-my-none" v-else-if="props.row.symbol">
                {{ props.row.symbol[0] }}
              </p>
              <p class="text-subtitle2 text-uppercase q-my-none" v-else>
                {{ props.row.denom[0] }}
              </p>
            </q-avatar>
            <p class="balance-name q-my-none text-subtitle2 text-capitalize">
              {{ props.row.name }}
              <span class="text-half-transparent-white text-uppercase">{{ ibc && props.row.symbol ? props.row.symbol.toLowerCase() : props.row.denom.toLowerCase() }}</span>
            </p>
          </div>
        </q-td>
        <q-td key="available" class="text-subtitle2 text-white available" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.available }}
          </p>
        </q-td>
        <q-td key="actions" class="actions" :props="props">
          <q-btn class="action-btn" flat unelevated padding="4px" @click.stop="openSendDialog(props.row)" :disable="!session || (session && session.sessionType !== 'keplr')">
            <q-icon class="rotate-270" name="svguse:icons.svg#arrow-right|0 0 14 14" size="14px" color="primary" />
          </q-btn>

          <q-btn class="action-btn receive-btn" flat unelevated padding="4px" @click.stop="openReceiveDialog" :disable="!session || (session && session.sessionType !== 'keplr') || ibc">
            <q-icon class="rotate-90" name="svguse:icons.svg#arrow-right|0 0 14 14" size="14px" color="primary" />
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
import QrCodeDialog from './QrCodeDialog.vue';

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
    ibc: {
      type: Boolean,
      default: false,
    },
    hideHeader: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore();
    const quasar = useQuasar();

    const network = computed(() => store.state.authentication.network);
    const session = computed(() => store.state.authentication.session);

    const pagination = {
      descending: true,
      rowsPerPage: 0
    };

    const columns = computed(() => [
      {
        name: 'name',
        label: '',
        align: 'left',
        field: 'name',
      },
      {
        name: 'available',
        label: 'general.availableTable',
        align: 'center',
        field: 'available',
      },
      {
        name: 'actions',
        align: 'center'
      },
    ]);

    const visibleColumns = computed<string[]>(() => ['name', 'available', 'actions']);

    const openSendDialog = (balance: Balance) => {
      quasar.dialog({
        component: SendDialog,
        componentProps: {
          denom: balance.denom === network.value.stakingDenom ? undefined : balance.denom,
          symbol: balance.symbol
        },
        fullWidth: true,
        maximized: true
      });
    }

    const openReceiveDialog = () => {
      quasar.dialog({
        component: QrCodeDialog,
        componentProps: {
          address: session.value?.address
        }
      });
    }

    return {
      session,
      pagination,
      columns,
      visibleColumns,
      openSendDialog,
      openReceiveDialog
    }
  }
});
</script>

<style lang="scss" scoped>
.balances-table {
  background: transparent;

  &::v-deep(.q-table) {
    border-spacing: 0 6px;

    & tr {
      height: unset;
    }
  }
}

.balances-table-head-col {
  padding-top: 0;
  padding-bottom: 6px;
  border: none;
  width: auto;

  &.actions {
    width: 10%;
  }

  &.available {
    width: 20%;
  }
}

.balances-table-row {
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

.balance-name {
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
</style>
