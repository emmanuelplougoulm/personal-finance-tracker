<script setup lang="ts">
import BaseModal from '@/components/commons/base-modal/base-modal.vue';
import {
  deletePortfolioById,
  getPortfolios,
  getPortfolioById
} from '@/services/portfolios/portfolios.service';
import { usePortfolioStore } from '@/stores/portfolioStore';

defineProps({
  title: { type: String, default: '' }
});

const emit = defineEmits(['modal-close']);

const portfolioStore = usePortfolioStore();

const handleDeletePortfolio = async () => {
  await deletePortfolioById(portfolioStore.active.portfolioId);

  const remaining = await getPortfolios();
  portfolioStore.setPortfolios(remaining);
  portfolioStore.setActivePortfolio(
    remaining.length ? await getPortfolioById(remaining[0].portfolioId) : {}
  );
  emit('modal-close');
};
</script>

<template>
  <BaseModal @modal-close="emit('modal-close')">
    <template #header>{{ title }}</template>
    <template #content>
      <p>Are you sure you want to delete this portfolio?</p>
    </template>
    <template #footer>
      <button @click="handleDeletePortfolio">Validate</button>
    </template>
  </BaseModal>
</template>
