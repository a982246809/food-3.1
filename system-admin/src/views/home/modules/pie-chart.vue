<script setup lang="ts">
import { watch } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useEcharts } from '@/hooks/common/echarts';
import { fetchTopDishes } from '@/service/api';

defineOptions({
  name: 'PieChart'
});

const appStore = useAppStore();

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    bottom: '1%',
    left: 'center',
    itemStyle: {
      borderWidth: 0
    }
  },
  series: [
    {
      color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca', '#ff9f7f', '#fb7293', '#e7bcf3', '#8378ea', '#96bfff'],
      name: '热门菜品',
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12'
        }
      },
      labelLine: {
        show: false
      },
      data: [] as { name: string; value: number }[]
    }
  ]
}));

async function loadRealData() {
  const { data } = await fetchTopDishes();
  if (data && data.length > 0) {
    updateOptions(opts => {
      opts.series[0].data = data.map(item => ({
        name: item.name,
        value: item.count
      }));
      return opts;
    });
  } else {
    // 假数据兜底
    updateOptions(opts => {
      opts.series[0].data = [
        { name: '暂无数据', value: 1 }
      ];
      return opts;
    });
  }
}

function updateLocale() {
  updateOptions((opts, factory) => {
    const originOpts = factory();

    opts.series[0].name = originOpts.series[0].name;
    // 动态数据不再固定重新赋值

    return opts;
  });
}

async function init() {
  loadRealData();
}

watch(
  () => appStore.locale,
  () => {
    updateLocale();
  }
);

// init
init();
</script>

<template>
  <NCard :bordered="false" class="card-wrapper">
    <div ref="domRef" class="h-360px overflow-hidden"></div>
  </NCard>
</template>

<style scoped></style>
