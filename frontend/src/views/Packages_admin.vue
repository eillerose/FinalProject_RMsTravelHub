<template>
  <div class="package-manager">
    <div class="layout-container">
      <!-- Top Row: Package Details and Package Template -->
      <div class="top-row">
        <!-- Package Details -->
        <div class="card package-details">
          <h2>Package Details</h2>
          <div class="scrollable-content">
            <div class="package-grid">
              <!-- Basic Info Card -->
              <div class="detail-card basic-info">
                <h3>Basic Information</h3>
                <div class="form-group">
                  <label for="package-name">Package Name</label>
                  <input 
                    id="package-name"
                    v-model="packageDetails.name"
                    type="text" 
                    placeholder="Enter package name" 
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="package-description">Description</label>
                  <textarea 
                    id="package-description"
                    v-model="packageDetails.description"
                    rows="3"
                    placeholder="Enter package description"
                  ></textarea>
                </div>
              </div>

              <!-- Pricing Card -->
              <div class="detail-card pricing">
                <h3>Pricing</h3>
                <div class="form-group">
                  <label for="pricing-mode">Pricing Mode</label>
                  <select id="pricing-mode" v-model="packageDetails.pricingMode">
                    <option value="fixed">Fixed Price</option>
                    <option value="options">Options-based Pricing</option>
                  </select>
                </div>
                <div v-if="packageDetails.pricingMode === 'fixed'" class="form-group">
                  <label for="fixed-price">Fixed Price (Php)</label>
                  <input 
                    id="fixed-price"
                    v-model.number="packageDetails.fixedPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter fixed price"
                  />
                </div>
                <div v-else>
                  <div class="price-summary">
                    <div class="base-price">
                      Base Price (Sum of Components): Php{{ estimatedBasePrice }}
                    </div>
                    <div v-if="packageDetails.options.length > 0" class="option-info">
                      {{ packageDetails.options.length }} pricing option(s) available
                    </div>
                    <div v-else class="no-options">
                      No pricing options set. Add options to allow guest pricing selection.
                    </div>
                  </div>
                  <button class="package-options-btn" @click="showPackageOptionsModal = true">
                    <SettingsIcon class="icon" />
                    Manage Pricing Options
                  </button>
                </div>
              </div>

              <!-- Image Upload Card -->
              <div class="detail-card image-upload">
                <h3>Package Image</h3>
                <div class="form-group">
                  <label for="package-image">Upload Image</label>
                  <input 
                    id="package-image"
                    type="file" 
                    @change="handleFileUpload" 
                    accept="image/*"
                    ref="fileInput"
                  />
                  <div v-if="uploadProgress > 0 && uploadProgress < 100" class="progress-bar" role="progressbar" :aria-valuenow="uploadProgress" aria-valuemin="0" aria-valuemax="100">
                    <div :style="{ width: `${uploadProgress}%` }" class="progress"></div>
                  </div>
                </div>
                <div class="image-preview">
                  <img v-if="packageDetails.imageUrl" :src="packageDetails.imageUrl" alt="Package Image" class="preview-image" />
                  <div v-else class="no-image">No image uploaded</div>
                </div>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <button class="cancel" @click="cancelPackageChanges">
              <XIcon class="icon" />
              Cancel
            </button>
            <button class="save" @click="savePackageChanges" :disabled="loading.saving">
              <span v-if="loading.saving" class="loader small" aria-hidden="true"></span>
              <span v-else>
                <SaveIcon class="icon" />
                Save Changes
              </span>
            </button>
          </div>
        </div>

        <!-- Package Templates -->
        <div class="card package-templates">
          <h2>Package Templates</h2>
          
          <div class="scrollable-content template-list">
            <div v-if="loading.packages" class="loading-indicator">
              <div class="loader" aria-hidden="true"></div>
              <span class="sr-only">Loading packages...</span>
            </div>
            <div v-else v-for="pkg in packages" :key="pkg.id" class="template-item" @click="selectPackage(pkg)">
              <div class="template-info">
                <span>{{ pkg.name }}</span>
                <button class="delete" @click.stop="confirmDeletePackage(pkg.id)" :disabled="loading.deleting === pkg.id">
                  <span v-if="loading.deleting === pkg.id" class="loader small" aria-hidden="true"></span>
                  <span v-else>
                    <TrashIcon class="icon" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div class="fixed-button">
            <button @click="createNewPackage">
              <PlusIcon class="icon" />
              Create New Package
            </button>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Package Components and Selected Components -->
      <div class="bottom-row">
        <!-- Package Components -->
        <div class="card package-components">
          <h2>Package Components</h2>
          
          <!-- Tabs -->
          <div class="tabs" role="tablist">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="currentTab = tab"
              :class="{ active: currentTab === tab }"
              role="tab"
              :aria-selected="currentTab === tab"
            >
              {{ tab }}
            </button>
          </div>

          <!-- Component List -->
          <div class="scrollable-content component-list">
            <div v-if="loading.components" class="loading-indicator">
              <div class="loader" aria-hidden="true"></div>
              <span class="sr-only">Loading components...</span>
            </div>
            <div v-else class="component-grid">
              <div v-for="item in filteredComponents" :key="item.id" class="component-card">
                <div class="component-actions">
                  <button v-if="showCheckboxes && !isComponentSelected(item)" class="select-button" @click="selectComponent(item)">
                    <PlusCircleIcon class="icon" />
                  </button>
                  <button v-if="showCheckboxes && isComponentSelected(item)" class="remove-button" @click="removeComponent(item)">
                    <MinusCircleIcon class="icon" />
                  </button>
                  <button class="view-details" @click="viewDetails(item)">
                    <EyeIcon class="icon" />
                  </button>
                </div>
                <div class="component-info">
                  <h3 class="component-name">{{ item.name }}</h3>
                  <div class="price">Php{{ item.price }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="fixed-button">
            <button @click="showAddComponentModal = true">
              <PlusIcon class="icon" />
              Add New Component
            </button>
          </div>
        </div>

        <!-- Selected Components -->
        <div class="card selected-components">
          <h2>Selected Components</h2>
          <div class="scrollable-content selected-list">
            <div v-for="type in componentTypes" :key="type" class="selected-type">
              <h3 class="type-title">{{ type }}</h3>
              <div class="selected-items">
                <div v-for="component in getComponentsByType(type)" :key="component.id" class="selected-item">
                  <div class="selected-info">
                    <div class="component-name">{{ component.name }}</div>
                    <div class="price">Php{{ component.price }}</div>
                  </div>
                  <button class="remove" @click="removeComponent(component)">
                    <XCircleIcon class="icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Component Modal -->
    <div v-if="showAddComponentModal" class="modal" role="dialog" aria-labelledby="add-component-title">
      <div class="modal-content">
        <h2 id="add-component-title">Add New Component</h2>
        <div class="form-group">
          <label for="new-component-name">Name</label>
          <input id="new-component-name" v-model="newComponent.name" type="text" placeholder="Component Name" />
        </div>
        <div class="form-group">
          <label for="new-component-price">Price</label>
          <input id="new-component-price" v-model.number="newComponent.price" type="number" placeholder="Price" />
        </div>
        <div class="form-group">
          <label for="new-component-description">Description</label>
          <textarea id="new-component-description" v-model="newComponent.description" rows="4" placeholder="Description"></textarea>
        </div>
        <div class="form-group">
          <label for="new-component-type">Type</label>
          <select id="new-component-type" v-model="newComponent.type">
            <option v-for="tab in tabs" :key="tab" :value="tab">{{ tab }}</option>
          </select>
        </div>
        <div class="button-group">
          <button @click="closeModal('addComponent')">
            <XIcon class="icon" />
            Cancel
          </button>
          <button @click="addComponent" :disabled="loading.adding">
            <span v-if="loading.adding" class="loader small" aria-hidden="true"></span>
            <span v-else>
              <PlusIcon class="icon" />
              Add Component
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- View Details Modal with Edit and Delete Options -->
    <div v-if="showViewDetailsModal" class="modal" role="dialog" aria-labelledby="edit-component-title">
      <div class="modal-content">
        <h2 id="edit-component-title">Edit Component</h2>
        <div>
          <label for="edit-component-name"><strong>Name:</strong></label>
          <input id="edit-component-name" v-model="selectedComponentDetails.name" type="text" />
        </div>
        <div>
          <label for="edit-component-price"><strong>Price:</strong></label>
          <input id="edit-component-price" v-model="selectedComponentDetails.price" type="number" />
        </div>
        <div>
          <label for="edit-component-type"><strong>Type:</strong></label>
          <select id="edit-component-type" v-model="selectedComponentDetails.type">
            <option v-for="tab in tabs" :key="tab" :value="tab">{{ tab }}</option>
          </select>
        </div>
        <div>
          <label for="edit-component-description"><strong>Description:</strong></label>
          <textarea id="edit-component-description" v-model="selectedComponentDetails.description"></textarea>
        </div>
        <div class="button-group">
          <button @click="saveComponentDetails" :disabled="loading.saving">
            <span v-if="loading.saving" class="loader small" aria-hidden="true"></span>
            <span v-else>
              <SaveIcon class="icon" />
              Update
            </span>
          </button>
          <button @click="deleteComponent" :disabled="loading.deleting">
            <span v-if="loading.deleting" class="loader small" aria-hidden="true"></span>
            <span v-else>
              <TrashIcon class="icon" />
              Delete
            </span>
          </button>
          <button @click="closeModal('viewDetails')">
            <XIcon class="icon" />
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Package Options Modal -->
    <div v-if="showPackageOptionsModal" class="modal" role="dialog" aria-labelledby="package-options-title">
      <div class="modal-content">
        <h2 id="package-options-title">Manage Pricing Options</h2>
        <div class="package-options-list">
          <div v-for="option in packageOptions" :key="option.id" class="package-option-item">
            <div class="option-info">
              <div class="option-name">{{ option.name }}</div>
              <div class="option-price">Price Range: ₱{{ getLowestOptionPrice(option) }} - ₱{{ getHighestOptionPrice(option) }}</div>
            </div>
            <button 
              class="toggle-option-btn" 
              @click="toggleOptionInPackage(option)"
              :class="{ 'added': isOptionInPackage(option.id) }"
            >
              {{ isOptionInPackage(option.id) ? 'Remove' : 'Add' }}
            </button>
          </div>
        </div>
        <div class="button-group">
          <button @click="closePackageOptionsModal">
            <XIcon class="icon" />
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { db, storage } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { 
  XIcon, 
  SaveIcon, 
  TrashIcon, 
  PlusIcon, 
  PlusCircleIcon, 
  MinusCircleIcon, 
  EyeIcon, 
  XCircleIcon,
  SettingsIcon
} from 'lucide-vue-next';

// Firestore collections
const componentsCollection = collection(db, 'components');
const packagesCollection = collection(db, 'packages');
const packageOptionsCollection = collection(db, 'packageOptions');

// State variables
const tabs = ref(['Accommodations', 'Island Tours', 'Inland Tours', 'Activities', 'Transport']);
const currentTab = ref('Accommodations');
const showCheckboxes = ref(false);  

// Data storage
const components = ref([]);
const packages = ref([]);
const packageOptions = ref([]);

// Modal controls and temporary storage
const showAddComponentModal = ref(false);
const showViewDetailsModal = ref(false);
const showPackageOptionsModal = ref(false);
const selectedComponentDetails = ref({});
const newComponent = ref({ name: '', price: 0, type: 'Accommodations', description: '' });
const packageDetails = ref({ 
  id: null, 
  name: '', 
  description: '', 
  components: [], 
  imageUrl: '',
  options: [],
  pricingMode: 'fixed',
  fixedPrice: 0
});

// Loading states
const loading = ref({
  components: false,
  packages: false,
  saving: false,
  deleting: null,
  adding: false
});

// Upload progress
const uploadProgress = ref(0);
const fileInput = ref(null);

// Fetch data on mount
onMounted(async () => {
  await fetchComponents();
  await fetchPackages();
  await fetchPackageOptions();
});

// Fetch functions
const fetchComponents = async () => {
  loading.value.components = true;
  try {
    const snapshot = await getDocs(componentsCollection);
    components.value = snapshot.docs.map(doc => ({ id: doc.id, selected: false, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching components:", error);
  } finally {
    loading.value.components = false;
  }
};

const fetchPackages = async () => {
  loading.value.packages = true;
  try {
    const snapshot = await getDocs(packagesCollection);
    packages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching packages:", error);
  } finally {
    loading.value.packages = false;
  }
};

const fetchPackageOptions = async () => {
  try {
    const snapshot = await getDocs(packageOptionsCollection);
    packageOptions.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching package options:", error);
  }
};

// Package details functions
const clearPackageDetails = () => {
  packageDetails.value = { 
    id: null, 
    name: '', 
    description: '', 
    components: [], 
    imageUrl: '',
    options: [],
    pricingMode: 'fixed',
    fixedPrice: 0
  };
  components.value.forEach(component => (component.selected = false));
  showCheckboxes.value = false;
  resetFileInput();
};

const createNewPackage = () => {
  clearPackageDetails();
  showCheckboxes.value = true;
};

const cancelPackageChanges = () => {
  clearPackageDetails();
};

const selectPackage = async (pkg) => {
  packageDetails.value = {
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    components: pkg.components || [],
    imageUrl: pkg.imageUrl || '',
    options: pkg.options || [],
    pricingMode: pkg.pricingMode || 'fixed',
    fixedPrice: pkg.fixedPrice || 0
  };

  components.value.forEach((component) => {
    component.selected = packageDetails.value.components.some(pc => pc.id === component.id);
  });

  showCheckboxes.value = true;
};

const savePackageChanges = async () => {
  if (!packageDetails.value.name) {
    alert('Package name is required');
    return;
  }

  loading.value.saving = true;
  try {
    const newPackage = {
      name: packageDetails.value.name,
      description: packageDetails.value.description,
      components: packageDetails.value.components,
      imageUrl: packageDetails.value.imageUrl,
      options: packageDetails.value.options,
      pricingMode: packageDetails.value.pricingMode,
      fixedPrice: packageDetails.value.fixedPrice
    };

    if (packageDetails.value.id) {
      const packageRef = doc(db, 'packages', packageDetails.value.id);
      await updateDoc(packageRef, newPackage);
    } else {
      await addDoc(packagesCollection, newPackage);
    }
    
    await fetchPackages();
    resetFileInput();
    packageDetails.value.imageUrl = '';
    cancelPackageChanges();
  } catch (error) {
    console.error("Error saving package:", error);
  } finally {
    loading.value.saving = false;
  }
};

// Component functions
const addComponent = async () => {
  if (newComponent.value.name) {
    loading.value.adding = true;
    try {
      const docRef = await addDoc(componentsCollection, {
        ...newComponent.value,
        price: Number(newComponent.value.price),
        selected: false
      });
      const newComponentWithId = { id: docRef.id, ...newComponent.value, selected: false };
      components.value.push(newComponentWithId);
      closeModal('addComponent');
      newComponent.value = { name: '', price: 0, type: 'Accommodations', description: '' };
    } catch (error) {
      console.error("Error adding component:", error);
    } finally {
      loading.value.adding = false;
    }
  }
};

const selectComponent = (item) => {
  item.selected = true;
  packageDetails.value.components.push({
    id: item.id,
    name: item.name,
    type: item.type,
    price: item.price
  });
};

const removeComponent = (component) => {
  packageDetails.value.components = packageDetails.value.components.filter(c => c.id !== component.id);
  const componentToUpdate = components.value.find(c => c.id === component.id);
  if (componentToUpdate) {
    componentToUpdate.selected = false;
  }
};

const isComponentSelected = (component) => {
  return packageDetails.value.components.some(c => c.id === component.id);
};

const viewDetails = (item) => {
  selectedComponentDetails.value = { ...item };
  showViewDetailsModal.value = true;
};

const saveComponentDetails = async () => {
  if (selectedComponentDetails.value.id) {
    loading.value.saving = true;
    try {
      const docRef = doc(componentsCollection, selectedComponentDetails.value.id);
      await updateDoc(docRef, {
        name: selectedComponentDetails.value.name,
        price: Number(selectedComponentDetails.value.price),
        type: selectedComponentDetails.value.type,
        description: selectedComponentDetails.value.description,
      });
      const index = components.value.findIndex(c => c.id === selectedComponentDetails.value.id);
      if (index !== -1) {
        components.value[index] = { ...components.value[index], ...selectedComponentDetails.value };
      }
      closeModal('viewDetails');
    } catch (error) {
      console.error("Error updating component:", error);
    } finally {
      loading.value.saving = false;
    }
  }
};

const deleteComponent = async () => {
  if (confirm('Are you sure you want to delete this component?')) {
    loading.value.deleting = true;
    try {
      const componentRef = doc(db, 'components', selectedComponentDetails.value.id);
      await deleteDoc(componentRef);
      await fetchComponents();
      closeModal('viewDetails');
    } catch (error) {
      console.error("Error deleting component:", error);
    } finally {
      loading.value.deleting = false;
    }
  }
};

// File upload functions
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const storageReference = storageRef(storage, `package_images/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageReference, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        uploadProgress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.error("Error uploading file:", error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          packageDetails.value.imageUrl = downloadURL;
          
          if (packageDetails.value.id) {
            const packageRef = doc(db, 'packages', packageDetails.value.id);
            await updateDoc(packageRef, { imageUrl: downloadURL });
          }
        } catch (error) {
          console.error("Error getting download URL:", error);
        }
      }
    );
  }
};

const resetFileInput = () => {
  if (fileInput.value) {
    fileInput.value.value = '';
  }
  uploadProgress.value = 0;
};

// Package options functions
const getLowestOptionPrice = (option) => {
  const prices = option.pricing.map(p => Number(p.pricePerHead)).filter(p => !isNaN(p));
  return prices.length > 0 ? Math.min(...prices).toFixed(2) : '0.00';
};

const getHighestOptionPrice = (option) => {
  const prices = option.pricing.map(p => Number(p.pricePerHead)).filter(p => !isNaN(p));
  return prices.length > 0 ? Math.max(...prices).toFixed(2) : '0.00';
};

const toggleOptionInPackage = (option) => {
  const index = packageDetails.value.options.findIndex(o => o.id === option.id);
  if (index === -1) {
    packageDetails.value.options.push({
      id: option.id,
      name: option.name,
      pricing: option.pricing
    });
  } else {
    packageDetails.value.options.splice(index, 1);
  }
};

const closePackageOptionsModal = () => {
  showPackageOptionsModal.value = false;
};

// Computed properties
const estimatedBasePrice = computed(() => {
  return packageDetails.value.components.reduce((sum, component) => sum + (component.price || 0), 0).toFixed(2);
});

const filteredComponents = computed(() =>
  components.value.filter(component => component.type === currentTab.value)
);

const componentTypes = computed(() => {
  return [...new Set(packageDetails.value.components.map(c => c.type))];
});

// Helper functions
const closeModal = (modalName) => {
  if (modalName === 'addComponent') {
    showAddComponentModal.value = false;
    newComponent.value = { name: '', price: 0, type: 'Accommodations', description: '' };
  } else if (modalName === 'viewDetails') {
    showViewDetailsModal.value = false;
    selectedComponentDetails.value = {};
  }
};

const confirmDeletePackage = async (id) => {
  if (confirm('Are you sure you want to delete this package?')) {
    loading.value.deleting = id;
    try {
      await deleteDoc(doc(db, 'packages', id));
      await fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
    } finally {
      loading.value.deleting = false;
    }
  }
};

const getComponentsByType = (type) => {
  return packageDetails.value.components.filter(c => c.type === type);
};

const isOptionInPackage = (optionId) => {
  return packageDetails.value.options.some(o => o.id === optionId);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.package-manager {
  padding: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 11px;
}

.layout-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-row, .bottom-row {
  display: flex;
  gap: 10px;
}

.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.package-details, .package-templates {
  flex: 1;
  height: 400px;
}

.package-components {
  flex: 3;
  height: 350px;
}

.selected-components {
  flex: 2;
  height: 350px;
}

h2 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.tabs {
  display: flex;
  background-color: #f0f7f4;
  border-radius: 4px;
  padding: 2px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.tabs button {
  font-family: 'Poppins', sans-serif;
  flex: 1 0 auto;
  padding: 4px 8px;
  font-size: 11px;
  border: none;
  background: none;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  white-space: nowrap;
  margin: 1px;
}

.tabs button.active {
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.scrollable-content {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  scrollbar-width: thin;
}

.package-details .scrollable-content {
  padding-right: 5px;
}

.component-list, .template-list, .selected-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.component-item, .selected-item, .template-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.component-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price {
  font-size: 9px;
}

button {
  font-family: 'Poppins', sans-serif;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 500;
  border: 1px solid #e0e0e0;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  gap: 4px;
}

button:hover {
  background-color: #f0f0f0;
}

.fixed-button {
  margin-top: auto;
}

.fixed-button button {
  width: 100%;
  padding: 6px 12px;
  background-color: #0a8d88;
  color: white;
  justify-content: center;
}

.template-item {
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
}

.template-item:hover {
  background-color: #f0f0f0;
}

.template-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.form-group {
  margin-bottom: 8px;
}

label {
  display: block;
  font-size: 11px;
  margin-bottom: 4px;
}

input, textarea, select {
  width: 95%;
  padding: 4px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 11px;
}

textarea {
  resize: vertical;
}

.base-price, .option-info, .no-options {
  font-size: 12px;
  font-weight: bold;
  margin-top: 4px;
}

.option-info, .no-options {
  color: #0a8d88;
}

.button-group {
  display: flex;
  gap: 5px;
  margin-top: 8px;
}

.button-group button {
  flex: 1;
}

.save {
  background-color: #f0f0f0;
}

.component-name {
  font-weight: 600;
  font-size: 10px;
  margin-bottom: 2px;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 15px;
  border: 1px solid #888;
  width: 80%;
  max-width: 400px;
  border-radius: 4px;
}

.delete {
  padding: 6px 12px;
  background-color: #ff4d4f;
  color: white;
}

.delete:hover {
  background-color: #ff7875;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-size: 12px;
  color: #666;
}

.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 5px;
}

.loader.small {
  width: 10px;
  height: 10px;
  border-width: 1px;
  margin-right: 3px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.preview-image {
  max-width: 100%;
  max-height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-top: 5px;
}

.package-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.detail-card {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.detail-card h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.basic-info, .pricing {
  grid-column: span 2;
}

.image-upload {
  height: 150px;
}

.image-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.no-image {
  color: #999;
  font-size: 11px;
}

.price-summary {
  background-color: #e6f7ff;
  border-radius: 4px;
  padding: 6px;
  margin-top: 6px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 10px;
}

.action-buttons button {
  padding: 6px 12px;
  font-size: 11px;
}

.cancel {
  background-color: #f5f5f5;
  color: #333;
}

.save {
  background-color: #0a8d88;
  color: white;
}

.save:hover {
  background-color: #077c77;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.component-card {
  position: relative;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100px;
}

.component-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.component-actions {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 4px;
}

.component-actions button {
  padding: 2px;
  font-size: 8px;
}

.component-actions .icon {
  width: 18px;
  height: 18px;
}

.selected-type {
  margin-bottom: 10px;
}

.type-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.selected-items {
  display: grid;
  gap: 6px;
}

.selected-item {
  background-color: #f0f7ff;
  border-radius: 4px;
  padding: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-info {
  display: flex;
  flex-direction: column;
}

.selected-item .remove {
  padding: 3px 6px;
  font-size: 10px;
}

.icon {
  width: 14px;
  height: 14px;
}

.package-options-btn {
  margin-top: 10px;
  background-color: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.package-options-list {
  max-height: 300px;
  overflow-y: auto;
}

.package-option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.option-info {
  display: flex;
  flex-direction: column;
}

.option-name {
  font-weight: 500;
}

.option-price {
  font-size: 12px;
  color: #0a8d88;
}

.toggle-option-btn {
  padding: 4px 8px;
  background-color: #0a8d88;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-option-btn.added {
  background-color: #ff4d4f;
}

.toggle-option-btn:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .top-row, .bottom-row {
    flex-direction: column;
  }
  
  .package-details,
  .package-templates,
  .package-components,
  .selected-components {
    width: 100%;
  }
  
  .package-grid {
    grid-template-columns: 1fr;
  }
  
  .basic-info, .pricing {
    grid-column: span 1;
  }
}
</style>