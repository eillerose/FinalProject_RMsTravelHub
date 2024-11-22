<template>
    <div class="tour-guides-page">
      <header-component />
      <div class="banner">
        <h1>Our Tour Guides</h1>
        <p>Discover the Philippines with our expert local guides</p>
      </div>
  
      <main class="main-content">
        <div class="guides-header">
          <h2>Guides for you!</h2>
          <button @click="toggleShowAllGuides" class="toggle-button">
            {{ showAllGuides ? 'Show Less' : 'See All Guides' }}
          </button>
        </div>
  
        <div class="guides-container">
          <div class="guides-grid">
            <div v-for="guide in displayedGuides" :key="guide.id" class="guide-card">
              <div class="guide-image-container">
                <img :src="guide.image" :alt="guide.name" class="guide-image">
              </div>
              <h3 class="guide-name">{{ guide.name }}</h3>
              <button @click="openGuideModal(guide)" class="view-profile-button">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Updated Modal Design -->
      <div v-if="selectedGuide" class="modal-overlay" @click="closeGuideModal">
        <div class="modal-content" @click.stop>
          <button @click="closeGuideModal" class="close-button">×</button>
          <div class="modal-layout">
            <div class="modal-image-container">
              <img :src="selectedGuide.image" :alt="selectedGuide.name" class="modal-guide-image">
            </div>
            <div class="modal-info">
              <h2 class="modal-name">{{ selectedGuide.name }}</h2>
              <div class="info-item">
                <span class="material-icons">language</span>
                <span>Languages : {{ selectedGuide.languages.join("/") }}</span>
              </div>
              <div class="info-item">
                <span class="material-icons">star</span>
                <span>Experience : {{ selectedGuide.experience }} years</span>
              </div>
              <button class="book-guide-button">Book This Guide</button>
            </div>
          </div>
        </div>
      </div>
      <footer-component />
    </div>
  </template>
  
  <script>
  import HeaderComponent from './Header.vue';
  import FooterComponent from './Footer.vue';
  
  export default {
    components: {
      HeaderComponent,
      FooterComponent,
    },
    data() {
      return {
        showAllGuides: false,
        selectedGuide: null,
        tourGuides: [
          {
            id: 1,
            name: "Alan Marasigan",
            image: "/src/img/tg1.jpg",
            languages: ["English", "Filipino"],
            experience: 5
          },
          {
            id: 2,
            name: "Angel Mhay Manzano",
            image: "/src/img/tg2.jpg",
            languages: ["English", "Cebuano"],
            experience: 4
          },
          {
            id: 3,
            name: "Arcmay Manzano",
            image: "/src/img/tg1.jpg",
            languages: ["English", "Filipino"],
            experience: 6
          },
          {
            id: 4,
            name: "Jerry Evangelista Tupas",
            image: "/src/img/tg2.jpg",
            languages: ["English", "Visayan"],
            experience: 7
          },
          {
            id: 5,
            name: "Jhedca Peñas",
            image: "/src/img/tg1.jpg",
            languages: ["English", "Filipino"],
            experience: 3
          },
          {
            id: 6,
            name: "Jocelyn Tupas",
            image: "/src/img/tg2.jpg",
            languages: ["English", "Hiligaynon"],
            experience: 6
          },
          {
            id: 7,
            name: "Jojo Pollo",
            image: "/src/img/tg1.jpg",
            languages: ["English", "Cebuano"],
            experience: 5
          },
          {
            id: 8,
            name: "Joshu Cataquis",
            image: "/src/img/tg2.jpg",
            languages: ["English", "Filipino"],
            experience: 4
          },
          {
            id: 9,
            name: "Madilyn Atienza Sonco",
            image: "/src/img/tg1.jpg",
            languages: ["English", "Ilocano"],
            experience: 8
          },
          {
            id: 10,
            name: "Marvin Atienza",
            image: "/src/img/tg2.jpg",
            languages: ["English", "Tagalog"],
            experience: 6
          },
          {
            id: 11,
            name: "Nhichie Caguete",
            image: "/src/img/tg1.jpg",
            languages: ["English", "Ilocano"],
            experience: 5
          },
          {
            id: 12,
            name: "Rizalie Lope Tupas",
            image: "/src/img/tg2.jpg",
            languages: ["English", "Filipino"],
            experience: 7
          },
          {
            id: 13,
            name: "Ronnil Saren",
            image: "/src/img/tg1.jpg",
            languages: ["English", "Cebuano"],
            experience: 5
          },
          {
            id: 14,
            name: "Ryan Evangelista Magbuhos",
            image: "/src/img/tg2.jpg",
            languages: ["English", "Cebuano"],
            experience: 6
          }
        ]
      };
    },
    computed: {
      displayedGuides() {
        return this.showAllGuides ? this.tourGuides : this.tourGuides.slice(0, 4);
      }
    },
    methods: {
      toggleShowAllGuides() {
        this.showAllGuides = !this.showAllGuides;
      },
      openGuideModal(guide) {
        this.selectedGuide = guide;
      },
      closeGuideModal() {
        this.selectedGuide = null;
      }
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  
  .tour-guides-page {
    font-family: 'Poppins', sans-serif;
    color: #333;
    line-height: 1.6;
    background-color: #f5f5f5;
  }
  
  .banner {
    width: 100%;
    background-image: url('/src/img/heroBg.jpg');
    background-size: cover;
    background-position: center;
    text-align: center;
    color: #fff;
    padding: 0 20px;
    height: 25vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 2rem;
}

.banner h1 {
    font-size: 4rem;
    margin-bottom: 1rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.banner p {
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 1rem;
    color: white;
}
  
  .main-content {
    max-width: 1500px;
    margin: auto;
    margin-bottom: 6rem;

  }
  
  .guides-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }
  
  .guides-header h2 {
    font-size: 3rem;
    font-weight: 600;
  }
  
  .toggle-button {
    background-color: #98b634;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 6px;
    transition: background-color 0.3s;
  }
  
  .toggle-button:hover {
    background-color: #859e2d;
  }
  
  .guides-container {
    margin: 0 auto;
    max-width: 1500px;
    background-color: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: -2rem;
  }
  
  .guides-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 4rem;
  }
  
  .guide-card {
    background-color: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
  }
  
  .guide-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .guide-image-container {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }
  
  .guide-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .guide-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #2c3e50;
  }
  
  .view-profile-button {
    width: 100%;
    max-width: 200px;
    padding: 0.75rem;
    background-color: #98b634;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .view-profile-button:hover {
    background-color: #859e2d;
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
  z-index: 1000;
}

.modal-content {
  background-color: #f5f5f5;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  position: relative;
  padding: 1.5rem;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  z-index: 2;
}

.modal-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.modal-image-container {
  flex-shrink: 0;
}

.modal-guide-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.modal-info {
  flex-grow: 1;
}

.modal-name {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #666;
}

.info-item .material-icons {
  font-size: 1.25rem;
}

.book-guide-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #98b634;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1.5rem;
}

.book-guide-button:hover {
  background-color: #859e2d;
}

  
  @media (max-width: 768px) {
    .banner h1 {
      font-size: 2.5rem;
    }
  
    .guides-header {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .toggle-button {
      margin-top: 1rem;
    }
  
    .guides-grid {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.5rem;
    }
  
    .guide-image-container {
      width: 100px;
      height: 100px;
    }

    .modal-layout {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .modal-name {
    font-size: 1.75rem;
  }

  .info-item {
    justify-content: center;
  }
  }
  </style>