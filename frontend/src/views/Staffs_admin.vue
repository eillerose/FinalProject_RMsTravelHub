<template>
  <div class="staff-management">
    <div class="staff-management__container">
      <!-- Tab Navigation -->
      <div class="tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['tabs__button', { 'tabs__button--active': activeTab === tab.id }]"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Main Content -->
      <div class="content">
        <div class="content__header">
          <h1 class="content__title">
            {{ activeTab === 'guides' ? 'Tour Guides' : 'Marketing & Sales Staff' }}
          </h1>
          <div class="content__actions">
            <div class="search">
              <input
                v-model="searchQuery"
                type="search"
                placeholder="Search staff..."
                class="search__input"
                @input="handleSearch"
              />
            </div>
            <button
              @click="openAddPanel"
              class="button button--primary"
            >
              Add {{ activeTab === 'guides' ? 'Guide' : 'Staff' }}
            </button>
            <button
              @click="exportToPDF"
              class="button button--secondary"
            >
              Export to PDF
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th v-for="header in getTableHeaders" :key="header.key" 
                    @click="sortBy = header.key"
                    class="table__header"
                >
                  <div class="table__header-content">
                    <span>{{ header.label }}</span>
                    <ArrowUpDown v-if="sortBy === header.key" class="table__sort-icon" />
                  </div>
                </th>
                <th class="table__header">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="staff in paginatedStaff" :key="staff.id" 
                  @click="showStaffProfile(staff)"
                  class="table__row"
              >
                <td class="table__cell">{{ staff.id }}</td>
                <td class="table__cell">
                  <div class="staff-info">
                    <img 
                      :src="staff.profilePhoto || '/placeholder.svg?height=40&width=40'" 
                      class="staff-info__photo"
                      alt=""
                    />
                    <div class="staff-info__details">
                      <div class="staff-info__name">
                        {{ staff.firstName }} {{ staff.lastName }}
                      </div>
                      <div class="staff-info__email">{{ staff.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="table__cell">{{ staff.phone }}</td>
                <td class="table__cell">{{ calculateExperience(staff.startDate) }} years</td>
                <td class="table__cell">
                  <button 
                    @click.stop="openEditPanel(staff)"
                    class="button button--secondary"
                  >
                    <Edit2 class="button__icon" /> Edit
                  </button>
                  <button 
                    @click.stop="deleteStaff(staff.id)"
                    class="button button--danger"
                  >
                    <Trash2 class="button__icon" /> Delete
                  </button>
                  <button 
                    v-if="activeTab === 'marketing' && !staff.isAdmin"
                    @click.stop="promoteToAdmin(staff)"
                    class="button button--primary"
                  >
                    <UserPlus class="button__icon" /> Promote to Admin
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="pagination__button"
          >
            <ChevronLeft class="button__icon" /> Previous
          </button>
          <span class="pagination__info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="pagination__button"
          >
            Next <ChevronRight class="button__icon" />
          </button>
        </div>
      </div>
    </div>

    <!-- Sliding Panel -->
    <div 
      v-if="isPanelOpen"
      class="panel-overlay"
      @click="closePanel"
    >
      <div class="panel" @click.stop>
        <div class="panel__header">
          <h2 class="panel__title">
            {{ panelMode === 'view' ? 'Staff Details' : (isEditing ? 'Edit Staff' : 'Add New Staff') }}
          </h2>
          <button
            @click="closePanel"
            class="panel__close"
          >
            <X />
          </button>
        </div>
        <div class="panel__content">
          <!-- View Mode -->
          <div v-if="panelMode === 'view'" class="staff-details">
            <img 
              :src="currentStaff.profilePhoto || '/placeholder.svg?height=150&width=150'" 
              class="staff-details__photo"
              alt=""
            />
            <div class="staff-details__info">
              <div v-for="(detail, index) in getStaffDetails" :key="index" class="staff-details__item">
                <span class="staff-details__label">{{ detail.label }}:</span>
                <span class="staff-details__value">{{ detail.value }}</span>
              </div>
            </div>
            <div class="staff-details__bio">
              <h3>Bio</h3>
              <p>{{ currentStaff.bio }}</p>
            </div>
            <button
              @click="openEditPanel(currentStaff)"
              class="button button--primary"
            >
              Edit Details
            </button>
          </div>

          <!-- Add/Edit Form -->
          <form v-else @submit.prevent="isEditing ? saveStaff() : addNewStaff()" class="staff-form">
            <div class="form-group">
              <label class="form-label">First Name</label>
              <input
                v-model="currentStaff.firstName"
                type="text"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Last Name</label>
              <input
                v-model="currentStaff.lastName"
                type="text"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input
                v-model="currentStaff.email"
                type="email"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input
                v-model="currentStaff.phone"
                type="tel"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Start Date</label>
              <input
                v-model="currentStaff.startDate"
                type="date"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Bio</label>
              <textarea
                v-model="currentStaff.bio"
                class="form-textarea"
                rows="4"
              ></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Languages Spoken</label>
              <div class="checkbox-group">
                <div v-for="lang in languages" :key="lang" class="checkbox">
                  <input
                    type="checkbox"
                    :id="lang"
                    :value="lang"
                    v-model="currentStaff.languages"
                    class="checkbox__input"
                  />
                  <label :for="lang" class="checkbox__label">{{ lang }}</label>
                </div>
              </div>
            </div>
            <div v-if="activeTab === 'guides'" class="form-group">
              <label class="form-label">Tour Specialization</label>
              <input
                v-model="currentStaff.specialization"
                type="text"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Profile Photo</label>
              <input
                type="file"
                @change="handleFileUpload"
                accept="image/*"
                class="form-file"
              />
            </div>

            <div class="form-actions">
              <button
                type="button"
                @click="closePanel"
                class="button button--secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="button button--primary"
              >
                {{ isEditing ? 'Save Changes' : 'Add Staff Member' }}
              </button>
            </div>

            <!-- Status Messages -->
            <div v-if="loading" class="status status--loading">Processing...</div>
            <div v-if="errorMessage" class="status status--error">{{ errorMessage }}</div>
            <div v-if="successMessage" class="status status--success">{{ successMessage }}</div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { collection, addDoc, getDocs, deleteDoc, doc as firestoreDoc, updateDoc, query, orderBy } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebaseConfig'
import { ArrowUpDown, ChevronLeft, ChevronRight, Edit2, Trash2, UserPlus, X } from 'lucide-vue-next'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const tabs = [
  { id: 'guides', name: 'Tour Guides' },
  { id: 'marketing', name: 'Marketing & Sales' }
]

const activeTab = ref('guides')
const staff = ref([])
const filteredStaff = ref([])
const isPanelOpen = ref(false)
const isEditing = ref(false)
const panelMode = ref('add')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const itemsPerPage = ref(10)
const currentPage = ref(1)
const searchQuery = ref('')
const sortBy = ref('id')
const languages = ref(['English', 'Spanish', 'French', 'German', 'Italian', 'Chinese', 'Japanese'])

const currentStaff = ref({
  id: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  startDate: '',
  bio: '',
  languages: [],
  specialization: '',
  profilePhoto: null,
  isAdmin: false
})

const getTableHeaders = computed(() => {
  const commonHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'experience', label: 'Experience' }
  ]
  return commonHeaders
})

const getStaffDetails = computed(() => {
  const details = [
    { label: 'Full Name', value: `${currentStaff.value.firstName} ${currentStaff.value.lastName}` },
    { label: 'Email', value: currentStaff.value.email },
    { label: 'Phone', value: currentStaff.value.phone },
    { label: 'Experience', value: `${calculateExperience(currentStaff.value.startDate)} years` },
    { label: 'Languages', value: currentStaff.value.languages?.join(', ') || 'N/A' }
  ]

  if (activeTab.value === 'guides') {
    details.push({ label: 'Specialization', value: currentStaff.value.specialization || 'N/A' })
  }

  if (activeTab.value === 'marketing') {
    details.push({ label: 'Admin Status', value: currentStaff.value.isAdmin ? 'Admin' : 'Staff' })
  }

  return details
})

const totalPages = computed(() => Math.ceil(filteredStaff.value.length / itemsPerPage.value))

const paginatedStaff = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredStaff.value.slice(start, end)
})

const fetchStaff = async () => {
  try {
    const staffSnapshot = await getDocs(query(collection(db, 'staff')))
    staff.value = staffSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    updateFilteredStaff()
  } catch (error) {
    console.error('Error fetching staff:', error)
    errorMessage.value = 'Failed to load staff data'
  }
}

const updateFilteredStaff = () => {
  filteredStaff.value = staff.value
    .filter(s => 
      (activeTab.value === 'guides' ? s.role === 'guide' : s.role === 'marketing') &&
      (searchQuery.value === '' || 
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.value.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy.value === 'id') return a.id.localeCompare(b.id)
      if (sortBy.value === 'name') return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      if (sortBy.value === 'experience') return calculateExperience(b.startDate) - calculateExperience(a.startDate)
      return a[sortBy.value] > b[sortBy.value] ? 1 : -1
    })
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    try {
      const fileRef = storageRef(storage, `staff-photos/${Date.now()}-${file.name}`)
      const snapshot = await uploadBytes(fileRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      currentStaff.value.profilePhoto = downloadURL
    } catch (error) {
      console.error('Error uploading file:', error)
      errorMessage.value = 'Failed to upload profile photo'
    }
  }
}

const addNewStaff = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const staffData = {
      ...currentStaff.value,
      role: activeTab.value === 'guides' ? 'guide' : 'marketing',
      createdAt: new Date().toISOString()
    }
    
    const docRef = await addDoc(collection(db, 'staff'), staffData)
    staff.value.push({ ...staffData, id: docRef.id })
    
    successMessage.value = 'Staff member added successfully'
    updateFilteredStaff()
    setTimeout(() => closePanel(), 1500)
  } catch (error) {
    console.error('Error adding staff:', error)
    errorMessage.value = 'Failed to add staff member'
  } finally {
    loading.value = false
  }
}

const saveStaff = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const { id, ...staffData } = currentStaff.value
    await updateDoc(firestoreDoc(db, 'staff', id), staffData)
    
    const index = staff.value.findIndex(s => s.id === id)
    if (index !== -1) {
      staff.value[index] = currentStaff.value
    }
    
    successMessage.value = 'Staff member updated successfully'
    updateFilteredStaff()
    setTimeout(() => closePanel(), 1500)
  } catch (error) {
    console.error('Error updating staff:', error)
    errorMessage.value = 'Failed to update staff member'
  } finally {
    loading.value = false
  }
}

const deleteStaff = async (id) => {
  if (!confirm('Are you sure you want to delete this staff member?')) return

  try {
    await deleteDoc(firestoreDoc(db, 'staff', id))
    staff.value = staff.value.filter(s => s.id !== id)
    updateFilteredStaff()
  } catch (error) {
    console.error('Error deleting staff:', error)
    errorMessage.value = 'Failed to delete staff member'
  }
}

const openAddPanel = () => {
  panelMode.value = 'add'
  isEditing.value = false
  currentStaff.value = {
    id: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    startDate: '',
    bio: '',
    languages: [],
    specialization: '',
    profilePhoto: null,
    isAdmin: false
  }
  isPanelOpen.value = true
}

const openEditPanel = (staffMember) => {
  panelMode.value = 'edit'
  isEditing.value = true
  currentStaff.value = { ...staffMember }
  isPanelOpen.value = true
}

const showStaffProfile = (staffMember) => {
  panelMode.value = 'view'
  currentStaff.value = { ...staffMember }
  isPanelOpen.value = true
}

const closePanel = () => {
  isPanelOpen.value = false
  errorMessage.value = ''
  successMessage.value = ''
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const handleSearch = () => {
  updateFilteredStaff()
  currentPage.value = 1
}

const calculateExperience = (startDate) => {
  const start = new Date(startDate)
  const now = new Date()
  return Math.floor((now - start) / (365.25 * 24 * 60 * 60 * 1000))
}

const promoteToAdmin = async (staffMember) => {
  if (!confirm(`Are you sure you want to promote ${staffMember.firstName} ${staffMember.lastName} to admin?`)) return

  try {
    await updateDoc(firestoreDoc(db, 'staff', staffMember.id), { isAdmin: true })
    const index = staff.value.findIndex(s => s.id === staffMember.id)
    if (index !== -1) {
      staff.value[index].isAdmin = true
    }
    // Here you would typically call a backend API to handle the email sending
    // For demonstration, we'll just log a message
    console.log(`Email sent to ${staffMember.email} with admin account creation link`)
    alert(`${staffMember.firstName} ${staffMember.lastName} has been promoted to admin. An email has been sent to ${staffMember.email} with instructions to create their admin account.`)
  } catch (error) {
    console.error('Error promoting staff to admin:', error)
    errorMessage.value = 'Failed to promote staff to admin'
  }
}

const exportToPDF = () => {
  const doc = new jsPDF()
  
  doc.text(`${activeTab.value === 'guides' ? 'Tour Guides' : 'Marketing & Sales Staff'} Report`, 14, 15)
  
  const tableColumn = ["ID", "Name", "Phone", "Email", "Experience"]
  const tableRows = filteredStaff.value.map(staff => [
    staff.id,
    `${staff.firstName} ${staff.lastName}`,
    staff.phone,
    staff.email,
    `${calculateExperience(staff.startDate)} years`
  ])

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 20
  })

  doc.save(`${activeTab.value}_staff_report.pdf`)
}

watch([activeTab, searchQuery], () => {
  updateFilteredStaff()
  currentPage.value = 1
})

onMounted(fetchStaff)
</script>

<style scoped>
.button__icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.staff-details__bio {
  margin-top: 20px;
}

.staff-details__bio h3 {
  font-weight: 600;
  margin-bottom: 10px;
}

.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
}

.staff-management {
  font-family: Arial, sans-serif;
  color: #333;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20px;
}

.staff-management__container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.tabs__button {
  padding: 12px 20px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: color 0.3s, border-bottom 0.3s;
}

.tabs__button--active {
  color: #333;
  border-bottom: 2px solid #333;
}

.content {
  padding: 20px;
}

.content__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.content__title {
  font-size: 24px;
  font-weight: 600;
}

.content__actions {
  display: flex;
  gap: 10px;
}

.search {
  position: relative;
}

.search__input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button--primary {
  background-color: #333;
  color: #fff;
}

.button--primary:hover {
  background-color: #555;
}

.button--secondary {
  background-color: #e0e0e0;
  color: #333;
}

.button--secondary:hover {
  background-color: #ccc;
}

.button--danger {
  background-color: #ff4d4f;
  color: #fff;
}

.button--danger:hover {
  background-color: #ff7875;
}

.table-container {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.table__header {
  text-align: left;
  padding: 12px;
  background-color: #f5f5f5;
  font-weight: 600;
  border-bottom: 1px solid #e0e0e0;
}

.table__header-content {
  display: flex;
  align-items: center;
  gap: 5px;
}

.table__sort-icon {
  font-size: 12px;
}

.table__row {
  transition: background-color 0.3s;
}

.table__row:hover {
  background-color: #f9f9f9;
}

.table__cell {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.staff-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.staff-info__photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.staff-info__name {
  font-weight: 600;
}

.staff-info__email {
  font-size: 12px;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination__button {
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.pagination__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination__info {
  font-size: 14px;
}

.panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
}

.panel {
  width: 100%;
  max-width: 500px;
  background-color: #fff;
  height: 100%;
  overflow-y: auto;
}

.panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.panel__title {
  font-size: 20px;
  font-weight: 600;
}

.panel__close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.panel__content {
  padding: 20px;
}

.staff-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.staff-details__photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  align-self: center;
}

.staff-details__info {
  display: grid;
  gap: 10px;
}

.staff-details__item {
  display: flex;
  justify-content: space-between;
}

.staff-details__label {
  font-weight: 600;
}

.staff-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-label {
  font-weight: 600;
}

.form-input,
.form-select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 5px;
}

.form-file {
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.status {
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}

.status--loading {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status--error {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.status--success {
  background-color: #f6ffed;
  color: #52c41a;
}
</style>