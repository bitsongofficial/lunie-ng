<template>
  <q-page class="validators">
    <div class="section-header row items-center no-wrap">
      <h2 class="section-title text-body-large text-white">
        Validators
      </h2>

      <toggle-btn v-model="type" :options="validatorTypeOptions" />

      <q-input
        color="transparent-gray"
        label-color="accent-5"
        bg-color="transparent-gray"
        round
        standout
        v-model="search"
        placeholder="Search validator"
        no-error-icon
        hide-bottom-space
        class="search-box medium text-h6 q-ml-auto"
      >
        <template v-slot:append>
          <q-icon name="svguse:icons.svg#search|0 0 13 13" size="12px" color="accent-5" />
        </template>
      </q-input>
    </div>

    <validators-table :rows="rows" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { validatorTypeOptions } from 'src/constants';
import ToggleBtn from 'src/components/ToggleBtn.vue';
import ValidatorsTable from 'src/components/ValidatorsTable.vue';
import { Validator } from 'src/models';

export default defineComponent({
  name: 'Validators',
  components: {
    ToggleBtn,
    ValidatorsTable
},
  setup() {
    const type = ref<string>('active');
    const search = ref<string>('');

    const rows: Validator[] = [
      {
        id: 1,
        name: 'BasBlock',
        picture: '',
        status: 'ACTIVE',
        rewards: 30,
        available: 12.9
      },
      {
        id: 2,
        name: 'BasBlock2',
        picture: '',
        status: 'ACTIVE',
        rewards: 30,
        available: 12.9
      },
      {
        id: 3,
        name: 'BasBlock3',
        picture: '',
        status: 'ACTIVE',
        rewards: 30,
        available: 12.9
      }
    ];

    return {
      rows,
      search,
      type,
      validatorTypeOptions,
    }
  }
});
</script>

<style lang="scss" scoped>
.validators {
  padding-top: 40px;
  padding-bottom: 100px;
}

.section-header {
  margin-bottom: 36px;
}

.section-title {
  margin: 0 48px 0 0;
  padding-left: 32px;
}

.search-box {
  width: 100%;
  max-width: 344px;
}
</style>
