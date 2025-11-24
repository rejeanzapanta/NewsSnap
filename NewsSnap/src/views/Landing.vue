<template>
  <div class="landing-page">
    <nav class="navbar">
      <div class="navbar-content">
        <div class="navbar-left">
          <div class="logo-container">
            <img src="../assets/CommuniTrade.png" alt="News Snap Logo" class="logo-img">
            <p class="logo-text">News<span class="logo-text1"> Snap</span></p>
          </div>
          
          <div class="nav-links">
            <a href="#home" class="nav-link">Home</a>
            <a href="#services" class="nav-link">Services</a>
            <a href="#guide" class="nav-link">Guide</a>
            <a href="#footer" class="nav-link">Contact Us</a>
          </div>
        </div>
        
        <div class="navbar-right">
          <button class="login-btn" @click="navigateToLogin">Login</button>
          <button class="mobile-menu-btn" @click="toggleSidebar">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>

    <div class="sidebar-overlay" :class="{ active: sidebarOpen }" @click="closeSidebar"></div>
    <div class="sidebar" :class="{ active: sidebarOpen }">
      <div class="sidebar-header">
        <div class="logo-container">
          <img src="../assets/CommuniTrade.png" alt="News Snap Logo" class="logo-img">
          <p class="logo-text">News<span class="logo-text1">Snap</span></p>
        </div>
      </div>
      <div class="sidebar-links">
        <a href="#home" class="sidebar-link" @click="closeSidebar">Home</a>
        <a href="#services" class="sidebar-link" @click="closeSidebar">Services</a>
        <a href="#guide" class="sidebar-link" @click="closeSidebar">Guide</a>
        <a href="#footer" class="sidebar-link" @click="closeSidebar">Contact Us</a>
        <a href="#/login" class="sidebar-link login-sidebar" @click="closeSidebar">Login</a>
      </div>
    </div>
    
    <section id="home" class="hero-section">
      <div class="hero-content">
        <div class="hero-container">
          <h1 class="hero-title">Welcome to  <br /> <span class="highlight">News Snap</span></h1>
          <p class="hero-subtitle">Your smart tool for quick and easy news understanding. The AI News Summarizer lets you input any article or text and instantly get a clear, concise summary powered by AI. Stay informed in less time and keep up with the latest news without reading lengthy articles.</p>
          <div class="hero-buttons">
            <a href="#services" class="cta-button primary" @click.prevent="scrollToServices">Learn More</a>
            <a href="#/register" class="cta-button secondary">Get Started</a>
          </div>
        </div>
      </div>
      <div class="hero-image">
        <div class="image-container">
          <img src="../assets/picture.png" alt="News Snap Illustration" class="hero-img">
          <p class="image-quote">A <span class="design">Smarter</span> Way <br> to Stay <span class="design">Informed</span> Instantly</p>
        </div>
      </div>
    </section>
    
    <section id="services" class="services-section">
      <div class="container2">
        <h2 class="section-title">Our Services</h2>
        <p class="section-subtitle">News Snap offers smart summaries to help you understand the latest news faster and easier.</p>
        
        <div class="services-grid">
          <div class="flip-card">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <div class="service-icon">
                  <i class="fa-solid fa-sliders"></i>
                </div>
                <h3>Summary Length Options</h3>
              </div>
              <div class="flip-card-back">
                <h3>Summary Length Options</h3>
                <p>Choose how detailed you want your summary to be, whether short for quick reads or longer for deeper insights, giving you full control over your news experience.</p>
              </div>
            </div>
          </div>
          
          <div class="flip-card">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <div class="service-icon">
                  <i class="fa-solid fa-link"></i>
                </div>
                <h3>Paste Link or Text</h3>
              </div>
              <div class="flip-card-back">
                <h3>Paste Link or Text</h3>
                <p>Simply paste a news link or any block of text, and News Snap will instantly generate a smart summary tailored for quick understanding.</p>
              </div>
            </div>
          </div>
          
          <div class="flip-card">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <div class="service-icon">
                  <i class="fa-solid fa-file-arrow-down"></i>
                </div>
                <h3>Copy & Download Summary</h3>
              </div>
              <div class="flip-card-back">
                <h3>Copy & Download Summary</h3>
                <p>Easily copy your AI-generated summary or download it as a PDF with just one click, making it convenient to save or share key information anytime.</p>
              </div>
            </div>
          </div>
          
          <div class="flip-card">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <div class="service-icon">
                  <i class="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <h3>Clean Display</h3>
              </div>
              <div class="flip-card-back">
                <h3>Clean Display</h3>
                <p>Enjoy a distraction-free reading experience with our clean and organized display, making every summary easy to read and visually clear.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="guide" class="guide-section">
      <div class="container">
        <h2 class="section-title1">How It Works</h2>
        <p class="section-subtitle1">Begin your News Snap experience with ease</p>
        
        <div class="steps-container">
          <div class="steps-column">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>Paste Link or Text</h3>
                <p>Simply paste a news link or any block of text, and News Snap will instantly generate a smart summary designed for easy and fast comprehension.</p>
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>Adjust Summary Length</h3>
                <p>Choose your preferred summary length, either concise for quick reading or detailed for deeper understanding and better information retention.</p>
              </div>
            </div>
          </div>
          
          <div class="steps-column">
            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>Copy or Download Summary</h3>
                <p>Easily copy your AI-generated summary or download it as a PDF file to save, share, and access anytime, anywhere with complete convenience.</p>
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3>Enjoy a Clean Display</h3>
                <p>Experience a distraction-free and visually clean layout that makes reading your summaries simple, clear, and effortlessly enjoyable.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="cta-section">
      <div class="container">
        <h2>Ready to Simplify Your News?</h2>
        <p>Start summarizing and staying informed in seconds with AI-powered insights</p>
        <a href="#/register" class="cta-button large">Register Now</a>
      </div>
    </section>
    
    <footer id="footer" class="footer">
      <div class="container3">
        <div class="footer-content">
          <div class="footer-section">
            <div class="logo-container3">
              <img src="../assets/CommuniTrade.png" alt="News Snap Logo" class="logo-img3">
              <div class="design1">
                <p class="logo-text3">News <span class="logo-text4">Snap</span></p>
              </div>
            </div>
            <p style="margin-left: 1rem;">Making it easier to stay informed through smart AI summaries.</p>
          </div>
          
          <div class="footer-section1">
            <h3>Contact Us</h3>
            <p><i class="fas fa-envelope"></i> NewsSnap@gmail.com</p>
            <p><i class="fas fa-phone"></i> 0912-345-6789</p>
          </div>
          
          <div class="footer-section2">
            <h3>Follow Us</h3>
            <div class="social-links">
              <a href="#"><i class="fab fa-facebook"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>© 2025 News Snap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Landing',
  data() {
    return {
      sidebarOpen: false
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    closeSidebar() {
      this.sidebarOpen = false;
    },
    navigateToLogin() {
      this.$router.push({ name: 'Login' });
    },
    scrollToServices() {
      const section = document.querySelector('#services');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
  mounted() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
      link.addEventListener('click', function(e) {
        if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 70,
              behavior: 'smooth'
            });
          }
        }
      });
    });
    
    // Add click event for mobile devices to ensure flip works on touch devices
    document.querySelectorAll('.flip-card').forEach(card => {
      card.addEventListener('touchstart', function() {
        if (window.innerWidth < 768) {
          this.classList.toggle('flipped');
        }
      });
    });
  }
};
</script>

<style scoped>
.landing-page {
  font-family: 'Poppins', sans-serif;
}

html {
  scroll-behavior: smooth;
  margin-top: 60px;
}

#services {
  scroll-margin-top: 70px; 
  margin-top: 50px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: #e4e3df;
  color: var(--primary);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: rgba(129, 0, 0, 0.9);
  z-index: 1000;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  padding: 0 2rem;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 15rem;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.logo-text {
  font-weight: 700;
  font-size: 1.5rem;
  color: white;
}

.logo-text1 {
  font-weight: 700;
  color: #ffffff;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #f0f0f0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #f0f0f0;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.login-btn {
  background-color: transparent;
  color: white;
  border: 1px solid white;
  padding: 0.6rem 1.5rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-btn:hover {
  background-color: white;
  color: #810000;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 25px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 15px;
}

.mobile-menu-btn span {
  width: 100%;
  height: 3px;
  background-color: white;
  border-radius: 5px;
  transition: all 0.3s ease;
}

/* Sidebar */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.sidebar-overlay.active {
  opacity: 1;
  visibility: visible;
}

.sidebar {
  position: fixed;
  top: 0;
  left: -300px;
  width: 300px;
  height: 100%;
  background-color: #810000;
  z-index: 1000;
  transition: left 0.3s ease;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.active {
  left: 0;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.sidebar-link {
  color: #ffffff;
  text-decoration: none;
  padding: 0.8rem 1.2rem;
  font-weight: 500;
  display: block;
  border-radius: 8px;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 0.5rem;
}

.sidebar-link:hover {
  color: #810000;
  background: white;
  transform: translateX(5px);
}

.login-sidebar {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 4rem 2rem;
  background-color: #ffffff;
  margin-top: 70px;
}

.hero-content {
  flex: 1;
}

.hero-container {
  padding: 0 2rem;
  max-width: 1200px;
  margin: -10px auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #810000;
  text-align: center;
}

.highlight {
  color: #000000;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  color: #000000;
  line-height: 1.8;
  max-width: 100%;
  text-align: justify;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.hero-image {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.image-container {
  position: relative;
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  background: 
    linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(245, 245, 245, 0.9)) padding-box,
    linear-gradient(135deg, #1B1717, #810000) border-box;
  border: 3px solid transparent;
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12), 
              0 4px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.image-container:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.15), 
              0 6px 12px rgba(0, 0, 0, 0.08);
  background: 
    linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(245, 245, 245, 0.9)) padding-box,
    linear-gradient(135deg, #810000, #3A2C2C) border-box;
}

.hero-img {
  width: 100%;
  max-width: 600px;
  height: auto;
  object-fit: contain;
}

.image-quote {
  margin-top: 1.5rem;
  font-size: 2rem;
  color: #000000;
  text-align: center;
  font-weight: 500;
  max-width: 90%;
  line-height: 1.3;
}

.cta-button {
  padding: 1rem 2rem;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  text-decoration: none;
  outline: none;
  display: inline-block;
}

.cta-button.primary {
  background: linear-gradient(135deg, #3a0000, #ff1a1a);
  color: #EEEEEE;
  padding: 0.8rem 1.6rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(18, 23, 49, 0.25);
}

.cta-button.primary:hover {
  background: linear-gradient(135deg, #800000, #ff6666);
  color: #EEEEEE;
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(90, 0, 0, 0.4);
}

.cta-button.secondary {
  background: transparent;
  color: #810000;
  border: 2px solid #810000;
  padding: 0.8rem 1.6rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button.secondary:hover {
  background: #810000;
  color: white;
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(129, 0, 0, 0.3);
}

.design {
  color: #810000;
  font-style: italic;
}

/* Services Section */
.container2 {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1px;
}

.services-section {
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 67px;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #810000;
  letter-spacing: 0.5px;
}

.section-subtitle {
  text-align: center;
  font-size: 1.2rem;
  color: #000000;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
  font-weight: 400;
}

/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 0 20px;
}

/* Flip Card Container */
.flip-card {
  background-color: transparent;
  width: 100%;
  height: 280px;
  perspective: 1000px;
  border-radius: 15px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.6s;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* Flip Card Inner */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  border-radius: 15px;
}

/* Front and Back of the Card */
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.flip-card-front {
  background-color: #ffffff;
  color: #000000;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.flip-card-back {
  background: linear-gradient(135deg, #810000, #ff4d4d);
  color: white;
  transform: rotateY(180deg);
}

.flip-card-back h3 {
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.flip-card-back p {
  font-size: 0.95rem;
  opacity: 0.9;
}

.service-icon {
  font-size: 3rem;
  color: #810000;
  margin-bottom: 15px;
  transition: color 0.3s;
}

.flip-card-front h3 {
  font-size: 1.3rem;
  font-weight: 600;
}

.flip-card:hover .service-icon {
  color: #121731;
}

/* Guide Section */
.guide-section {
  padding: 80px 0;
  background-color: #ffffff; 
}

.section-title1 {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #810000;
}

.section-subtitle1 {
  text-align: center;
  font-size: 1.2rem;
  color: #000000;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.steps-container {
  display: flex;
  gap: 40px;
  justify-content: center;
  flex-wrap: wrap; 
}

.steps-column {
  flex: 1;
  min-width: 300px;
  max-width: 450px;
}

.step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 35px;
  padding: 20px;
  background: #e4e3df;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border-left: 5px solid #810000;
  transition: all 0.3s ease;
}

.step:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
  border-left-color: #CE1212;
}

.step-number {
  font-size: 2rem;
  font-weight: 700;
  color: #810000;
  margin-right: 20px;
  min-width: 40px;
  text-align: center;
  padding-top: 5px;
}

.step-content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #810000;
  margin-bottom: 5px;
}

.step-content p {
  font-size: 0.95rem;
  color: #000000;
  line-height: 1.5;
}

/* CTA Section */
.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #000000, #3A3A3A);
  color: #ffffff;
  text-align: center;
}

.cta-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.cta-section p {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.cta-button.large {
  font-size: 1.2rem;
  padding: 1rem 2.5rem;
  background-color: #ffffff; 
  color: #000000;
  font-weight: 700;
  border: 3px solid #ffffff;
}

.cta-button.large:hover {
  background-color: transparent; 
  color: #ffffff;
  border-color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
}

/* Footer */
.footer {
  background-color: #810000;
  color: #ffffff;
  padding: 40px 0 20px;
}

.container3 {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.footer-section, .footer-section1, .footer-section2 {
  flex: 1;
  min-width: 200px;
  margin-bottom: 20px;
}

.logo-container3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 10px;
}

.logo-img3 {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.logo-text3 {
  font-weight: 700;
  font-size: 1.5rem;
  color: #000000;
}

.logo-text4 {
  font-weight: 700;
  color: #ffffff;
}

.footer-section h3, .footer-section1 h3, .footer-section2 h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #ffffff;
}

.footer-section1 p, .footer-section2 p {
  margin-bottom: 10px;
  font-size: 0.95rem;
  opacity: 0.8;
}

.footer-section1 i {
  margin-right: 8px;
  color: #000000;
}

.social-links a {
  color: #ffffff;
  font-size: 1.5rem;
  margin-right: 15px;
  transition: color 0.3s;
}

.social-links a:hover {
  color: #000000;
}

.footer-bottom {
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.7;
}

/* Responsive Design */
@media (max-width: 1100px) {
  .navbar-left {
    gap: 5rem;
  }
}

@media (max-width: 992px) {
  .navbar {
    padding: 0 1rem;
  }
  
  .nav-links {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .hero-section {
    padding: 0 2rem 2rem;
  }
  
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .steps-container {
    flex-direction: column;
    align-items: center;
  }
  
  .steps-column {
    max-width: 90%;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .image-quote {
    font-size: 1.5rem;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .flip-card {
    height: 200px;
  }
  
  .section-title, .section-title1, .cta-section h2 {
    font-size: 2rem;
  }
  
  .section-subtitle, .section-subtitle1, .cta-section p {
    font-size: 1rem;
  }
  
  .step {
    padding: 15px;
  }
  
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .footer-section, .footer-section1, .footer-section2 {
    min-width: auto;
    width: 100%;
    margin-bottom: 20px;
  }
  
  .footer-section1 {
    order: 3;
  }

  .footer-section2 {
    order: 2;
  }
  
  .social-links {
    justify-content: center;
    display: flex;
  }
}

@media (max-width: 576px) {
  .logo-text, .logo-text1 {
    font-size: 1.3rem;
  }
  
  .logo-img {
    width: 40px;
    height: 40px;
  }
  
  .login-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .cta-button.primary, .cta-button.secondary {
    padding: 0.6rem 1.2rem;
  }
  
  .image-quote {
    font-size: 1.3rem;
  }
  
  .flip-card-front h3 {
    font-size: 1.2rem;
  }
}
</style>