<template>
    <div class="package-options-container">
      <div class="options-layout">
        <!-- Create/Edit Package Option Container -->
        <div class="option-container">
          <h2>{{ isEditing ? 'Edit Package Option' : 'Create Package Option' }}</h2>
          <div class="scrollable-content">
            <div class="form-content">
              <div class="input-group">
                <label for="package-option-name">Package Option Name</label>
                <input 
                  id="package-option-name"
                  type="text" 
                  v-model="newOption.name"
                  placeholder="Package Option Name"
                />
              </div>
  
              <div class="pricing-section">
                <label>Pricing Per Pax</label>
                <div class="pricing-rows">
                  <div v-for="(pricing, index) in newOption.pricing" :key="index" class="pricing-row">
                    <input 
                      type="text" 
                      v-model="pricing.paxRange"
                      :placeholder="index === 0 ? 'Pax Range (e.g. 1-2)' : 'Pax Range (e.g. 3-4)'"
                    />
                    <input 
                      type="number" 
                      v-model="pricing.pricePerHead"
                      placeholder="Price Per Head"
                    />
                    <button @click="removePricing(index)" class="remove-btn">
                      <XIcon size="16" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="button-group">
            <button class="cancel-btn" @click="resetForm">Cancel</button>
            <button class="add-pricing-btn" @click="addPricingOption">
              <PlusIcon size="16" class="icon" />
              Add Pricing Option
            </button>
            <button class="save-btn" @click="saveOption" :disabled="loading.saving">
              <span v-if="loading.saving" class="loader small"></span>
              <span v-else>
                {{ isEditing ? 'Update' : 'Save' }}
              </span>
            </button>
          </div>
        </div>
  
        <!-- Package Option List Container -->
        <div class="option-container">
          <h2>Package Options</h2>
          <div class="scrollable-content">
            <div v-if="loading.fetching" class="loading-indicator">
              <div class="loader"></div>
              <span>Loading options...</span>
            </div>
            <div v-else class="options-list">
              <div v-for="option in options" :key="option.id" class="option-item">
                <div class="option-info">
                  <div class="option-name">{{ option.name }}</div>
                  <div class="option-price">Price: ₱{{ getLowestPrice(option) }}</div>
                </div>
                <div class="option-actions">
                  <button class="edit-btn" @click="editOption(option)">
                    <PencilIcon size="16" />
                  </button>
                  <button class="delete-btn" @click="deleteOption(option.id)" :disabled="loading.deleting === option.id">
                    <span v-if="loading.deleting === option.id" class="loader small"></span>
                    <span v-else>
                      <TrashIcon size="16" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="button-group">
            <button class="create-btn" @click="resetForm">
              <PlusIcon size="16" class="icon" />
              Create New Package Option
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { XIcon, PlusIcon, TrashIcon, PencilIcon } from 'lucide-vue-next';
  import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
  import { db } from '../firebaseConfig';
  
  const options = ref([]);
  const newOption = ref({
    id: null,
    name: '',
    pricing: [
      { paxRange: '', pricePerHead: '' }
    ]
  });
  const isEditing = ref(false);
  const loading = ref({
    fetching: false,
    saving: false,
    deleting: null
  });
  
  const optionsCollection = collection(db, 'packageOptions');
  
  onMounted(async () => {
    await fetchOptions();
  });
  
  const fetchOptions = async () => {
    loading.value.fetching = true;
    try {
      const snapshot = await getDocs(optionsCollection);
      options.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching options:", error);
    } finally {
      loading.value.fetching = false;
    }
  };
  
  const addPricingOption = () => {
    newOption.value.pricing.push({ paxRange: '', pricePerHead: '' });
  };
  
  const removePricing = (index) => {
    newOption.value.pricing.splice(index, 1);
  };
  
  const resetForm = () => {
    newOption.value = {
      id: null,
      name: '',
      pricing: [{ paxRange: '', pricePerHead: '' }]
    };
    isEditing.value = false;
  };
  
  const saveOption = async () => {
    if (newOption.value.name && newOption.value.pricing.some(p => p.paxRange && p.pricePerHead)) {
      loading.value.saving = true;
      try {
        if (isEditing.value) {
          const optionRef = doc(db, 'packageOptions', newOption.value.id);
          await updateDoc(optionRef, {
            name: newOption.value.name,
            pricing: newOption.value.pricing
          });
        } else {
          await addDoc(optionsCollection, {
            name: newOption.value.name,
            pricing: newOption.value.pricing
          });
        }
        await fetchOptions();
        resetForm();
      } catch (error) {
        console.error("Error saving option:", error);
      } finally {
        loading.value.saving = false;
      }
    }
  };
  
  const editOption = (option) => {
    newOption.value = { ...option };
    isEditing.value = true;
  };
  
  const deleteOption = async (id) => {
    loading.value.deleting = id;
    try {
      await deleteDoc(doc(db, 'packageOptions', id));
      await fetchOptions();
    } catch (error) {
      console.error("Error deleting option:", error);
    } finally {
      loading.value.deleting = null;
    }
  };
  
  const getLowestPrice = (option) => {
    const prices = option.pricing.map(p => Number(p.pricePerHead)).filter(p => !isNaN(p));
    return prices.length > 0 ? Math.min(...prices).toFixed(2) : '0.00';
  };
  </script>
  
  <style scoped>
  .package-options-container {
    display: flex;
    justify-content: center;
    padding: 20px;
    font-family: 'Poppins', sans-serif;
    background-color: #f0f7f4;
    min-height: 100vh;
  }
  
  .options-layout {
    display: flex;
    gap: 20px;
    width: 100%;
    max-width: 1200px;
  }
  
  .option-container {
    flex: 1;
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: 600px;
  }
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #0a8d88;
  }
  
  .scrollable-content {
    flex-grow: 1;
    overflow-y: auto;
    margin-bottom: 20px;
  }
  
  .form-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  label {
    font-weight: 500;
    font-size: 14px;
    color: #333;
  }
  
  input {
    padding: 10px 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;
  }
  
  input:focus {
    outline: none;
    border-color: #0a8d88;
  }
  
  .pricing-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .pricing-rows {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .pricing-row {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .pricing-row input {
    flex: 1;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    margin-top: auto;
  }
  
  .cancel-btn, .add-pricing-btn, .save-btn, .create-btn {
    padding: 10px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s, opacity 0.3s;
  }
  
  .cancel-btn {
    background: #f0f0f0;
    color: #333;
  }
  
  .add-pricing-btn {
    background: #e6f7ff;
    color: #0a8d88;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    flex: 1;
  }
  
  .save-btn {
    background: #0a8d88;
    color: white;
  }
  
  .remove-btn {
    padding: 6px;
    background: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .options-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .option-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f8f8f8;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .option-item:hover {
    background: #e6f7ff;
  }
  
  .option-info {
    display: flex;
    flex-direction: column;
  }
  
  .option-name {
    font-weight: 500;
    color: #333;
  }
  
  .option-price {
    font-size: 14px;
    color: #0a8d88;
  }
  
  .delete-btn {
    padding: 6px;
    background: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .create-btn {
    width: 100%;
    background: #0a8d88;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  
  button {
    font-size: 14px;
    transition: opacity 0.2s;
  }
  
  button:hover {
    opacity: 0.9;
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .icon {
    display: inline-block;
    vertical-align: middle;
  }
  
  .option-actions {
    display: flex;
    gap: 5px;
  }
  
  .edit-btn {
    padding: 6px;
    background: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
    font-size: 14px;
  }
  
  .loader {
    border: 2px solid #f3f3f3;
    border-top: 2px solid #0a8d88;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
  }
  
  .loader.small {
    width: 16px;
    height: 16px;
    border-width: 1px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    .options-layout {
      flex-direction: column;
    }
  
    .option-container {
      height: auto;
      min-height: 500px;
    }
  }
  </style>