<template>
    <div class="register-page-body">
    <div class="container">
        <div class="left-panel">
            <div class="register-box">
                <div class="register-header">
                    <h2>Create Account</h2>
                    <p>Join News Snap to get quick and accurate AI-generated news summaries.</p>
                </div>
                
                <form @submit.prevent="registerUser">
                    <div class="input-group">
                        <i class="fas fa-user"></i>
                        <input type="text" placeholder="First Name" required v-model="firstName">
                    </div>
                    
                    <div class="input-group">
                        <i class="fas fa-user"></i>
                        <input type="text" placeholder="Last Name" required v-model="lastName">
                    </div>

                    <div class="input-group">
                        <i class="fas fa-envelope"></i>
                        <input type="email" placeholder="Email Address" required v-model="email">
                    </div>
                    
                    <div class="input-group">
                        <i class="fas fa-user"></i>
                        <input type="text" placeholder="Username" required v-model="username">
                    </div>
                    
                    <div class="input-group password-container">
                        <i class="fas fa-lock"></i>
                        <input 
                            :type="showPassword ? 'text' : 'password'" 
                            placeholder="Password" 
                            required 
                            v-model="password"
                        >
                        <i 
                            :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" 
                            class="toggle-eye"
                            @click="togglePassword"
                        ></i>
                    </div>
                    
                    <div class="input-group password-container">
                        <i class="fas fa-lock"></i>
                        <input 
                            :type="showConfirmPassword ? 'text' : 'password'" 
                            placeholder="Confirm Password" 
                            required 
                            v-model="confirmPassword"
                        >
                        <i 
                            :class="showConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" 
                            class="toggle-eye"
                            @click="toggleConfirmPassword"
                        ></i>
                    </div>
                    
                    <div class="terms-group">
                        <input type="checkbox" id="terms" required v-model="termsAccepted">
                        <label for="terms">I agree to the <a href="#" @click.prevent="showTermsModal">Terms & Conditions</a></label>
                    </div>
                    
                    <button type="submit" class="register-button" :disabled="loading">
                        <span v-if="loading">
                            <i class="fas fa-spinner fa-spin"></i> Creating Account...
                        </span>
                        <span v-else>
                            Create Account
                        </span>
                    </button>
                    
                    <div class="login-text">
                        Already have an account? 
                        <a href="#/login" class="login-link">Log In</a>
                    </div>
                    
                    <div class="about-link">
                        <a href="#/" class="about-system">About News Snap System</a>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="right-panel">
            <div class="decoration-circle circle-1"></div>
            <div class="decoration-circle circle-2"></div>
            <div class="decoration-circle circle-3"></div>
            <div class="decoration-circle circle-4"></div>
            
            <div>
                <div class="logo-circle">
                    <img src="../assets/CommuniTrade.png" alt="CommuniTrade Logo">
                </div>
            </div>
            <h1 class="brand-name">News Snap</h1>
        </div>

        <div v-if="showTerms" class="terms-modal-overlay" @click="hideTermsModal">
            <div class="terms-modal" @click.stop>
                <div class="terms-modal-header">
                    <h2>Terms & Conditions</h2>
                    <button class="close-button" @click="hideTermsModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="terms-modal-content">
                    <div class="terms-content">
                        <p><strong>Last Updated:</strong> {{ currentDate }}</p>

                        <h3>1. Acceptance of Terms</h3>
                        <p>By using <strong>News Snap</strong>, you agree to follow these Terms and Conditions. Please read them carefully before using the system.</p>

                        <h3>2. What News Snap Does</h3>
                        <p><strong>News Snap</strong> is an AI-powered tool that summarizes news links into short, standard, or long versions. It also has a history feature where users can view their previous summaries.</p>

                        <h3>3. User Responsibilities</h3>
                        <p>You agree to use <strong>News Snap</strong> properly and not for harmful or illegal activities. Please only submit valid and safe news links.</p>

                        <h3>4. Accuracy of Summaries</h3>
                        <p>The summaries are generated by AI and might not always be 100% accurate. Always double-check important information from trusted news sources.</p>

                        <h3>5. Privacy</h3>
                        <p>Your personal information and history are kept private. We do not share your data with others and use security measures to protect your account.</p>

                        <h3>6. Updates</h3>
                        <p>We may update or improve <strong>News Snap</strong> anytime to provide a better experience for users.</p>

                        <p>By continuing to use <strong>News Snap</strong>, you confirm that you have read and agreed to these Terms and Conditions.</p>
                    </div>
                </div>
                <div class="terms-modal-footer">
                    <button class="agree-button" @click="acceptTerms">I Understand & Agree</button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { auth, db } from '@/firebase.js'
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

export default {
    name: 'Register',
    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            termsAccepted: false,
            loading: false,
            showTerms: false,
            showPassword: false,
            showConfirmPassword: false
        }
    },
    computed: {
        currentDate() {
            return new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        toggleConfirmPassword() {
            this.showConfirmPassword = !this.showConfirmPassword;
        },
        
        showTermsModal() {
            this.showTerms = true;
        },
        hideTermsModal() {
            this.showTerms = false;
        },
        acceptTerms() {
            this.termsAccepted = true;
            this.hideTermsModal();
        },
        
        isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        },
        
        async registerUser() {
            if (this.loading) return;

            if (!this.isValidEmail(this.email)) {
                return alert('Please enter a valid email address.');
            }
            
            if (this.password !== this.confirmPassword) {
                return alert('Error: Passwords do not match.');
            }
            
            if (this.password.length < 6) {
                return alert('Password should be at least 6 characters.');
            }
            
            if (!this.termsAccepted) {
                return alert('Error: You must agree to the Terms & Conditions.');
            }

            this.loading = true;

            try {
                // Create user with Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
                const user = userCredential.user;

                // Update user profile with display name
                await updateProfile(user, { 
                    displayName: `${this.firstName} ${this.lastName}`
                });

                // Send email verification
                await sendEmailVerification(user);
                console.log("Email verification sent!");

                // Save user data to Firestore
                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    username: this.username,
                    email: this.email,
                    emailVerified: false,
                    registrationDate: new Date(),
                    role: 'user'
                });

                // Sign out user immediately after registration
                await signOut(auth);
                
                alert("Account created successfully! Please check your email to verify your email address before logging in. You will be redirected to the login page.");
                
                // Redirect to login page
                this.$router.push({ name: 'Login' });
                
            } catch (error) {
                console.error("Registration Error:", error);
                alert(this.getErrorMessage(error));
            } finally {
                this.loading = false;
            }
        },

        getErrorMessage(error) {
            const errorCode = error.code;
            switch (errorCode) {
                case 'auth/email-already-in-use':
                    return 'Email address is already in use. Please use a different email or login.';
                case 'auth/invalid-email':
                    return 'The email address is invalid.';
                case 'auth/weak-password':
                    return 'Password should be at least 6 characters.';
                case 'auth/network-request-failed':
                    return 'Network error. Please check your internet connection.';
                case 'auth/too-many-requests':
                    return 'Too many attempts. Please try again later.';
                default:
                    return error.message || 'An unexpected error occurred. Please try again.';
            }
        }
    },
    mounted() {
        document.body.classList.add('register-page-body');
        
        const registerBox = document.querySelector('.register-box');
        if (registerBox) {
            registerBox.style.transform = 'translateY(20px)';
            registerBox.style.opacity = '0';
            
            setTimeout(() => {
                registerBox.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                registerBox.style.transform = 'translateY(0)';
                registerBox.style.opacity = '1';
            }, 100);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.showTerms) {
                this.hideTermsModal();
            }
        });
    },
    unmounted() {
        document.body.classList.remove('register-page-body');
    }
}
</script>

<style>
.register-page-body {
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #f8f6f4 0%, #e8e6e1 100%);
    height: 100vh;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}

</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.container {
    display: flex;
    width: 100%;
    max-width: 1000px;
    height: auto;
    min-height: 600px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(198, 64, 64, 0.1), 
                0 5px 15px rgba(198, 64, 64, 0.05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin-top: 25px;
}

.left-panel {
    flex: 1.2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px;
}

.right-panel {
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

.register-box {
    width: 100%;
    max-width: 420px;
}

.register-header {
    margin-bottom: 20px;
}

.register-header h2 {
    font-size: 30px;
    font-weight: 600;
    text-align: center;
    background: linear-gradient(90deg, #c64040, #8b2c2c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
}

.register-header p {
    color: #7f8c8d;
    margin-top: 8px;
    font-size: 14px;
    text-align: center;
}

.input-group {
    margin-bottom: 15px;
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
    font-size: 15px;
}

.toggle-eye:hover {
    color: #c64040;
}

.input-group input {
    width: 100%;
    padding: 12px 38px 12px 38px;
    border: 1.5px solid #e1e1e1;
    border-radius: 10px;
    font-size: 14px;
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
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #c64040;
    font-size: 15px;
    z-index: 2;
}

.terms-group {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    font-size: 13px;
    color: #7f8c8d;
    text-align: center;
}

.terms-group input {
    margin-right: 8px;
    width: 14px;
    height: 14px;
    accent-color: #c64040;
}

.terms-group a {
    color: #c64040;
    text-decoration: none;
    font-weight: 600;
}

.terms-group a:hover {
    color: #8b2c2c;
    text-decoration: underline;
}

.register-button {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #c64040 0%, #8b2c2c 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(198, 64, 64, 0.3);
    position: relative;
    overflow: hidden;
}

.register-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(198, 64, 64, 0.4);
    background: linear-gradient(135deg, #8b2c2c 0%, #c64040 100%);
}

.register-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
}

.login-text {
    text-align: center;
    margin-top: 15px;
    color: #7f8c8d;
    font-size: 13px;
}

.login-link {
    color: #c64040;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
}

.login-link:hover {
    color: #8b2c2c;
    text-decoration: underline;
}

.about-link {
    text-align: center;
    margin-top: 10px;
}

.about-system {
    color: #c64040;
    text-decoration: none;
    font-weight: 500;
    font-size: 13px;
    transition: all 0.3s;
}

.about-system:hover {
    color: #8b2c2c;
    text-decoration: underline;
}

.logo-circle {
    width: 180px;
    height: 180px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    overflow: hidden;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.logo-circle img {
    max-width: 100%;
    height: auto;
}

.brand-name {
    font-size: 34px;
    font-weight: 700;
    margin-top: 10px;
    text-align: center;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    color: white;
}

.decoration-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
    width: 100px;
    height: 100px;
    top: -30px;
    left: 20%;
}

.circle-2 {
    width: 190px;
    height: 190px;
    bottom: -100px;
    right: -50px;
}

.circle-3 {
    width: 90px;
    height: 90px;
    top: 45%;
    left: -60px;
}

.circle-4 {
    width: 100px;
    height: 100px;
    top: 15%;
    left: 300px;
}

.terms-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
    backdrop-filter: blur(8px);
}

.terms-modal {
    background: white;
    border-radius: 15px;
    width: 90%;
    max-width: 700px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px rgba(198, 64, 64, 0.2);
    animation: slideUp 0.3s ease;
    border: 1px solid #f0f0f0;
}

.terms-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    border-bottom: 1px solid #f0f0f0;
    background: linear-gradient(135deg, #c64040 0%, #8b2c2c 100%);
    border-radius: 15px 15px 0 0;
}

.terms-modal-header h2 {
    color: white;
    margin: 0;
    font-size: 24px;
    font-weight: 600;
}

.close-button {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s ease;
}

.close-button:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.terms-modal-content {
    flex: 1;
    overflow-y: auto;
    padding: 25px;
    background: #fafafa;
}

.terms-content {
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    border: 1px solid #f0f0f0;
}

.terms-content h3 {
    color: #c64040;
    margin: 20px 0 10px 0;
    font-size: 18px;
    font-weight: 600;
}

.terms-content h3:first-child {
    margin-top: 0;
}

.terms-content p {
    color: #555;
    line-height: 1.6;
    margin-bottom: 15px;
}

.terms-content strong {
    color: #c64040;
}

.terms-modal-footer {
    padding: 20px 25px;
    border-top: 1px solid #f0f0f0;
    background: white;
    border-radius: 0 0 15px 15px;
    text-align: center;
}

.agree-button {
    background: linear-gradient(135deg, #c64040 0%, #8b2c2c 100%);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(198, 64, 64, 0.3);
}

.agree-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(198, 64, 64, 0.4);
    background: linear-gradient(135deg, #8b2c2c 0%, #c64040 100%);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 992px) {
    .container {
        flex-direction: column;
        max-height: 95vh;
        overflow: hidden;
    }
    
    .left-panel {
        order: 2;
        padding: 15px;
        flex: 1;
        overflow-y: auto;
    }
    
    .right-panel {
        order: 1;
        padding: 20px;
        flex: 0.6;
    }
    
    .register-box {
        max-width: 100%;
        transform: scale(0.9);
    }
    
    .circle-4 {
        left: 80%;
    }
    
    .logo-circle {
        width: 100px;
        height: 100px;
    }
    
    .brand-name {
        font-size: 24px;
    }

    .terms-modal {
        width: 95%;
        max-height: 85vh;
    }
}

@media (max-width: 768px) {
    .container {
        border-radius: 15px;
        max-height: 95vh;
    }
    
    .left-panel {
        padding: 15px;
    }
    
    .right-panel {
        padding: 15px;
    }
    
    .register-header h2 {
        font-size: 22px;
    }
    
    .brand-name {
        font-size: 20px;
    }
    
    .logo-circle {
        width: 80px;
        height: 80px;
    }
    
    .circle-1, .circle-2, .circle-3, .circle-4 {
        display: none;
    }
    
    .input-group {
        margin-bottom: 10px;
    }
    
    .input-group input {
        padding: 8px 8px 8px 30px;
        font-size: 12px;
    }
    
    .toggle-eye {
        font-size: 12px;
        right: 10px;
    }
    
    .input-group i:not(.toggle-eye) {
        font-size: 12px;
        left: 10px;
    }

    .terms-modal-header {
        padding: 15px 20px;
    }

    .terms-modal-header h2 {
        font-size: 20px;
    }

    .terms-modal-content {
        padding: 20px;
    }

    .terms-content {
        padding: 20px;
    }

    .terms-content h3 {
        font-size: 16px;
    }
}

@media (max-width: 576px) {
    .container {
        border-width: 2px;
        max-height: 95vh;
    }
    
    .left-panel {
        padding: 10px;
    }
    
    .register-box {
        transform: scale(0.85);
    }
    
    .terms-group {
        flex-wrap: wrap;
        font-size: 11px;
    }
    
    .register-button {
        padding: 8px;
        font-size: 12px;
    }
    
    .login-text, .about-system {
        font-size: 11px;
    }
    
    .right-panel {
        padding: 10px;
    }
    
    .logo-circle {
        width: 70px;
        height: 70px;
    }
    
    .brand-name {
        font-size: 18px;
    }

    .terms-modal {
        width: 98%;
        max-height: 90vh;
    }

    .terms-modal-header {
        padding: 12px 15px;
    }

    .terms-modal-header h2 {
        font-size: 18px;
    }

    .terms-modal-content {
        padding: 15px;
    }

    .terms-content {
        padding: 15px;
    }

    .agree-button {
        padding: 10px 20px;
        font-size: 14px;
    }
}

@media (max-width: 400px) {
    .register-header h2 {
        font-size: 20px;
    }
    
    .register-header p {
        font-size: 11px;
    }
    
    .brand-name {
        font-size: 16px;
    }
    
    .logo-circle {
        width: 60px;
        height: 60px;
    }
    
    .register-box {
        transform: scale(0.8);
    }

    .input-group input {
        padding: 8px 25px 8px 25px;
    }
    
    .toggle-eye {
        font-size: 11px;
        right: 8px;
    }
}

@media (max-width: 350px) {
    .terms-group {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .terms-group input {
        margin-bottom: 4px;
    }
    
    .register-box {
        transform: scale(0.75);
    }
    
    .input-group input {
        padding: 6px 22px 6px 22px;
        font-size: 11px;
    }
    
    .toggle-eye {
        font-size: 10px;
        right: 6px;
    }
}

.fa-spin {
    margin-right: 8px;
}
</style>