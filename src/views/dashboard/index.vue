<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <LineCHart />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import LineChart from './LineChart';

export default {
  name: 'Dashboard',
  components: { LineChart },
  computed: {
    ...mapGetters(['name']),
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
