<template>
  <q-table
    :rows="rows"
    :columns="columns"
    :visible-columns="visibleColumns"
    :loading="loading"
    row-key="id"
    class="validators-table"
    flat
    square
    :bordered="false"
    hide-pagination
  >
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
      <q-tr class="validators-table-row" :props="props">
        <q-td key="id" class="text-body2 text-white" :props="props">
          {{ props.row.id }}
        </q-td>
        <q-td key="name" class="text-body2 text-white" :props="props">
          {{ props.row.name }}
        </q-td>
        <q-td key="status" class="text-body2 text-white" :props="props">
          <q-chip class="status q-mx-none q-my-none text-body3" text-color="white" color="info">
            {{ props.row.status }}
          </q-chip>
        </q-td>
        <q-td key="rewards" class="text-body2 text-white" :props="props">
          {{ props.row.rewards }} %
        </q-td>
        <q-td key="available" class="text-body2 text-white" :props="props">
          {{ props.row.available }} %
        </q-td>
        <q-td key="actions" :props="props">
          <q-btn flat unelevated padding="2px">
            <q-icon name="svguse:icons.svg#vertical-dots|0 0 4 16" size="16px" color="primary" />

            <q-menu class="menu-list" anchor="bottom middle" self="top middle" :offset="[0, 16]">
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
import { defineComponent, ref, PropType } from 'vue';
import { Validator } from 'src/models';

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
  },
  setup() {
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
        name: 'rewards',
        label: 'Rewards',
        align: 'center',
        field: 'rewards',
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
    ];

    const visibleColumns = ref<string[]>(['id', 'name', 'status', 'rewards', 'available', 'actions']);

    return {
      columns,
      visibleColumns,
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
</style>
