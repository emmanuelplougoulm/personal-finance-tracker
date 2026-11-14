<script setup lang="ts">
import { computed } from 'vue';
import AssetBody from '@/components/ui/assets-table/asset-body.vue';
import {
  calculateTokenHoldings,
  calculateAvgBuyPrice,
  calculateInvested,
  type TransactionRecord
} from '@/utils/index';

const props = defineProps<{
  assets: TransactionRecord[][];
}>();

const displayReadyAssets = computed(() =>
  props.assets.map((transactions) => ({
    name: transactions[0].asset,
    holdings: calculateTokenHoldings(transactions),
    avgBuyPrice: calculateAvgBuyPrice(transactions),
    invested: calculateInvested(transactions)
  }))
);
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Holdings</th>
          <th>Avg Buy Price</th>
          <th>Invested</th>
        </tr>
      </thead>
      <AssetBody
        v-for="displayReadyAsset in displayReadyAssets"
        :key="displayReadyAsset.name"
        :asset="displayReadyAsset"
      />
    </table>
  </div>
</template>

<style lang="css">
table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: right;
  font-size: 14px;
  font-weight: 400;
}
</style>
