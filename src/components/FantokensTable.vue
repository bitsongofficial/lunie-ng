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
          :class="{
            [col.name]: true,
          }"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr class="balances-table-row cursor-pointer" :props="props">
        <q-td key="name" class="text-subtitle2 text-white name" :props="props">
          <div class="row no-wrap items-center">
            <p class="balance-name q-my-none text-subtitle2" v-if="!props.row.name">
              {{ props.row.denom }}
            </p>
            <p class="balance-name q-my-none text-subtitle2" v-else>
              {{ props.row.name }} <span class="text-half-transparent-white q-ml-lg text-uppercase">{{ props.row.metaData.display }}</span>
            </p>
          </div>
        </q-td>
        <q-td key="minted" class="text-subtitle2 text-white total" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.minted }}
          </p>
        </q-td>
        <q-td key="burned" class="text-subtitle2 text-white total" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.burned }}
          </p>
        </q-td>
        <q-td key="supply" class="text-subtitle2 text-white total" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.supply }}
          </p>
        </q-td>
        <q-td key="max-supply" class="text-subtitle2 text-white total" :props="props">
          <p class="text-subtitle2 q-my-none">
            {{ props.row.maxSupply }}
          </p>
        </q-td>
        <q-td key="actions" class="actions" :props="props">
          <q-btn flat unelevated padding="2px" @click.stop="">
            <q-icon name="svguse:icons.svg#vertical-dots|0 0 4 16" size="16px" color="primary" />

            <q-menu class="menu-list" anchor="center left" self="center middle" :offset="[90, 0]">
              <q-item class="menu-item" active-class="active" @click="openMintDialog(props.row)" :clickable="props.row.mintable" :disable="!props.row.mintable" v-close-popup>
                <q-item-section class="text-center text-subtitle2">Mint</q-item-section>
              </q-item>
              <q-item class="menu-item" active-class="active" @click="openBurnDialog(props.row)" clickable v-close-popup>
                <q-item-section class="text-center text-subtitle2">Burn</q-item-section>
              </q-item>
              <!-- <q-item class="menu-item" active-class="active" @click="openChangeOwnerDialog(props.row)" clickable v-close-popup>
                <q-item-section class="text-center text-subtitle2">Change Owner</q-item-section>
              </q-item> -->
              <q-item class="menu-item" active-class="active" @click="openDisableMintDialog(props.row)" :clickable="props.row.mintable" :disable="!props.row.mintable" v-close-popup>
                <q-item-section class="text-center text-subtitle2">Disable Mint</q-item-section>
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
import { FanTokenMapped } from 'src/models';
import { useQuasar } from 'quasar';
import { useStore } from 'src/store';

import DisableMintDialog from './DisableMintDialog.vue';
import ChangeOwnerDialog from './ChangeOwnerDialog.vue';
import MintDialog from './MintDialog.vue';
import BurnDialog from './BurnDialog.vue';

export default defineComponent({
  name: 'FantokensTable',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: Array as PropType<FanTokenMapped[]>,
      default: () => [],
    },
  },
  setup() {
    const store = useStore();
    const quasar = useQuasar();

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
        name: 'minted',
        label: 'Minted',
        align: 'center',
        field: 'minted',
      },
      {
        name: 'burned',
        label: 'Burned',
        align: 'center',
        field: 'burned',
      },
      {
        name: 'supply',
        label: 'Supply',
        align: 'center',
        field: 'supply',
      },
      {
        name: 'max-supply',
        label: 'Max Supply',
        align: 'center',
        field: 'max-supply',
      },
      {
        name: 'actions',
        align: 'right'
      },
    ]);

    const visibleColumns = computed<string[]>(() => {
      return ['name', 'minted', 'burned', 'supply', 'max-supply', 'actions'];
    });

    const openMintDialog = (fantokenMapped: FanTokenMapped) => {
      const fantoken = store.state.fantoken.fantokens.find(el => el.metaData?.base === fantokenMapped.metaData?.base);

      quasar.dialog({
        component: MintDialog,
        componentProps: {
          fantoken,
        },
        fullWidth: true,
        maximized: true
      });
    }

    const openBurnDialog = (fantokenMapped: FanTokenMapped) => {
      const fantoken = store.state.fantoken.fantokens.find(el => el.metaData?.base === fantokenMapped.metaData?.base);

      quasar.dialog({
        component: BurnDialog,
        componentProps: {
          fantoken,
        },
        fullWidth: true,
        maximized: true
      });
    }

    const openChangeOwnerDialog = (fantokenMapped: FanTokenMapped) => {
      const fantoken = store.state.fantoken.fantokens.find(el => el.metaData?.base === fantokenMapped.metaData?.base);

      quasar.dialog({
        component: ChangeOwnerDialog,
        componentProps: {
          fantoken,
        },
        fullWidth: true,
        maximized: true
      });
    }

    const openDisableMintDialog = (fantokenMapped: FanTokenMapped) => {
      const fantoken = store.state.fantoken.fantokens.find(el => el.metaData?.base === fantokenMapped.metaData?.base);

      quasar.dialog({
        component: DisableMintDialog,
        componentProps: {
          fantoken,
        },
        fullWidth: true,
        maximized: true
      });
    }

    return {
      pagination,
      columns,
      visibleColumns,
      openMintDialog,
      openBurnDialog,
      openChangeOwnerDialog,
      openDisableMintDialog
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
  padding-top: 0;
  padding-bottom: 21px;
  border: none;

  &:first-child {
    padding-left: 40px;
  }

  &:last-child {
    padding-right: 40px;
  }

  &.name {
    width: auto;
  }

  &.minted {
    width: 10%;
  }

  &.burned {
    width: 10%;
  }

  &.max-supply {
    width: 10%;
  }

  &.fee {
    width: 10%;
  }

  &.actions {
    width: 10%;
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

.balance-name {
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
