<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup>
// No need for layout logic here anymore - it's handled by individual layouts
</script>

<style lang="css">
/* Import fonts */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

:root {
  --primary: #000000;
  --grey: #771b1b;
  --dark: #000000;
  --dark-alt: #666666;
  --light: #e5ded5;
  --sidebar-width: 230px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  scrollbar-width: thin;
  scrollbar-color: #1B1717 #f0f0f0; 
}

body {
  background: var(--light);
  font-family: 'Poppins', sans-serif;
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}

.app {
  min-height: 100vh;
}
</style>
