    <template>
      <div class="package-manager">
        <!-- Top Row -->
        <div class="top-row">
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
              <div v-else v-for="item in filteredComponents" :key="item.id" class="component-item">
                <div class="component-info">
                  <div>
                    <label>{{ item.name }}</label>
                    <div class="price">Price: Php{{ item.price }}</div>
                  </div>
                </div>
                <div class="button-group">
                  <button v-if="showCheckboxes && !isComponentSelected(item)" class="select-button" @click="selectComponent(item)">
                    Select
                  </button>
                  <button v-if="showCheckboxes && isComponentSelected(item)" class="remove-button" @click="removeComponent(item)">
                    Remove
                  </button>
                  <button class="view-details" @click="viewDetails(item)">Details</button>
                </div>
              </div>
            </div>

            <div class="fixed-button">
              <button @click="showAddComponentModal = true">Add New Component</button>
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
                    <span v-else>Delete</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="fixed-button">
              <button @click="createNewPackage">Create New Package</button>
            </div>
          </div>
        </div>

        <!-- Bottom Row -->
        <div class="bottom-row">
          <!-- Package Details -->
          <div class="card package-details">
            <h2>Package Details</h2>
            
            <div class="scrollable-content">
              <div class="form">
                <div class="form-group">
                  <label for="package-name">Package Name</label>
                  <input 
                    id="package-name"
                    v-model="packageDetails.name"
                    type="text" 
                    placeholder="Package Name" 
                    required
                    :class="{ 'input-error': !packageDetails.name }"
                  />
                </div>

                <div class="form-group">
                  <label for="package-description">Description</label>
                  <textarea 
                    id="package-description"
                    v-model="packageDetails.description"
                    rows="4"
                  ></textarea>
                </div>

                <div class="form-group">
                  <label for="package-discount">Discount (%)</label>
                  <input 
                    id="package-discount"
                    v-model="packageDetails.discount"
                    type="number" 
                    placeholder="0"
                  />
                </div>

                <div class="form-group">
                  <label class="checkbox-label">
                    <input 
                      v-model="packageDetails.includePackageOptions"
                      type="checkbox"
                    />
                    Include Package Options
                  </label>
                </div>

                <div class="form-group">
                  <label for="package-image">Package Image</label>
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
                  <img v-if="packageDetails.imageUrl" :src="packageDetails.imageUrl" alt="Package Image" class="preview-image" />
                </div>

                <div class="total-price">
                  Total Estimated Price: Php{{ totalPrice }}
                </div>

                <div v-if="packageDetails.discount > 0" class="discounted-price">
                  Discounted Price: Php{{ discountedPrice }}
                </div>
              </div>
            </div>

            <div class="fixed-bottom-buttons">
              <div class="button-group">
                <button class="cancel" @click="cancelPackageChanges">Cancel</button>
                <button class="save" @click="savePackageChanges" :disabled="loading.saving">
                  <span v-if="loading.saving" class="loader small" aria-hidden="true"></span>
                  <span v-else>Save Changes</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Selected Components -->
          <div class="card selected-components">
            <h2>Selected Components</h2>
            <div class="scrollable-content selected-list">
              <div v-for="type in componentTypes" :key="type">
                <h3>{{ type }}</h3>
                <div v-for="component in getComponentsByType(type)" :key="component.id" class="selected-item">
                  <div>
                    <div class="component-name">{{ component.name }}</div>
                    <div class="price">Price: Php{{ component.price }}</div>
                  </div>
                  <button class="remove" @click="removeComponent(component)">Remove</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Package Options -->
          <div class="card package-options">
            <h2>Package Options</h2>
            <div class="scrollable-content">
              <div v-if="!creatingNewOption && !editingOption">
                <div v-for="option in packageOptions" :key="option.id" class="package-option-item">
                  <div class="option-header">
                    <h3>{{ option.name }}</h3>
                    <div>
                      <button 
                        v-if="packageDetails.includePackageOptions" 
                        @click.stop="toggleOptionSelection(option)" 
                        :class="{ 'selected': isOptionSelected(option) }"
                      >
                        {{ isOptionSelected(option) ? 'Selected' : 'Select' }}
                      </button>
                      <button 
                        v-else 
                        @click.stop="deletePackageOption(option.id)" 
                        class="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div class="details-hint" @click="editPackageOption(option)">Click to view and edit details</div>
                </div>
              </div>
              <div v-else class="package-option-form">
                <div class="form-group">
                  <label for="package-option-name">Package Option Name</label>
                  <input 
                    id="package-option-name"
                    v-model="newPackageOption.name" 
                    type="text" 
                    placeholder="Package Option Name" 
                    class="form-input"
                  />
                </div>
                
                <div class="form-group">
                  <label>Pricing Per Pax</label>
                  <div v-for="(price, index) in newPackageOption.pricing" :key="index" class="price-row">
                    <input 
                      v-model="price.pax" 
                      placeholder="Pax Range (e.g, 1-2)" 
                      class="form-input"
                    />
                    <input 
                      v-model.number="price.price" 
                      type="number" 
                      placeholder="Price Per Head" 
                      class="form-input"
                    />
                    <button @click="removePricing(index)" class="remove-button">Remove</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="fixed-bottom-buttons">
              <div v-if="!creatingNewOption && !editingOption">
                <button @click="startCreatingNewOption" class="create-button">Create New Package Option</button>
              </div>
              <div v-else class="button-group">
                <button @click="cancelPackageOptionChanges" class="cancel-button">Cancel</button>
                <button @click="addPricing" class="add-button">Add Pricing Option</button>
                <button @click="savePackageOption" class="save-button" :disabled="loading.saving">
                  <span v-if="loading.saving" class="loader small" aria-hidden="true"></span>
                  <span v-else>{{ editingOption ? 'Update' : 'Save' }}</span>
                </button>
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
              <button @click="closeModal('addComponent')">Cancel</button>
              <button @click="addComponent" :disabled="loading.adding">
                <span v-if="loading.adding" class="loader small" aria-hidden="true"></span>
                <span v-else>Add Component</span>
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
                <span v-else>Update</span>
              </button>
              <button @click="deleteComponent" :disabled="loading.deleting">
                <span v-if="loading.deleting" class="loader small" aria-hidden="true"></span>
                <span v-else>Delete</span>
              </button>
              <button @click="closeModal('viewDetails')">Close</button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <script setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import { db, storage } from '../firebaseConfig';
    import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
    import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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
    const selectedComponentDetails = ref({});
    const newComponent = ref({ name: '', price: 0, type: 'Accommodations', description: '' });
    const packageDetails = ref({ 
      id: null, 
      name: '', 
      description: '', 
      discount: 0, 
      components: [], 
      includePackageOptions: false,
      selectedOptions: [],
      imageUrl: ''
    });

    // Package options
    const packageOptionsData = ref({
      paymentTerms: 'full',
      terms: ''
    });

    // New package option
    const creatingNewOption = ref(false);
    const editingOption = ref(false);
    const newPackageOption = ref({
      id: null,
      name: '',
      pricing: [
        { pax: '1-2', price: 0 },
        { pax: '3-4', price: 0 },
      ],
    });

    // Loading states
    const loading = ref({
      components: false,
      packages: false,
      packageOptions: false,
      saving: false,
      deleting: null,
      adding: false
    });

    // Upload progress
    const uploadProgress = ref(0);
    const fileInput = ref(null);

    // Fetch data on mount
    onMounted(() => {
      fetchComponents();
      fetchPackages();
      fetchPackageOptions();
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
      loading.value.packageOptions = true;
      try {
        const snapshot = await getDocs(packageOptionsCollection);
        packageOptions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching package options:", error);
      } finally {
        loading.value.packageOptions = false;
      }
    };

    // Package details functions
    const clearPackageDetails = () => {
      packageDetails.value = { 
        id: null, 
        name: '', 
        description: '', 
        discount: 0, 
        components: [], 
        includePackageOptions: false,
        selectedOptions: [],
        imageUrl: ''
      };
      components.value.forEach(component => (component.selected = false));
      showCheckboxes.value = false;
      packageOptionsData.value = { paymentTerms: 'full', terms: '' };
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
        discount: pkg.discount,
        components: pkg.components || [],
        includePackageOptions: pkg.includePackageOptions || false,
        selectedOptions: pkg.selectedOptions || [],
        imageUrl: pkg.imageUrl || ''
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
          discount: packageDetails.value.discount,
          components: packageDetails.value.components,
          paymentTerms: packageOptionsData.value.paymentTerms,
          terms: packageOptionsData.value.terms,
          includePackageOptions: packageDetails.value.includePackageOptions,
          selectedOptions: packageDetails.value.selectedOptions,
          imageUrl: packageDetails.value.imageUrl
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
        type: item.type
      });
    };

    const removeComponent = (component) => {
      packageDetails.value.components = packageDetails.value.components.filter(c => c.id !== component.id);
      components.value.find(c => c.id === component.id).selected = false;
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

    // Package option functions
    const toggleOptionSelection = (option) => {
      const index = packageDetails.value.selectedOptions.findIndex(o => o.id === option.id);
      if (index !== -1) {
        packageDetails.value.selectedOptions.splice(index, 1);
      } else {
        packageDetails.value.selectedOptions.push(option);
      }
    };

    const isOptionSelected = (option) => {
      return packageDetails.value.selectedOptions.some(o => o.id === option.id);
    };

    const startCreatingNewOption = () => {
      creatingNewOption.value = true;
      editingOption.value = false;
      resetNewPackageOption();
    };

    const cancelPackageOptionChanges = () => {
      creatingNewOption.value = false;
      editingOption.value = false;
      resetNewPackageOption();
    };

    const resetNewPackageOption = () => {
      newPackageOption.value = {
        id: null,
        name: '',
        pricing: [
          { pax: '1-2', price: 0 },
          { pax: '3-4', price: 0 },
        ],
      };
    };

    const addPricing = () => {
      newPackageOption.value.pricing.push({ pax: '', price: 0 });
    };

    const removePricing = (index) => {
      newPackageOption.value.pricing.splice(index, 1);
    };

    const savePackageOption = async () => {
      if (!newPackageOption.value.name) {
        alert('Package option name is required');
        return;
      }

      loading.value.saving = true;
      try {
        if (editingOption.value) {
          const optionRef = doc(db, 'packageOptions', newPackageOption.value.id);
          await updateDoc(optionRef, newPackageOption.value);
          const index = packageOptions.value.findIndex(o => o.id === newPackageOption.value.id);
          if (index !== -1) {
            packageOptions.value[index] = { ...newPackageOption.value };
          }
        } else {
          const docRef = await addDoc(collection(db, 'packageOptions'), newPackageOption.value);
          packageOptions.value.push({ ...newPackageOption.value, id: docRef.id });
        }
        cancelPackageOptionChanges();
      } catch (error) {
        console.error("Error saving package option:", error);
        alert('An error occurred while saving the package option. Please try again.');
      } finally {
        loading.value.saving = false;
      }
    };

    const editPackageOption = (option) => {
      newPackageOption.value = JSON.parse(JSON.stringify(option));
      editingOption.value = true;
      creatingNewOption.value = false;
    };

    const deletePackageOption = async (id) => {
      if (confirm('Are you sure you want to delete this package option?')) {
        try {
          await deleteDoc(doc(db, 'packageOptions', id));
          packageOptions.value = packageOptions.value.filter(option => option.id !== id);
        } catch (error) {
          console.error("Error deleting package option:", error);
          alert('An error occurred while deleting the package option. Please try again.');
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

    // Computed properties
    const filteredComponents = computed(() =>
      components.value.filter(component => component.type === currentTab.value)
    );

    const totalPrice = computed(() => {
      const subtotal = packageDetails.value.components.reduce((sum, component) => {
        const fullComponent = components.value.find(c => c.id === component.id);
        return sum + (fullComponent ? fullComponent.price : 0);
      }, 0);
      return subtotal.toFixed(2);
    });

    const discountedPrice = computed(() => {
      const discountFactor = (100 - packageDetails.value.discount) / 100;
      return (totalPrice.value * discountFactor).toFixed(2);
    });

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

    // Watch effect
    watch(() => packageDetails.value.includePackageOptions, (newValue) => {
      if (!newValue) {
        packageDetails.value.selectedOptions = [];
      }
    });
    </script>

    <style scoped>
      .package-manager {
        padding: 15px;
        font-family: Arial, sans-serif;
      }

      .top-row, .bottom-row {
        display: flex;
        gap: 15px;
        margin-bottom: 22px;
      }

      .bottom-row {
        width: 100%;
        justify-content: space-between;
      }

      .card {
        border: 1px solid #e0e0e0;
        border-radius: 16px;
        background-color: white;
        padding: 20px;
        display: flex;
        flex-direction: column;
        height: 450px;
      }

      .package-components {
        flex: 1;
      }

      .package-templates {
        width: 400px;
      }

      .package-details {
        width: 35%;
        display: flex;
        flex-direction: column;
      }

      .selected-components {
        width: 25%;
      }

      .selected-components .scrollable-content {
        max-height: 350px;
        overflow-y: auto;
      }

      .package-options {
        width: 40%;
      }

      h2 {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 16px;
      }

      .tabs {
        display: flex;
        background-color: #b0a9a9;
        border-radius: 5px;
        padding: 2px;
        margin-bottom: 24px;
        flex-wrap: wrap;
      }

      .tabs button {
        flex: 1 0 auto;
        padding: 5px 16px;
        font-size: 14px;
        border: none;
        background: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s, box-shadow 0.3s;
        white-space: nowrap;
        margin: 2px;
      }

      .tabs button.active {
        background-color: white;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .scrollable-content {
        flex-grow: 1;
        overflow-y: auto;
        margin-bottom: 13px;
        scrollbar-width: thin;
      }

      .package-details .scrollable-content {
        padding-right: 10px;
      }

      .component-list, .template-list, .selected-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .component-item, .selected-item, .template-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .component-info {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .price {
        font-size: 14px;
        color: #666;
      }

      button {
        padding: 10px 16px;
        font-size: 12px;
        font-weight: 500;
        border: 1px solid #e0e0e0;
        background-color: white;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      button:hover {
        background-color: #f0f0f0;
      }

      .fixed-button {
        margin-top: auto;
      }

      .fixed-button button {
        width: 100%;
        padding: 10px 24px;
        background-color: #f0f0f0;
      }

      .template-item {
        padding: 16px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
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
        margin-bottom: 16px;
      }

      label {
        display: block;
        font-size: 14px;
        margin-bottom: 8px;
      }

      input, textarea, select {
        width: 95%;
        padding: 8px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        font-size: 12px;
      }

      textarea {
        resize: vertical;
      }

      .total-price, .discounted-price {
        font-size: 14px;
        font-weight: bold;
        margin-top: 16px;
      }

      .button-group {
        display: flex;
        gap: 10px;
        margin-top: 16px;
      }

      .button-group button {
        flex: 1;
      }

      .save {
        background-color: #f0f0f0;
      }

      .component-name {
        font-weight: bold;
      }

      .modal {
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .modal-content {
        background-color: #fefefe;
        padding: 25px;
        border: 1px solid #888;
        width: 80%;
        max-width: 500px;
        border-radius: 8px;
      }

      .delete {
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
        height: 100px;
        font-size: 14px;
        color: #666;
      }

      .loader {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3498db;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        animation: spin 1s linear infinite;
        display: inline-block;
        margin-right: 10px;
      }

      .loader.small {
        width: 12px;
        height: 12px;
        border-width: 2px;
        margin-right: 5px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .package-option-item {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        cursor: pointer;
      }

      .package-option-item:hover {
        background-color: #f0f0f0;
      }

      .package-option-item h3 {
        margin-top: 0;
        margin-bottom: 8px;
      }

      .package-option-form {
        padding: 20px;
        border-radius: 8px;
        background-color: white;
      }

      .price-row {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
        align-items: center;
      }

      .form-input {
        padding: 8px 12px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        font-size: 14px;
      }

      .option-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .create-button, .cancel-button, .add-button, .save-button, .delete-button {
        padding: 10px 16px;
        font-size: 12px;
        font-weight: 500;
        border: 1px solid #e0e0e0;
        background-color: white;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s;
      }

      .create-button:hover, .cancel-button:hover, .add-button:hover, .save-button:hover, .delete-button:hover {
        background-color: #f0f0f0;
      }

      .button-group {
        display: flex;
        gap: 8px;
      }

      .button-group button {
        flex: 1;
      }

      .fixed-bottom-buttons {
        margin-top: auto;
        padding-top: 16px;
        border-top: 1px solid #e0e0e0;
      }

      .delete-button {
        background-color: #ff4d4f;
        color: white;
      }

      .delete-button:hover {
        background-color: #ff7875;
      }

      .details-hint {
        font-size: 12px;
        color: #999;
        margin-top: -13px;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        font-size: 14px;
        cursor: pointer;
      }

      .checkbox-label input[type="checkbox"] {
        margin-right: 8px;
        width: auto;
      }

      .preview-image {
        max-width: 100%;
        max-height: 200px;
        margin-top: 10px;
      }

      .progress-bar {
        width: 100%;
        height: 10px;
        background-color: #e0e0e0;
        border-radius: 5px;
        margin-top: 10px;
      }

      .progress {
        height: 100%;
        background-color: #4caf50;
        border-radius: 5px;
        transition: width 0.3s ease;
      }

      .package-image-container {
        margin-top: 20px;
        text-align: center;
      }

      .package-image {
        max-width: 100%;
        max-height: 200px;
        border-radius: 8px;
      }
      </style>