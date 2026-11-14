<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { createTransaction } from '@/services/transactions/transactions.service';
import { getPortfolioById } from '@/services/portfolios/portfolios.service';

import TabGroup from '@/components/commons/tab-group/tab-group.vue';
import BaseInput from '@/components/commons/base-input/base-input.vue';
import SearchableDropdown from '@/components/commons/searchable-dropdown/searchable-dropdown.vue';
import Button from '@/components/commons/button/button.vue';

import allCoins from '@/constants/allCoins.json';
import { CONSTANTS } from '@/constants';

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const { FIAT_TYPES, TRANSACTION_TYPES } = CONSTANTS;

const emit = defineEmits(['collapse']);
const portfolioStore = usePortfolioStore();
const activePortfolioId = computed(() => portfolioStore.getActivePortfolioId);

function getInitialState() {
  return {
    type: '',
    date: '',
    currency: '',
    asset: {} as { [key: string]: unknown },
    quantity: '',
    price: '',
    fees: ''
  };
}

const state = reactive(getInitialState());
const errorMessage = ref('');

const handleNewTransaction = async () => {
  const { quantity, price, fees, ...rest } = state;
  const newTransaction = {
    ...rest,
    amount: Number(quantity),
    price: Number(price),
    fees: Number(fees || 0),
    portfolioId: activePortfolioId.value,
    asset: state.asset.value
  };
  errorMessage.value = '';

  try {
    await createTransaction(newTransaction);
    portfolioStore.setActivePortfolio(await getPortfolioById(activePortfolioId.value));

    Object.assign(state, getInitialState());
    emit('collapse');
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Could not save the transaction';
  }
};

let optionsCoins = computed(() => {
  return allCoins.map((coin) => {
    return { value: coin.symbol, name: coin.name };
  });
});
</script>

<template>
  <div
    v-if="optionsCoins.length > 0"
    class="wrapper-card-transaction"
    :class="{ collapsed: !isOpen }"
  >
    <Button :text="'< Collapse'" @click="emit('collapse')" />
    <div class="grid-container">
      <TabGroup class="grid-item" v-model="state.currency" :options="FIAT_TYPES" />
      <TabGroup class="grid-item" v-model="state.type" :options="TRANSACTION_TYPES" />
      <SearchableDropdown v-model="state.asset" :options="optionsCoins" />
      <BaseInput v-model="state.quantity" class="input-item" :label="'Quantity'" />
      <BaseInput v-model="state.price" class="input-item" :label="'Price'" />
      <BaseInput v-model="state.date" :label="'Date'" />
      <BaseInput v-model="state.fees" :label="'Fees'" />
      <button @click="handleNewTransaction">Validate</button>
    </div>
    <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.wrapper-card-transaction {
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 100%;
  border: 1px var(--color-border-grey) solid;
  padding: 2.5rem 0.8rem 0.8rem 0.8rem;
  transform: translateX(0);
  transition: transform 0.45s cubic-bezier(0.82, 0.085, 0.395, 0.895),
    width 0.75s cubic-bezier(0.82, 0.085, 0.395, 0.895);
}

.wrapper-card-transaction.collapsed {
  transform: translateX(100%);
  width: 0;
}

.grid-container {
  display: grid;
  grid-template-rows: 30px 30px 40px repeat(4, 70px);
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  margin-top: 1rem;
}
.error-message {
  color: #8b0000;
  font-weight: 600;
  margin-top: 0.5rem;
}
</style>
