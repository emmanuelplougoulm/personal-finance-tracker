<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import dayjs from 'dayjs';
import BaseModal from '@/components/commons/base-modal/base-modal.vue';
import BaseInput from '@/components/commons/base-input/base-input.vue';
import {
  createPortfolio,
  getPortfolios,
  getPortfolioById
} from '@/services/portfolios/portfolios.service';
import { usePortfolioStore } from '@/stores/portfolioStore';

const portfolioStore = usePortfolioStore();

defineProps({
  title: { type: String, default: '' }
});

const emit = defineEmits(['modal-close']);

const portfolioState = reactive({
  portfolioName: '',
  timeCreated: dayjs(),
  timeUpdated: '',
  assets: []
});

const errorMessage = ref('');
const isSubmitting = ref(false);
const canSubmit = computed(() => portfolioState.portfolioName.trim() !== '' && !isSubmitting.value);

const handleCreatePortfolio = async () => {
  if (!canSubmit.value) return;
  errorMessage.value = '';
  isSubmitting.value = true;

  try {
    const { portfolioId } = await createPortfolio(portfolioState);

    portfolioStore.setPortfolios(await getPortfolios());
    portfolioStore.setActivePortfolio(await getPortfolioById(portfolioId));
    emit('modal-close');
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Could not create the portfolio';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <BaseModal @modal-close="emit('modal-close')">
    <template #header>{{ title }}</template>
    <template #content>
      <BaseInput v-model="portfolioState.portfolioName" @keyup.enter="handleCreatePortfolio" />
      <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
    </template>
    <template #footer>
      <button :disabled="!canSubmit" @click="handleCreatePortfolio">Validate</button>
    </template>
  </BaseModal>
</template>

<style scoped>
.error-message {
  color: #8b0000;
  font-weight: 600;
  margin-top: 0.5rem;
}
</style>
