<template>
  <q-page class="validator">
    <div class="section-header row items-center no-wrap">
      <h2 class="section-title text-body-large text-white">
        Validator
      </h2>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Validator',
});
</script>

<style lang="scss" scoped>
.validator {
  padding-top: 60px;
  padding-bottom: 100px;
}

.section-header {
  margin-bottom: 36px;
}

.section-title {
  margin: 0 48px 0 0;
  padding-left: 32px;
}
</style>
