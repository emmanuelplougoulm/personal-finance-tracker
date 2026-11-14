<script setup lang="ts">
import { computed } from 'vue';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { calculateInvested, formatAmount, type TransactionRecord } from '@/utils/index';

const store = usePortfolioStore();

const invested = computed(() => {
  const assets = (store.activePortfolio?.assets ?? []) as TransactionRecord[][];
  return assets.reduce((sum, transactions) => sum + calculateInvested(transactions), 0);
});
</script>

<template>
  <div class="chartbox-wrapper">
    <div class="name">{{ store.activePortfolio.portfolioName }}</div>
    <div class="total">{{ formatAmount(invested) }}</div>
    <div>Invested</div>
  </div>
</template>

<style scoped>
.chartbox-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  max-width: 800px;
  padding: 20px;
  border: 1px var(--color-border-grey) solid;
  border-radius: 4px;
}
.chartbox-wrapper .name {
  font-weight: 800;
}
.chartbox-wrapper .total {
  font-weight: 400;
  font-size: 32px;
}
</style>
