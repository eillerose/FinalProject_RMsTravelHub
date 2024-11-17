    <template>
      <div class="package-manager">
        <!-- Top Row -->
        <div class="top-row">
          <!-- Package Components -->
          <div class="card package-components">
            <h2>Package Components</h2>
            
            <!-- Tabs -->
            <div class="tabs">
              <button
                v-for="tab in tabs"
                :key="tab"
                @click="currentTab = tab"
                :class="{ active: currentTab === tab }"
              >
                {{ tab }}
              </button>
            </div>

            <!-- Component List -->
            <div class="scrollable-content component-list">
                <div v-for="item in filteredComponents" :key="item.id" class="component-item">
                  <div class="component-info">
                    <div>
                      <label>{{ item.name }}</label>
                      <div class="price">Price: Php{{ item.price }}</div>
                    </div>
                  </div>
                  <div class="button-group">
                    <button v-if="showCheckboxes && !item.selected" class="select-button" @click="selectComponent(item)">
                      Select
                    </button>
                    <button v-if="showCheckboxes && item.selected" class="remove-button" @click="removeComponent(item)">
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
              <div v-for="pkg in packages" :key="pkg.id" class="template-item" @click="selectPackage(pkg)">
                <div class="template-info">
                  <span>{{ pkg.name }}</span>
                  <button class="delete" @click.stop="confirmDeletePackage(pkg.id)">Delete</button>
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
            
            <div class="form">
              <div class="form-group">
                <label>Package Name</label>
                <input 
                  v-model="packageDetails.name"
                  type="text" 
                  placeholder="Package Name" 
                  required
                  :class="{ 'input-error': !packageDetails.name }"
                />
              </div>

              <div class="form-group">
                <label>Description</label>
                <textarea 
                  v-model="packageDetails.description"
                  rows="4"
                ></textarea>
              </div>

              <div class="form-group">
                <label>Discount (%)</label>
                <input 
                  v-model="packageDetails.discount"
                  type="number" 
                  placeholder="0"
                />
              </div>

              <div class="total-price">
                Total Estimated Price: Php{{ totalPrice }}
              </div>

              <div v-if="packageDetails.discount > 0" class="discounted-price">
                Discounted Price: Php{{ discountedPrice }}
              </div>

              <div class="button-group">
                <button class="cancel" @click="cancelPackageChanges">Cancel</button>
                <button class="save" @click="savePackageChanges">Save Changes</button>
              </div>
            </div>
          </div>

          <!-- Selected Components -->
          <div class="card selected-components">
            <h2>Selected Components</h2>
            <div class="scrollable-content selected-list">
              <div v-for="component in selectedComponents" :key="component.id" class="selected-item">
                <div>
                  <div class="component-name">{{ component.name }}</div>
                  <div class="price">Price: Php{{ component.price }}</div>
                </div>
                <button class="remove" @click="removeComponent(component)">Remove</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Component Modal -->
        <div v-if="showAddComponentModal" class="modal">
          <div class="modal-content">
            <h2>Add New Component</h2>
            <div class="form-group">
              <label>Name</label>
              <input v-model="newComponent.name" type="text" placeholder="Component Name" />
            </div>
            <div class="form-group">
              <label>Price</label>
              <input v-model="newComponent.price" type="number" placeholder="Price" />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="newComponent.description" rows="4" placeholder="Description"></textarea>
            </div>
            <div class="form-group">
              <label>Type</label>
              <select v-model="newComponent.type">
                <option v-for="tab in tabs" :key="tab" :value="tab">{{ tab }}</option>
              </select>
            </div>
            <div class="button-group">
              <button @click="closeModal('addComponent')">Cancel</button>
              <button @click="addComponent">Add Component</button>
            </div>
          </div>
        </div>

        <!-- View Details Modal with Edit and Delete Options -->
        <div v-if="showViewDetailsModal" class="modal">
          <div class="modal-content">
            <h2>Component Details</h2>
            <div>
              <label><strong>Name:</strong></label>
              <input v-model="selectedComponentDetails.name" type="text" />
            </div>
            <div>
              <label><strong>Price:</strong></label>
              <input v-model="selectedComponentDetails.price" type="number" />
            </div>
            <div>
              <label><strong>Type:</strong></label>
              <select v-model="selectedComponentDetails.type">
                <option v-for="tab in tabs" :key="tab" :value="tab">{{ tab }}</option>
              </select>
            </div>
            <div>
              <label><strong>Description:</strong></label>
              <textarea v-model="selectedComponentDetails.description"></textarea>
            </div>
            <div class="button-group">
              <button @click="saveComponentDetails">Save</button>
              <button @click="deleteComponent">Delete</button>
              <button @click="closeModal('viewDetails')">Close</button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <script setup>
    import { ref, computed, onMounted } from 'vue';
    import { db } from '../firebaseConfig';
    import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

    // Firestore collections
    const componentsCollection = collection(db, 'components');
    const packagesCollection = collection(db, 'packages');

    // State variables
    const tabs = ['Accommodation', 'Tours', 'Activities', 'Transport', 'Additional'];
    const currentTab = ref('Accommodation');
    const showCheckboxes = ref(false);  

    // Data storage
    const components = ref([]);
    const packages = ref([]);

    // Modal controls and temporary storage
    const showAddComponentModal = ref(false);
    const showViewDetailsModal = ref(false);
    const selectedComponentDetails = ref({});
    const newComponent = ref({ name: '', price: 0, type: 'Accommodation', description: '' });
    const packageDetails = ref({ id: null, name: '', description: '', discount: 0, components: [] });


    // Fetch components and packages on mount
    const fetchComponents = async () => {
      const snapshot = await getDocs(componentsCollection);
      components.value = snapshot.docs.map(doc => ({ id: doc.id, selected: false, ...doc.data() }));
    };

    const fetchPackages = async () => {
      const snapshot = await getDocs(packagesCollection);
      packages.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    onMounted(() => {
      fetchComponents();
      fetchPackages();
    });


    // Reusable function to clear package details
    const clearPackageDetails = () => {
      packageDetails.value = { id: null, name: '', description: '', discount: 0, components: [] };
      components.value.forEach(component => (component.selected = false));
      showCheckboxes.value = false;
    };

    const closeModal = (modalName) => {
      if (modalName === 'addComponent') {
        showAddComponentModal.value = false;
        newComponent.value = { name: '', price: 0, type: 'Accommodation', description: '' };
      } else if (modalName === 'viewDetails') {
        showViewDetailsModal.value = false;
        selectedComponentDetails.value = {};
      }
    };

    // Reusable function to close modals and clear component details
    const closeAddComponentModal = () => {
      showAddComponentModal.value = false;
      newComponent.value = { name: '', price: 0, type: 'Accommodation', description: '' };
    };

    // Add Component
    const addComponent = async () => {
      if (newComponent.value.name && newComponent.value.price) {
        const docRef = await addDoc(componentsCollection, {
          ...newComponent.value,
          price: Number(newComponent.value.price),
          selected: false
        });
        components.value.push({ id: docRef.id, ...newComponent.value });
        closeAddComponentModal(); // Reset modal and input fields
      }
    };

    // Filtered components by tab
    const filteredComponents = computed(() =>
      components.value.filter(component => component.type === currentTab.value)
    );

    // Select component for package
    const selectComponent = (item) => {
      item.selected = true;
      packageDetails.value.components.push(item);
    };

    // Remove component from package
    const removeComponent = (component) => {
      packageDetails.value.components = packageDetails.value.components.filter(c => c.id !== component.id);
      components.value.find(c => c.id === component.id).selected = false; // Deselect in the main list
    };

    // Selected components for display
    const selectedComponents = computed(() => packageDetails.value.components);

    // Package operations
    const createNewPackage = () => {
      clearPackageDetails();
      showCheckboxes.value = true;
    };

    const cancelPackageChanges = () => {
      clearPackageDetails();
    };

    // Select package and load details into the form for editing
    const selectPackage = async (pkg) => {
      // Set package details from the selected package
      packageDetails.value = {
        id: pkg.id,
        name: pkg.name,
        description: pkg.description,
        discount: pkg.discount,
        components: []
      };

      // Load selected components and mark them as selected in the main list
      components.value.forEach((component) => {
        component.selected = pkg.components.includes(component.id);
        if (component.selected) {
          packageDetails.value.components.push(component); // Add to the selected components list
        }
      });
      
      // Show checkboxes for editing
      showCheckboxes.value = true;
    };  


    // Save changes for package
    const savePackageChanges = async () => {
      if (!packageDetails.value.name) {
        alert('Package name is required');
        return;
      }
      
      const newPackage = {
        name: packageDetails.value.name,
        description: packageDetails.value.description,
        discount: packageDetails.value.discount,
        components: packageDetails.value.components.map(c => c.id)
      };
      
      if (packageDetails.value.id) {
        const packageRef = doc(db, 'packages', packageDetails.value.id);
        await updateDoc(packageRef, newPackage);
      } else {
        await addDoc(packagesCollection, newPackage);
      }
      
      await fetchPackages();
      cancelPackageChanges();
    };

    // Computed total price for selected components without discount
    const totalPrice = computed(() => {
      const subtotal = packageDetails.value.components.reduce((sum, component) => sum + component.price, 0);
      return subtotal.toFixed(2); // Format to 2 decimal places for currency
    });

    // Computed price with discount applied
    const discountedPrice = computed(() => {
      const discountFactor = (100 - packageDetails.value.discount) / 100;
      return (totalPrice.value * discountFactor).toFixed(2); // Format to 2 decimal places
    });


    // Viewing and editing details
    const viewDetails = (item) => {
      selectedComponentDetails.value = { ...item };
      showViewDetailsModal.value = true;
    };

    // Save updated component details
    const saveComponentDetails = async () => {
      if (selectedComponentDetails.value.id) {
        const docRef = doc(componentsCollection, selectedComponentDetails.value.id);
        await updateDoc(docRef, {
          name: selectedComponentDetails.value.name,
          price: Number(selectedComponentDetails.value.price),
          type: selectedComponentDetails.value.type,
          description: selectedComponentDetails.value.description,
        });
        fetchComponents(); // Refresh the components list to reflect changes
        closeModal('viewDetails');
      }
    };

    // Edit component in details modal
    const editComponent = async () => {
      const componentRef = doc(db, 'components', selectedComponentDetails.value.id);
      await updateDoc(componentRef, selectedComponentDetails.value);
      await fetchComponents();
      closeViewDetailsModal();
    };

    // Delete component in details modal
    const deleteComponent = async () => {
      if (confirm('Are you sure you want to delete this component?')) {
        const componentRef = doc(db, 'components', selectedComponentDetails.value.id);
        await deleteDoc(componentRef);
        await fetchComponents();
        closeViewDetailsModal();
      }
    };

    // Confirm delete package
    const confirmDeletePackage = async (id) => {
      if (confirm('Are you sure you want to delete this package?')) {
        await deleteDoc(doc(db, 'packages', id));
        await fetchPackages();
      }
    };
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

  .card {
    border: 1px solid #e0e0e0;
    border-radius: 16px;
    background-color: white;
    padding-top: 20px;
    padding-right: 40px;
    padding-left: 30px;
    padding-bottom: 30px;
    display: flex;
    flex-direction: column;
    height: 450px; /* Set a fixed height */
  }

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .tabs {
    display: flex;
    background-color: #f0f0f0;
    border-radius: 8px;
    padding: 4px;
    margin-bottom: 24px;
  }

  .tabs button {
    flex: 1;
    padding: 5px 16px;
    font-size: 14px;
    border: none;
    background: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s;
  }

  .tabs button.active {
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .scrollable-content {
    flex-grow: 1;
    overflow-y: auto;
    margin-bottom: 16px;
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
    background-color: #5b5a5a82;
  }

  .fixed-button {
    margin-top: auto;
  }

  .fixed-button button {
    width: 100%;
    padding: 10px 24px;
    background-color: #f0f0f0;
  }

  .fixed-button button:hover{
    background-color: #5b5a5a82;
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
    width:  100%;
  }

  .package-components {
    flex: 1;
  }

  .package-templates, .package-details {
    width: 400px;
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
    width: 100%;
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
  }

  textarea {
    resize: vertical;
  }

  .total-price {
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

  .selected-components {
    flex: 1;
  }

  .component-name {
    font-weight: bold;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
    -webkit-appearance: none;
    appearance: none;
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
    padding: 50px;
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
  </style>