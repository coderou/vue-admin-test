<template>
  <div>
    <VeLine :chartData="chartData" />
  </div>
</template>

<script type="text/ecmascript-6">
import VeLine from 'v-charts/lib/line.common';

export default {
  name: 'Vcharts',
  components: { Veline },
  data() {
    return {
      chartData: {},
    };
  },
};
</script>

<style lang='sass' scoped>
</style>
