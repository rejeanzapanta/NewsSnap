<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="navbar-left">
        <div class="logo-container">
          <img src="../assets/CommuniTrade.png" alt="News Snap Logo" class="logo-img">
          <p class="logo-text">News <span class="logo-text1">Snap</span></p>
        </div>
      </div>
      
      <div class="navbar-right">
        <button class="about-btn" @click="navigateToAbout">
          About News Snap
        </button>
        <button class="hamburger-btn" @click="toggleSidebar">
          <span class="material-icons">menu</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  toggleSidebar: Function
})

const navigateToAbout = () => {
  router.push('/')
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--grey);
  color: var(--light);
  z-index: 98;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 0 !important;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 1rem;
  max-width: 100% !important; 
  margin: 0 !important;
}

.navbar-left {
  display: flex;
  align-items: center;
  margin-left: 0 !important;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 0 !important;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-img {
  width: 45px;
  height: 45px;
  object-fit: contain;
  margin-left: 0.3rem;
}

.logo-text1 {
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--light);
}

.logo-text {
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--primary);
}

.about-btn {
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid var(--light);
  border-radius: 4px;
  color: var(--light);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.about-btn:hover {
  background-color: var(--light);
  color: var(--grey);
}

.hamburger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: var(--light);
}

.hamburger-btn:hover {
  color: var(--primary);
  transform: rotate(180deg);
}

/* Adjust font size for very small screens */
@media (max-width: 480px) {
  .logo-text {
    font-size: 1rem;
  }
  
  .logo-img {
    width: 35px;
    height: 35px;
  }
  
  .about-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 360px) {
  .logo-text {
    font-size: 0.9rem;
  }
  
  .about-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.7rem;
  }
}
</style>