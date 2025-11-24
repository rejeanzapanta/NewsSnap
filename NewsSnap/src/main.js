import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Import layouts
import UserLayout from '@/layouts/UserLayout.vue'

// Firebase initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdtvv54RkzgKYKeRgF-dT1Q54yL2GEwB8",
  authDomain: "news-snap-1874d.firebaseapp.com",
  projectId: "news-snap-1874d",
  storageBucket: "news-snap-1874d.firebasestorage.app",
  messagingSenderId: "431384654165",
  appId: "1:431384654165:web:f1b2b3b7b47a28cfe6bfdc",
  measurementId: "G-22E4PHHC2M"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(appFirebase);
export const db = getFirestore(appFirebase);
export const auth = getAuth(appFirebase);
export const storage = getStorage(appFirebase);

// Router configuration
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // Auth routes (no layout)
    {
      path: '/',
      name: 'Landing',
      component: () => import('@/views/Landing.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/Register.vue')
    },
    
    // Protected routes with UserLayout
    {
      path: '/home',
      component: UserLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/Home.vue')
        },
        {
          path: 'history',
          name: 'History',
          component: () => import('@/views/History.vue')
        }
      ]
    }
  ]
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const currentUser = auth.currentUser

  if (requiresAuth && !currentUser) {
    next('/login')
  } else {
    next()
  }
})

// Create and mount Vue app
const app = createApp(App)
app.use(router)
app.mount('#app')