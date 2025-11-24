<template>
  <div class="login-page-body">
    <div class="container">
      <div class="left-panel">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
        <div class="decoration-circle circle-4"></div>
        
        <div>
          <img src="../assets/CommuniTrade.png" alt="News Snap Logo" class="logo-circle">
        </div>
        <h1 class="brand-name">News Snap</h1>
      </div>
      
      <div class="right-panel">
        <div class="login-box">
          <div class="login-header">
            <h2>Welcome Back</h2>
            <p>Log in to track your summaries and stay informed.</p>
          </div>
          
          <form @submit.prevent="loginUser"> 
            <div class="input-group">
              <i class="fas fa-envelope"></i> 
              <input type="email" placeholder="Email Address" required v-model="email"> 
            </div>
            
            <div class="input-group password-container">
              <i class="fas fa-lock"></i>
              <input :type="showPassword ? 'text' : 'password'" placeholder="Password" required v-model="password"> 
              <i 
                :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" 
                class="toggle-eye"
                @click="togglePassword"
              ></i>
            </div>
            
            <button type="submit" class="login-button" :disabled="loading">
              <span v-if="loading">
                <i class="fas fa-spinner fa-spin"></i> Logging in...
              </span>
              <span v-else>
                Login
              </span>
            </button>
            
            <div class="signup-text">
              Don't have an account? <a href="#/register" class="signup-link">Sign Up</a> 
            </div>

            <div class="forgot-password">
              <a href="#" @click.prevent="resetPassword">Forgot Password?</a>
            </div>

            <div v-if="showResendVerification" class="resend-verification">
              <p>Your email is not verified. <a href="#" @click.prevent="resendVerificationEmail">Resend verification email</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/firebase.js'
import { 
    signInWithEmailAndPassword, 
    sendEmailVerification, 
    signOut,
    sendPasswordResetEmail 
} from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'

export default {
    name: 'Login',
    data() {
        return {
            email: '',       
            password: '',   
            showPassword: false,
            loading: false,
            showResendVerification: false
        };
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },

        async loginUser() {
            if (!this.email || !this.password) {
                alert('Error: Email and password are required.');
                return;
            }

            this.loading = true;
            this.showResendVerification = false;

            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth, 
                    this.email, 
                    this.password
                );
                
                const user = userCredential.user;
                
                // Reload user to get the latest email verification status
                await user.reload();
                
                if (!user.emailVerified) {
                    await signOut(auth);
                    this.showResendVerification = true;
                    alert('Please verify your email before logging in. Check your inbox for the verification link. You can resend the verification email below.');
                    return;
                }
                
                // ✅ SYNC EMAIL VERIFICATION STATUS TO FIRESTORE
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    await updateDoc(userDocRef, {
                        emailVerified: true
                    });
                    console.log("Email verification status updated in Firestore");
                } catch (firestoreError) {
                    console.warn("Could not update email verification in Firestore:", firestoreError);
                }
                
                console.log("Login successful! User UID:", user.uid);
                alert(`Welcome back, ${user.email}!`);
                
                this.$router.push({ name: 'Home' });

            } catch (error) {
                const errorCode = error.code;
                console.error("Firebase Login Error:", errorCode, error.message);
                
                let userFriendlyMessage = 'Login failed. Please check your credentials.';
                
                if (errorCode === 'auth/invalid-email') {
                    userFriendlyMessage = 'The email address format is invalid.';
                } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                    userFriendlyMessage = 'Invalid email or password.';
                } else if (errorCode === 'auth/user-disabled') {
                    userFriendlyMessage = 'This user account has been disabled.';
                } else if (errorCode === 'auth/too-many-requests') {
                    userFriendlyMessage = 'Too many failed login attempts. Please try again later.';
                } else if (errorCode === 'auth/network-request-failed') {
                    userFriendlyMessage = 'Network error. Please check your internet connection.';
                }
                
                alert(`Login Failed: ${userFriendlyMessage}`);
            } finally {
                this.loading = false;
            }
        },

        async resendVerificationEmail() {
            if (!this.email || !this.password) {
                alert('Please enter your email and password first.');
                return;
            }

            this.loading = true;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
                const user = userCredential.user;
                
                await sendEmailVerification(user);
                
                await signOut(auth);
                
                alert('Verification email sent! Please check your inbox and verify your email before logging in.');
                this.showResendVerification = false;
                
            } catch (error) {
                console.error("Resend verification error:", error);
                alert('Failed to send verification email. Please try again.');
            } finally {
                this.loading = false;
            }
        },

        async resetPassword() {
            if (!this.email) {
                this.email = prompt('Please enter your email address to reset your password:');
                if (!this.email) return;
            }

            try {
                await sendPasswordResetEmail(auth, this.email);
                alert('Password reset email sent! Please check your inbox.');
            } catch (error) {
                console.error("Password reset error:", error);
                alert('Failed to send password reset email. Please check your email address.');
            }
        }
    },
    mounted() {
        const loginBox = document.querySelector('.login-box')
        if (loginBox) {
            loginBox.style.transform = 'translateY(20px)'
            loginBox.style.opacity = '0'

            setTimeout(() => {
                loginBox.style.transition = 'transform 0.5s ease, opacity 0.5s ease'
                loginBox.style.transform = 'translateY(0)'
                loginBox.style.opacity = '1'
            }, 100)
        }
    }
}
</script>

<style scoped>
.login-page-body {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f8f6f4 0%, #e8e6e1 100%);
  height: 100vh;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.container {
  display: flex;
  width: 850px;
  height: 550px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(198, 64, 64, 0.1), 
              0 5px 15px rgba(198, 64, 64, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.left-panel {
  flex: 1;
  background: linear-gradient(135deg, #c64040 0%, #8b2c2c 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.logo-circle {
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.logo-circle img {
  max-width: 100%;
  height: auto;
}

.brand-name {
  font-size: 35px;
  font-weight: 700;
  margin-top: 10px;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  color: white;
}

.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.login-box {
  width: 100%;
  max-width: 380px;
}

.login-header {
  margin-bottom: 35px;
}

.login-header h2 {
  font-size: 40px;
  font-weight: 600;
  text-align: center;
  background: linear-gradient(90deg, #c64040, #8b2c2c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.login-header p {
  color: #7f8c8d;
  margin-top: 8px;
  font-size: 18px;
  text-align: center;
}

.input-group {
  margin-bottom: 25px;
  position: relative;
}

.password-container {
  position: relative;
}

.toggle-eye {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #666;
  z-index: 2;
  font-size: 18px;
}

.toggle-eye:hover {
  color: #c64040;
}

.input-group input {
  width: 100%;
  padding: 15px 45px 15px 45px;
  border: 1.5px solid #e1e1e1;
  border-radius: 10px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
  background: #fff;
  color: #333;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
  box-sizing: border-box;
}

.input-group input:hover {
  border-color: #c64040;
  background: #fdfafa;
}

.input-group input:focus {
  border-color: #c64040;
  box-shadow: 0 0 0 3px rgba(198, 64, 64, 0.1);
  background: #fff;
}

.input-group i:not(.toggle-eye) {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #c64040;
  font-size: 18px;
  z-index: 2;
}

.login-button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #c64040 0%, #8b2c2c 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(198, 64, 64, 0.3);
  position: relative;
  overflow: hidden;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(198, 64, 64, 0.4);
  background: linear-gradient(135deg, #8b2c2c 0%, #c64040 100%); 
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.signup-text {
  text-align: center;
  margin-top: 25px;
  color: #7f8c8d;
  font-size: 15px;
}

.signup-link {
  color: #c64040;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.signup-link:hover {
  color: #8b2c2c;
  text-decoration: underline;
}

.forgot-password {
  text-align: center;
  margin-top: 15px;
}

.forgot-password a {
  color: #c64040;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password a:hover {
  color: #8b2c2c;
  text-decoration: underline;
}

.resend-verification {
  text-align: center;
  margin-top: 15px;
  padding: 12px;
  background-color: #fdfafa;
  border: 1px solid #c64040;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(198, 64, 64, 0.1);
}

.resend-verification p {
  margin: 0;
  color: #8b2c2c;
}

.resend-verification a {
  color: #c64040;
  text-decoration: none;
  font-weight: 600;
}

.resend-verification a:hover {
  color: #8b2c2c;
  text-decoration: underline;
}

.fa-spin {
  margin-right: 8px;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 150px;
  height: 150px;
  top: -90px;
  left: 20%;
}

.circle-2 {
  width: 140px;
  height: 140px;
  bottom: -50px;
  right: -30px;
}

.circle-3 {
  width: 70px;
  height: 70px;
  top: 50%;
  left: -35px;
}

.circle-4 {
  width: 80px;
  height: 80px;
  top: 25%;
  left: 380px;
}

@media (max-width: 992px) {
  .container {
    flex-direction: column;
    max-width: 500px;
    height: auto;
  }
  
  .left-panel {
    padding: 30px;
    min-height: 250px;
  }
  
  .logo-circle {
    width: 120px;
    height: 120px;
  }
  
  .brand-name {
    font-size: 24px;
  }
  
  .circle-4 {
    left: 80%;
  }
}

@media (max-width: 768px) {
  .container {
    border-radius: 15px;
  }
  
  .left-panel, .right-panel {
    padding: 25px;
  }
  
  .login-header h2 {
    font-size: 28px;
  }
  
  .login-header p {
    font-size: 14px;
  }
  
  .input-group input {
    padding: 12px 12px 12px 40px;
    font-size: 14px;
  }
  
  .login-button {
    padding: 12px;
    font-size: 15px;
  }
  
  .circle-1, .circle-2, .circle-3, .circle-4 {
    display: none; 
  }

  .resend-verification {
    font-size: 13px;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .container {
    border-width: 2px;
    border-radius: 12px;
  }
  
  .left-panel, .right-panel {
    padding: 20px;
  }
  
  .logo-circle {
    width: 100px;
    height: 100px;
    margin-bottom: 15px;
  }
  
  .brand-name {
    font-size: 20px;
  }
  
  .login-header {
    margin-bottom: 25px;
  }
  
  .login-header h2 {
    font-size: 24px;
  }
  
  .input-group {
    margin-bottom: 20px;
  }
  
  .signup-text {
    font-size: 14px;
  }

  .resend-verification {
    font-size: 12px;
  }
}
</style>