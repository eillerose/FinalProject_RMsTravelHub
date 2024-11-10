<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold text-gray-900">Guest Management</h1>
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-6 flex justify-between items-center border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-700">Guest List</h2>
        <button @click="openModal" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          + Add Guest
        </button>
      </div>
      <div class="p-6">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-sm text-gray-600">Name</th>
              <th class="text-left py-3 px-4 font-semibold text-sm text-gray-600">Email</th>
              <th class="text-left py-3 px-4 font-semibold text-sm text-gray-600">Phone</th>
              <th class="text-left py-3 px-4 font-semibold text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guest in guests" :key="guest.id" class="border-b border-gray-200">
              <td class="py-4 px-4 text-sm">{{ guest.name }}</td>
              <td class="py-4 px-4 text-sm">{{ guest.email }}</td>
              <td class="py-4 px-4 text-sm">{{ guest.phone }}</td>
              <td class="py-4 px-4 text-sm">
                <button @click="editGuest(guest)" class="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                <button @click="deleteGuest(guest.id)" class="text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for adding/editing guests -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">{{ editingGuest ? 'Edit Guest' : 'Add New Guest' }}</h3>
        <form @submit.prevent="saveGuest">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" v-model="currentGuest.name" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" v-model="currentGuest.email" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" id="phone" v-model="currentGuest.phone" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <button type="button" @click="closeModal" class="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { db } from '../firebaseConfig'
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export default {
  name: 'Guest',
  setup() {
    const guests = ref([])
    const isModalOpen = ref(false)
    const editingGuest = ref(null)
    const currentGuest = ref({ name: '', email: '', phone: '' })

    const fetchGuests = async () => {
      const querySnapshot = await getDocs(collection(db, 'guests'))
      guests.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }

    const openModal = (guest = null) => {
      editingGuest.value = guest
      if (guest) {
        currentGuest.value = { ...guest }
      } else {
        currentGuest.value = { name: '', email: '', phone: '' }
      }
      isModalOpen.value = true
    }

    const closeModal = () => {
      isModalOpen.value = false
      editingGuest.value = null
    }

    const saveGuest = async () => {
      if (editingGuest.value) {
        await updateDoc(doc(db, 'guests', editingGuest.value.id), currentGuest.value)
      } else {
        await addDoc(collection(db, 'guests'), currentGuest.value)
      }
      await fetchGuests()
      closeModal()
    }

    const deleteGuest = async (id) => {
      await deleteDoc(doc(db, 'guests', id))
      await fetchGuests()
    }

    onMounted(fetchGuests)

    return {
      guests,
      isModalOpen,
      editingGuest,
      currentGuest,
      openModal,
      closeModal,
      saveGuest,
      deleteGuest
    }
  }
}
</script>