<script setup lang="ts">
import { formatAmount, formatQuantity } from '@/utils/index';

defineProps<{
  asset: {
    name: string;
    holdings: number;
    avgBuyPrice: number | null;
    invested: number;
  };
}>();
</script>

<template>
  <tbody>
    <tr>
      <td>{{ asset.name }}</td>
      <td>{{ formatQuantity(asset.holdings) }} {{ asset.name }}</td>
      <td>{{ formatAmount(asset.avgBuyPrice) }}</td>
      <td>{{ formatAmount(asset.invested) }}</td>
    </tr>
  </tbody>
</template>
<style scoped lang="css">
td {
  border: 1px var(--color-border-grey) solid;
  padding: 0.5rem;
  text-align: right;
}
</style>
