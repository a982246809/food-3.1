<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import { fetchDashboardData } from '@/service/api';

defineOptions({
  name: 'CardData'
});

const orderCount = ref(0);
const salesAmount = ref(0);

onMounted(async () => {
  const { data } = await fetchDashboardData();
  if (data) {
    orderCount.value = data.orderCount;
    salesAmount.value = data.salesAmount;
  }
});

interface CardData {
  key: string;
  title: string;
  value: number;
  unit: string;
  color: {
    start: string;
    end: string;
  };
  icon: string;
}

const cardData = computed<CardData[]>(() => [
  {
    key: 'visitCount',
    title: '今日订单数', // $t('page.home.visitCount')
    value: orderCount.value,
    unit: '',
    color: {
      start: '#ec4786',
      end: '#b955a4'
    },
    icon: 'ant-design:shopping-outlined'
  },
  {
    key: 'turnover',
    title: '今日销售额', // $t('page.home.turnover')
    value: salesAmount.value,
    unit: '￥',
    color: {
      start: '#865ec0',
      end: '#5144b4'
    },
    icon: 'ant-design:money-collect-outlined'
  },
]);

interface GradientBgProps {
  gradientColor: string;
}

const [DefineGradientBg, GradientBg] = createReusableTemplate<GradientBgProps>();

const themeStore = useThemeStore();

function getGradientColor(color: CardData['color']) {
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`;
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <!-- define component start: GradientBg -->
    <DefineGradientBg v-slot="{ $slots, gradientColor }">
      <div
        class="px-16px pb-4px pt-8px text-white"
        :style="{ backgroundImage: gradientColor, borderRadius: themeStore.themeRadius + 'px' }"
      >
        <component :is="$slots.default" />
      </div>
    </DefineGradientBg>
    <!-- define component end: GradientBg -->

    <NGrid cols="s:1 m:2 l:4" responsive="screen" :x-gap="16" :y-gap="16">
      <NGi v-for="item in cardData" :key="item.key">
        <GradientBg :gradient-color="getGradientColor(item.color)" class="flex-1">
          <h3 class="text-16px">{{ item.title }}</h3>
          <div class="flex justify-between pt-12px">
            <SvgIcon :icon="item.icon" class="text-32px" />
            <CountTo
              :prefix="item.unit"
              :start-value="1"
              :end-value="item.value"
              class="text-30px text-white dark:text-dark"
            />
          </div>
        </GradientBg>
      </NGi>
    </NGrid>
  </NCard>
</template>

<style scoped></style>
