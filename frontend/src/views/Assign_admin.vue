<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold text-gray-900">Assign Tour Guides</h1>
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-6">
        <form @submit.prevent="assignGuide" class="space-y-4">
          <div>
            <label for="tour" class="block text-sm font-medium text-gray-700">Select Tour</label>
            <select id="tour" v-model="selectedTour" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              <option value="">Select a tour</option>
              <option v-for="tour in tours" :key="tour.id" :value="tour.id">{{ tour.name }} - {{ formatDate(tour.date) }}</option>
            </select>
          </div>
          <div>
            <label for="guide" class="block text-sm font-medium text-gray-700">Select Tour Guide</label>
            <select id="guide" v-model="selectedGuide" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              <option value="">Select a guide</option>
              <option v-for="guide in guides" :key="guide.id" :value="guide.id">{{ guide.name }}</option>
            </select>
          </div>
          <button type="submit" class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
            Assign Guide
          </button>
        </form>
      </div>
    </div>
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Current Assignments</h2>
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 font-semibold text-sm text-gray-600">Tour</th>
              <th class="text-left py-3 px-4 font-semibold text-sm text-gray-600">Date</th>
              <th class="text-left py-3 px-4 font-semibold text-sm text-gray-600">Guide</th>
              <th class="text-left py-3 px-4 font-semibold text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr  v-for="assignment in assignments" :key="assignment.id" class="border-b border-gray-200">
              <td class="py-4 px-4 text-sm">{{ assignment.tourName }}</td>
              <td class="py-4 px-4 text-sm">{{ formatDate(assignment.tourDate) }}</td>
              <td class="py-4 px-4 text-sm">{{ assignment.guideName }}</td>
              <td class="py-4 px-4 text-sm">
                <button @click="removeAssignment(assignment.id)" class="text-red-600 hover:text-red-800">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { db } from '../firebaseConfig'
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore'

export default {
  name: 'Assign',
  setup() {
    const tours = ref([])
    const guides = ref([])
    const assignments = ref([])
    const selectedTour = ref('')
    const selectedGuide = ref('')

    const fetchTours = async () => {
      const querySnapshot = await getDocs(collection(db, 'tours'))
      tours.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }

    const fetchGuides = async () => {
      const querySnapshot = await getDocs(collection(db, 'guides'))
      guides.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }

    const fetchAssignments = async () => {
      const querySnapshot = await getDocs(collection(db, 'assignments'))
      assignments.value = await Promise.all(querySnapshot.docs.map(async doc => {
        const assignment = doc.data()
        const tourDoc = await getDoc(doc(db, 'tours', assignment.tourId))
        const guideDoc = await getDoc(doc(db, 'guides', assignment.guideId))
        return {
          id: doc.id,
          tourName: tourDoc.data().name,
          tourDate: tourDoc.data().date,
          guideName: guideDoc.data().name,
          ...assignment
        }
      }))
    }

    const assignGuide = async () => {
      await addDoc(collection(db, 'assignments'), {
        tourId: selectedTour.value,
        guideId: selectedGuide.value
      })
      await fetchAssignments()
      selectedTour.value = ''
      selectedGuide.value = ''
    }

    const removeAssignment = async (id) => {
      await deleteDoc(doc(db, 'assignments', id))
      await fetchAssignments()
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString()
    }

    onMounted(() => {
      fetchTours()
      fetchGuides()
      fetchAssignments()
    })

    return {
      tours,
      guides,
      assignments,
      selectedTour,
      selectedGuide,
      assignGuide,
      removeAssignment,
      formatDate
    }
  }
}
</script>