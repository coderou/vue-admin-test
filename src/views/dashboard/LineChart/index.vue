<template>
  <div class="line-chart" ref="line"></div>
</template>

<script>
import * as echarts from 'echarts';
import 'echarts/theme/vintage';
// import wonderland from "./wonderland";

export default {
  name: 'LineChart',
  // data() {
  //   return {
  //     chartData: {
  //       actually: [],
  //       expected: [],
  //     },
  //   };
  // },
  methods: {
    // 专门返回options的函数
    getOption(actually, expected) {
      return {
        color: ['#80FFA5', '#00DDFF'],
        // title: {
        //   text: "渐变堆叠面积图",
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: ['预期', '实际'],
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          },
        ],
        yAxis: [
          {
            name: '交易金额(万元)',
            // 显示坐标轴线
            axisLine: {
              show: true,
            },
          },
        ],
        series: [
          {
            name: '预期',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(128, 255, 165)',
                },
                {
                  offset: 1,
                  color: 'rgba(1, 191, 236)',
                },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: actually,
          },
          {
            name: '实际',
            type: 'line',
            stack: '总量',
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(0, 221, 255)',
                },
                {
                  offset: 1,
                  color: 'rgba(77, 119, 255)',
                },
              ]),
            },
            emphasis: {
              focus: 'series',
            },
            data: expected,
          },
        ],
      };
      /* tip:主题不生效是因为直接写的options覆盖了主题色等,如果将上面返回的对象替换为下面的,将会出现绿色 */
      // return {
      //   title: {
      //     text: "ECharts 入门示例",
      //   },
      //   tooltip: {},
      //   legend: {
      //     data: ["销量"],
      //   },
      //   xAxis: {
      //     data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      //   },
      //   yAxis: {},
      //   series: [
      //     {
      //       name: "销量",
      //       type: "bar",
      //       data: [5, 20, 36, 10, 10, 20],
      //     },
      //   ],
      // };
    },
  },
  mounted() {
    // 模拟数据请求
    setTimeout(() => {
      // 模拟请求数据
      const chartData = {
        actually: [140, 232, 101, 264, 90, 340, 250],
        expected: [120, 282, 111, 234, 220, 340, 310],
      };
      // 注册主题(tip:如果需要使用主题,需要引入对应的主题配置json)
      // echarts.registerTheme("wonderland", wonderland.theme);

      // 创建echarts实例(使用主题版)
      // const echart = echarts.init(this.$refs.line, "wonderland");
      // 创建echarts实例(不使用主题)
      const echart = echarts.init(this.$refs.line);
      // 生成option
      const option = this.getOption(chartData.actually, chartData.expected);
      // 生成图表
      echart.setOption(option);
    }, 1000);
  },
};
</script>

<style lang="sass" scoped>
.line-chart
  width: 100%
  height: 400px
</style>
