<template>
  <q-page class="proposal">
    <div class="section-header row items-center no-wrap">
      <h2 class="section-title text-body-large text-white">
        Proposal
      </h2>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Proposal',
});
</script>

<style lang="scss" scoped>
.proposal {
  padding-top: 20px;
  padding-bottom: 100px;
}

.section-header {
  margin-bottom: 46px;
}

.section-title {
  margin: 0 32px 0 0;
  padding-left: 32px;
}
</style>
