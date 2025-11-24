<template>
  <aside :class="is_expanded && 'is_expanded'">
    <div class="menu">
      <router-link class="button" to="/home">
        <span class="material-icons">article</span>
        <span class="text">Summarize News</span>
      </router-link>
      <router-link class="button" to="/home/history">
        <span class="material-icons">history</span>
        <span class="text">Summary History</span>
      </router-link>
    </div>

    <div class="menu-bottom">
      <button class="sign-out" @click="showSignOutConfirmation">
        <span class="material-icons">logout</span>
        <span class="text">Sign Out</span>
      </button>
    </div>

    <!-- Sign Out Confirmation Modal -->
    <div v-if="showConfirmation" class="modal-overlay" @click="hideSignOutConfirmation">
      <div class="modal-content" @click.stop>
        <h3>Confirm Sign Out</h3>
        <p>Are you sure you want to sign out?</p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="hideSignOutConfirmation">Cancel</button>
          <button class="btn-primary" @click="handleSignOut">Sign Out</button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase.js'
import { signOut } from 'firebase/auth'

const router = useRouter()

// Define props to accept external state
const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['toggle'])

// Local state for expansion (for the arrow animation)
const is_expanded = ref(false)
const showConfirmation = ref(false)

// Watch for changes from parent component
watch(() => props.isOpen, (newVal) => {
  is_expanded.value = newVal
})

const ToggleMenu = () => {
  is_expanded.value = !is_expanded.value
  emit('toggle', is_expanded.value)
}

const showSignOutConfirmation = () => {
  showConfirmation.value = true
}

const hideSignOutConfirmation = () => {
  showConfirmation.value = false
}

const handleSignOut = async () => {
  try {
    await signOut(auth)
    router.push('/login')
    hideSignOutConfirmation()
  } catch (error) {
    console.error('Sign out error:', error)
    alert('Error signing out. Please try again.')
  }
}
</script>

<style lang="css" scoped>
aside {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Poppins', sans-serif;
  width: calc(3.5rem + 32px);
  min-height: calc(100vh - 60px);
  overflow: hidden;
  padding: 1rem;
  background-color: var(--grey);
  color: var(--primary);
  transition: 0.5s ease-out;
  position: fixed;
  left: 0;
  top: 60px;
  z-index: 97;
}

.menu {
  width: 100%;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.menu .button {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 1rem;
  transition: 0.2s ease-out;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
  justify-content: center;
}

.menu .button .material-icons {
  font-size: 2rem;
  color: var(--light);
  transition: 0.2s ease-out;
  min-width: 2rem;
  text-align: center;
}

.menu .button .text {
  color: var(--light);
  transition: 0.2s ease-out;
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.menu .button:hover {
  background-color: var(--light);
}

.menu .button:hover .material-icons,
.menu .button:hover .text {
  color: var(--grey);
}

.menu .button.router-link-active {
  background-color: var(--light);
}

.menu .button.router-link-active .material-icons,
.menu .button.router-link-active .text {
  color: var(--grey);
}

.menu-bottom {
  justify-content: center;
  width: 100%;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.menu-bottom .sign-out {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 1rem;
  transition: 0.2s ease-out;
  border-radius: 0.5rem;
  width: 100%;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-bottom .sign-out .material-icons {
  font-size: 2rem;
  color: var(--light);
  transition: 0.2s ease-out;
  min-width: 2rem;
  text-align: center;
}

.menu-bottom .sign-out .text {
  color: var(--light);
  transition: 0.2s ease-out;
  opacity: 0;
  width: 0;
  overflow: hidden;
  font-size: 1.1rem;
}

.menu-bottom .sign-out:hover {
  background-color: var(--light);
}

.menu-bottom .sign-out:hover .material-icons,
.menu-bottom .sign-out:hover .text {
  color: var(--grey);
}

aside.is_expanded {
  width: var(--sidebar-width);
  align-items: flex-start;
}

aside.is_expanded .menu {
  align-items: stretch;
}

aside.is_expanded .menu .button {
  justify-content: flex-start;
}

aside.is_expanded .menu .button .text {
  opacity: 1;
  width: auto;
  padding-left: 1rem;
}

aside.is_expanded .menu .button .material-icons {
  margin-right: 0;
}

aside.is_expanded .menu-bottom .sign-out {
  justify-content: flex-start;
}

aside.is_expanded .menu-bottom .sign-out .text {
  opacity: 1;
  width: auto;
  padding-left: 1rem;
}

aside.is_expanded .menu-bottom .sign-out .material-icons {
  margin-right: 0;
  margin-left: 0.4rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background-color: var(--light);
  padding: 2rem;
  border-radius: 1rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  margin: auto;
}

.modal-content h3 {
  color: var(--primary);
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.5rem;
}

.modal-content p {
  color: var(--primary);
  text-align: center;
  margin-bottom: 1.5rem;
  opacity: 0.8;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.btn-primary {
  background-color: var(--primary);
  color: var(--light);
}

.btn-primary:hover {
  background-color: var(--grey);
}

.btn-secondary {
  background-color: var(--light);
  color: var(--primary);
  border: 1px solid var(--grey);
}

.btn-secondary:hover {
  background-color: var(--grey);
  color: var(--light);
}

@media (max-width: 768px) {
  aside {
    position: fixed;
    width: 280px;
    top: 60px;
    height: calc(100vh - 60px);
    z-index: 97;
    transform: translateX(-100%);
    transition: transform 0.5s ease-out;
  }
  
  aside.is_expanded {
    transform: translateX(0);
  }
  
  .modal-overlay {
    padding: 1rem;
    align-items: center;
    justify-content: center;
  }

  .modal-content {
    margin: 0;
    width: 100%;
    max-width: none;
  }
}

@media (max-width: 480px) {
  aside {
    width: 100%;
  }
  
  .modal-content {
    margin: 0;
    padding: 1.5rem;
    width: 100%;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>