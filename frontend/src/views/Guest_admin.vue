<template>
   <h1 class="section-title">User Management</h1>
  <div class="user-management">
    <div class="user-list-container">
      <div class="user-table-container">
        <table>
          <thead>
            <tr>
              <th colspan="6">
                <div class="table-header">
                  <div class="view-toggle">
                    <button 
                      @click="currentView = 'active'" 
                      :class="{ active: currentView === 'active' }"
                    >
                      Active Users
                    </button>
                    <button 
                      @click="currentView = 'deleted'" 
                      :class="{ active: currentView === 'deleted' }"
                    >
                      Deleted Users
                    </button>
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <th>Profile</th>
              <th>Name</th>
              <th>Username</th>
              <th>Contact Information</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in currentUsers" :key="user.id">
              <td class="profile-cell">
                <img 
                  :src="user.profileImageUrl || '/default-avatar.png'" 
                  :alt="user.firstName"
                  class="profile-image"
                >
              </td>
              <td>
                <div class="user-name">{{ user.firstName }} {{ user.lastName }}</div>
                <div class="user-bio">{{ user.bio }}</div>
              </td>
              <td>{{ user.username }}</td>
              <td>
                <div>{{ user.email }}</div>
                <div>{{ user.phoneNumber }}</div>
                <div class="user-address">{{ user.address }}</div>
              </td>
              <td>
                <span v-if="currentView === 'active'" :class="['status-badge', user.verified ? 'verified' : 'unverified']">
                  {{ user.verified ? 'Verified' : 'Unverified' }}
                </span>
                <span v-else class="status-badge deleted">Deleted</span>
              </td>
              <td>
                <div class="action-icons">
                  <template v-if="currentView === 'active'">
                    <i class="material-icons edit-icon" @click="editUser(user)" title="Edit User">edit</i>
                    <i class="material-icons verify-icon" @click="toggleVerification(user)" :title="user.verified ? 'Unverify User' : 'Verify User'">
                      {{ user.verified ? 'verified_user' : 'gpp_maybe' }}
                    </i>
                    <i class="material-icons delete-icon" @click="confirmDeleteUser(user)" title="Delete User">delete</i>
                  </template>
                  <template v-else>
                    <i class="material-icons restore-icon" @click="restoreUser(user)" title="Restore User">restore</i>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal">
        <h3>Edit User Profile</h3>
        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" v-model="currentUser.firstName" required>
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" v-model="currentUser.lastName" required>
          </div>
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" v-model="currentUser.username" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="currentUser.email" required>
          </div>
          <div class="form-group">
            <label for="phoneNumber">Phone Number</label>
            <input type="tel" id="phoneNumber" v-model="currentUser.phoneNumber" required>
          </div>
          <div class="form-group">
            <label for="address">Address</label>
            <input type="text" id="address" v-model="currentUser.address" required>
          </div>
          <div class="form-group">
            <label for="bio">Bio</label>
            <textarea id="bio" v-model="currentUser.bio" rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="isDeleteModalOpen" class="modal-overlay">
      <div class="modal">
        <h3>Confirm Delete</h3>
        <p>Are you sure you want to delete the account for {{ userToDelete?.firstName }} {{ userToDelete?.lastName }}?</p>
        <p class="warning">This action will move the user to the deleted users table.</p>
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="cancel-btn">Cancel</button>
          <button @click="deleteUser" class="delete-btn">Delete Account</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'

export default {
  name: 'UserManagement',
  setup() {
    const activeUsers = ref([])
    const deletedUsers = ref([])
    const currentView = ref('active')
    const isModalOpen = ref(false)
    const isDeleteModalOpen = ref(false)
    const currentUser = ref(null)
    const userToDelete = ref(null)

    const fetchUsers = async () => {
      try {
        const activeUsersSnapshot = await getDocs(collection(db, 'users'))
        activeUsers.value = activeUsersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        const deletedUsersSnapshot = await getDocs(collection(db, 'deletedUsers'))
        deletedUsers.value = deletedUsersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const currentUsers = computed(() => {
      return currentView.value === 'active' ? activeUsers.value : deletedUsers.value
    })

    const editUser = (user) => {
      currentUser.value = { ...user }
      isModalOpen.value = true
    }

    const closeModal = () => {
      isModalOpen.value = false
      currentUser.value = null
    }

    const saveUser = async () => {
      try {
        const userRef = doc(db, 'users', currentUser.value.id)
        await setDoc(userRef, currentUser.value, { merge: true })
        await fetchUsers()
        closeModal()
      } catch (error) {
        console.error('Error updating user:', error)
      }
    }

    const toggleVerification = async (user) => {
      try {
        const userRef = doc(db, 'users', user.id)
        await setDoc(userRef, { verified: !user.verified }, { merge: true })
        await fetchUsers()
      } catch (error) {
        console.error('Error toggling verification:', error)
      }
    }

    const confirmDeleteUser = (user) => {
      userToDelete.value = user
      isDeleteModalOpen.value = true
    }

    const closeDeleteModal = () => {
      isDeleteModalOpen.value = false
      userToDelete.value = null
    }

    const deleteUser = async () => {
      try {
        // Remove from active users
        await deleteDoc(doc(db, 'users', userToDelete.value.id))
        
        // Add to deleted users
        await setDoc(doc(db, 'deletedUsers', userToDelete.value.id), userToDelete.value)
        
        await fetchUsers()
        closeDeleteModal()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }

    const restoreUser = async (user) => {
      try {
        // Remove from deleted users
        await deleteDoc(doc(db, 'deletedUsers', user.id))
        
        // Add back to active users
        await setDoc(doc(db, 'users', user.id), user)
        
        await fetchUsers()
      } catch (error) {
        console.error('Error restoring user:', error)
      }
    }

    onMounted(fetchUsers)

    return {
      currentUsers,
      currentView,
      isModalOpen,
      isDeleteModalOpen,
      currentUser,
      userToDelete,
      editUser,
      closeModal,
      saveUser,
      toggleVerification,
      confirmDeleteUser,
      closeDeleteModal,
      deleteUser,
      restoreUser
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.user-management {
  padding: 20px;
  max-width: 1500px;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
}

.view-toggle {
  display: flex;
  gap: 10px;
}

.view-toggle button {
  font-family: 'Poppins', sans-serif;
  padding: 10px 20px;
  border: none;
  background-color: white;
  color: #333;
  cursor: pointer;
  transition: border-bottom 0.3s, font-weight 0.3s, color 0.3s;
  border-bottom: 2px solid transparent;
  font-weight: normal;
}

.view-toggle button.active {
  border-bottom: 2px solid #0a8d88;
  color: #1976d2;
  font-weight: bold;
}

.view-toggle button:hover:not(.active) {
  border-bottom: 2px solid #e0e0e0;
}

.user-list-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-list-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.user-table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.profile-cell {
  width: 60px;
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  margin-bottom: 4px;
}

.user-bio {
  font-size: 14px;
  color: #666;
}

.user-address {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
}

.verified {
  background-color: #e3f2fd;
  color: #1976d2;
}

.unverified {
  background-color: #ffeaea;
  color: #d32f2f;
}

.deleted {
  background-color: #ffebee;
  color: #b71c1c;
}

.action-icons {
  display: flex;
  gap: 12px;
}

.material-icons {
  cursor: pointer;
  font-size: 20px;
  transition: color 0.3s ease;
}

.edit-icon {
  color: #1976d2;
}

.edit-icon:hover {
  color: #1565c0;
}

.verify-icon {
  color: #4caf50;
}

.verify-icon:hover {
  color: #43a047;
}

.delete-icon {
  color: #d32f2f;
}

.delete-icon:hover {
  color: #c62828;
}

.restore-icon {
  color: #ff9800;
}

.restore-icon:hover {
  color: #f57c00;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 16px;
}

h3{
  margin-top: 1rem;
  font-size: 2rem;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input, textarea {
  font-family: 'Poppins', sans-serif;
  width: 95%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

textarea {
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn, .save-btn, .delete-btn {
  font-family: 'Poppins', sans-serif;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-btn {
  background-color: red;
  color: white;
}

.save-btn {
  background-color: #0a8d88;
  color: white;
}

.delete-btn {
  background-color: #d32f2f;
  color: white;
}


.warning {
  color: #ff9800;
  font-weight: 500;
  margin-top: 8px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.table-header h2 {
  margin: 0;
}

@media (max-width: 768px) {
  .user-management {
    padding: 10px;
  }

  th, td {
    padding: 10px;
  }

  .modal {
    margin: 10px;
    padding: 16px;
  }
}
</style>

