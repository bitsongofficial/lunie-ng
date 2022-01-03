<template>
  <q-page class="validators">
    <div class="section-header row items-center" :class="{
      'q-gutter-y-md': quasar.screen.lt.md,
    }">
      <div class="col-12 col-md-auto" :class="{
        'column': quasar.screen.lt.md,
        'row items-center': !quasar.screen.lt.md,
      }">
        <h2 class="section-title text-body-large text-white col-12 col-md-auto">
          Validators
        </h2>

        <toggle-btn class="col-12 col-md-auto" v-model="type" :options="validatorTypeOptions" />
      </div>

      <div class="col-12 col-md-auto q-ml-auto">
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
          class="search-box large text-h5 q-ml-auto"
        >
          <template v-slot:append>
            <q-icon name="svguse:icons.svg#search|0 0 13 13" size="16px" color="accent-5" />
          </template>
        </q-input>
      </div>
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
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'Validators',
  components: {
    ToggleBtn,
    ValidatorsTable
},
  setup() {
    const quasar = useQuasar();
    const type = ref<string>('active');
    const search = ref<string>('');

    const rows: Validator[] = [];

    return {
      quasar,
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
  margin: 0 auto 16px;

  @media screen and (min-width: $breakpoint-md-min) {
    margin: 0 48px 0 0;
    padding-left: 32px;
  }
}

.search-box {
  width: 100%;

  @media screen and (min-width: $breakpoint-md-min) {
    max-width: 344px;
  }
}
</style>
