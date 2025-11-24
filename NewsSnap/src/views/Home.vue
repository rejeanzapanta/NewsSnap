<template>
  <div class="home-page">
    <div class="chat-container">
      <!-- Chat Messages Area -->
      <div class="chat-messages" ref="messagesContainer">
        <!-- Welcome Message -->
        <div class="message ai-message">
          <div class="message-content">
            <p>Hello! I'm your AI news summarizer. Paste a news article link below and I'll create a summary for you.</p>
          </div>
        </div>

        <!-- User Messages (Links) -->
        <div 
          v-for="(message, index) in messages" 
          :key="index" 
          :class="['message', message.type + '-message']"
        >
          <div class="message-content">
            <div v-if="message.type === 'user'" class="link-content">
              <span class="link-icon">🔗</span>
              <span class="link-text">{{ message.content }}</span>
            </div>
            <div v-else-if="message.type === 'ai'" class="summary-content">
              <div class="summary-header">
                <span class="length-badge">{{ message.length }} summary</span>
                <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
              </div>
              <div class="summary-text">{{ message.summary }}</div>
              <div class="summary-actions" v-if="message.summary">
                <button class="action-btn copy-btn" @click="copySummary(message.summary)">
                  <span class="material-icons">content_copy</span>
                  Copy Summary
                </button>
                <button class="action-btn download-btn" @click="downloadPDF(message.summary, message.length)">
                  <span class="material-icons">download</span>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isLoading" class="message ai-message">
          <div class="message-content">
            <div class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p class="loading-text">Generating summary... This may take a few seconds.</p>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="message ai-message error-message">
          <div class="message-content">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-container">
        <div class="chat-input-wrapper">
          <button class="paste-link-btn" @click="showLinkInput = true" v-if="!showLinkInput">
            <span class="material-icons">link</span>
            Paste Link
          </button>
          
          <div v-if="showLinkInput" class="link-input-wrapper">
            <input
              type="text"
              v-model="linkInput"
              placeholder="Paste your news article link here..."
              class="link-input"
              @keypress.enter="processLink"
            />
            <button class="send-btn" @click="processLink" :disabled="!linkInput.trim() || isLoading">
              <span class="material-icons">send</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Length Modal -->
      <div v-if="showLengthModal" class="modal-overlay" @click="showLengthModal = false">
        <div class="modal-content" @click.stop>
          <h3>Choose Summary Length</h3>
          <div class="length-options">
            <div class="length-option" @click="selectLength('short')" :class="{ 'selected': selectedLength === 'short' }">
              <div class="option-header">
                <span class="option-icon">⚡</span>
                <h4>Short</h4>
              </div>
              <p>Quick overview of the main points</p>
            </div>
            
            <div class="length-option" @click="selectLength('standard')" :class="{ 'selected': selectedLength === 'standard' }">
              <div class="option-header">
                <span class="option-icon">⚖️</span>
                <h4>Standard</h4>
              </div>
              <p>Balanced summary with key details</p>
            </div>
            
            <div class="length-option" @click="selectLength('long')" :class="{ 'selected': selectedLength === 'long' }">
              <div class="option-header">
                <span class="option-icon">📊</span>
                <h4>Long</h4>
              </div>
              <p>In-depth version for fuller understanding</p>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" @click="showLengthModal = false">Cancel</button>
            <button class="btn-primary" @click="confirmLengthSelection" :disabled="!selectedLength">
              Generate Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase.js'
import { collection, addDoc } from 'firebase/firestore'
import { summarizeLink } from '@/services/gemini.js'
import jsPDF from 'jspdf'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    
    // Reactive data
    const messages = ref([])
    const linkInput = ref('')
    const showLinkInput = ref(false)
    const showLengthModal = ref(false)
    const isLoading = ref(false)
    const messagesContainer = ref(null)
    const pendingLink = ref('')
    const selectedLength = ref('')
    const error = ref('')
    const user = ref(null)

    // Scroll to bottom of chat
    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }

    // Format timestamp
    const formatTimestamp = (timestamp) => {
      if (!timestamp) return ''
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // Process link input
    const processLink = () => {
      if (linkInput.value.trim()) {
        // Basic URL validation
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
        if (!urlPattern.test(linkInput.value.trim())) {
          error.value = "Please enter a valid URL"
          setTimeout(() => { error.value = '' }, 5000)
          return
        }

        pendingLink.value = linkInput.value.trim()
        
        // Add user message
        messages.value.push({
          type: 'user',
          content: pendingLink.value,
          timestamp: new Date()
        })
        
        // Clear input and hide it
        linkInput.value = ''
        showLinkInput.value = false
        error.value = ''
        
        // Show length options modal
        showLengthModal.value = true
        selectedLength.value = 'standard' // Default selection
        
        scrollToBottom()
      }
    }

    // Select summary length
    const selectLength = (length) => {
      selectedLength.value = length
    }

    // Confirm length selection and generate summary
    const confirmLengthSelection = async () => {
      if (!selectedLength.value) return
      
      showLengthModal.value = false
      isLoading.value = true
      error.value = ''
      
      try {
        // Use the actual Gemini service
        const summary = await summarizeLink(pendingLink.value, selectedLength.value)
        
        // Create message object
        const aiMessage = {
          type: 'ai',
          summary: summary,
          length: selectedLength.value,
          link: pendingLink.value,
          timestamp: new Date()
        }
        
        // Add AI message with summary
        messages.value.push(aiMessage)
        
        // Save to Firestore if user is logged in
        if (user.value) {
          try {
            const summaryData = {
              userId: user.value.uid,
              link: pendingLink.value,
              summary: summary,
              length: selectedLength.value,
              timestamp: new Date(),
              type: 'ai'
            }
            
            console.log('💾 Saving summary to Firestore...')
            const docRef = await addDoc(collection(db, "summaries"), summaryData)
            console.log('✅ Summary saved to Firestore with ID:', docRef.id)
            
          } catch (firestoreError) {
            console.error('Firestore save error:', firestoreError)
          }
        } else {
          console.log('User not logged in, summary not saved to history')
        }
        
      } catch (err) {
        console.error('Summary generation error:', err)
        error.value = err.message || 'Failed to generate summary. Please try again.'
        
        // Add error message
        messages.value.push({
          type: 'ai',
          summary: error.value,
          length: 'error',
          timestamp: new Date()
        })
      } finally {
        isLoading.value = false
        scrollToBottom()
      }
    }

    // Copy summary to clipboard
    const copySummary = async (summary) => {
      try {
        await navigator.clipboard.writeText(summary)
        alert('Summary copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy summary:', err)
        alert('Failed to copy summary. Please try again.')
      }
    }

    // Download summary as PDF
    const downloadPDF = (summary, length) => {
      try {
        const doc = new jsPDF();
        
        doc.setProperties({
          title: 'News Summary',
          subject: `${length.charAt(0).toUpperCase() + length.slice(1)} News Summary`,
          creator: 'AI News Summarizer'
        });
        
        const margin = 20;
        let yPosition = margin;
        const pageWidth = doc.internal.pageSize.getWidth();
        const maxWidth = pageWidth - (margin * 2);
        
        // Add title
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('News Summary', pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 15;
        
        // Add summary length
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Summary Type: ${length.charAt(0).toUpperCase() + length.slice(1)}`, margin, yPosition);
        
        yPosition += 10;
        
        // Add date
        const currentDate = new Date().toLocaleDateString();
        doc.text(`Generated on: ${currentDate}`, margin, yPosition);
        
        yPosition += 10;
        
        // Add source link
        doc.text('Source:', margin, yPosition);
        const sourceLinkLines = doc.splitTextToSize(pendingLink.value, maxWidth);
        sourceLinkLines.forEach((line, index) => {
          if (index === 0) {
            doc.text(line, margin + 25, yPosition);
          } else {
            yPosition += 7;
            doc.text(line, margin, yPosition);
          }
        });
        yPosition += 10;
        
        yPosition += 10;
        
        // Add summary content
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        const splitText = doc.splitTextToSize(summary, maxWidth);
        
        splitText.forEach(line => {
          if (yPosition > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPosition = margin;
          }
          
          doc.text(line, margin, yPosition);
          yPosition += 7;
        });
        
        const fileName = `news-summary-${length}-${Date.now()}.pdf`;
        doc.save(fileName);
        
      } catch (err) {
        console.error('PDF generation error:', err);
        alert('Failed to generate PDF. Please try again.');
      }
    }

    // Watch for messages changes to adjust layout
    watch(() => messages.value, () => {
      scrollToBottom()
    }, { deep: true })

    // Initialize user
    onMounted(() => {
      user.value = auth.currentUser
      
      // Listen for auth state changes
      auth.onAuthStateChanged((currentUser) => {
        user.value = currentUser
      })
    })

    return {
      messages,
      linkInput,
      showLinkInput,
      showLengthModal,
      isLoading,
      messagesContainer,
      selectedLength,
      error,
      processLink,
      selectLength,
      confirmLengthSelection,
      copySummary,
      downloadPDF,
      formatTimestamp
    }
  }
}
</script>

<style scoped>
.home-page {
  height: 100vh;
  background: var(--light);
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--light);
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.chat-messages::-webkit-scrollbar {
  display: none;
}

.message {
  display: flex;
  max-width: 100%;
}

.ai-message {
  justify-content: flex-start;
}

.user-message {
  justify-content: flex-end;
}

.message-content {
  max-width: 70%;
  padding: 1rem 1.5rem;
  border-radius: 1.5rem;
  word-wrap: break-word;
}

.ai-message .message-content {
  background-color: var(--light);
  border: 2px solid var(--grey);
  color: var(--primary);
  border-bottom-left-radius: 0.5rem;
}

.user-message .message-content {
  background-color: var(--grey);
  color: var(--light);
  border-bottom-right-radius: 0.5rem;
}

.link-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.link-icon {
  font-size: 1.2rem;
}

.link-text {
  font-size: 0.9rem;
  opacity: 0.9;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.timestamp {
  font-size: 0.8rem;
  color: #666;
}

.summary-text {
  line-height: 1.6;
  white-space: pre-wrap;
}

.summary-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
}

.copy-btn {
  background-color: var(--primary);
  color: var(--light);
  border: 1px solid var(--primary);
}

.copy-btn:hover {
  background-color: var(--grey);
  color: var(--light);
  border-color: var(--grey);
}

.download-btn {
  background-color: var(--light);
  color: var(--primary);
  border: 1px solid var(--grey);
}

.download-btn:hover {
  background-color: var(--grey);
  color: var(--light);
}

.chat-input-container {
  padding: 0.5rem;
  background-color: var(--light);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 0;
  transform: translateY(-50px);
  padding-bottom: 0;
  position: relative;
  bottom: -50px;
}

.chat-input-wrapper {
  max-width: 100%;
  margin: 0 auto;
}

.paste-link-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background-color: var(--grey);
  color: var(--light);
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
  font-family: inherit;
}

.paste-link-btn:hover {
  background-color: var(--primary);
  transform: translateY(-2px);
}

.link-input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background-color: var(--light);
  border: 2px solid var(--grey);
  border-radius: 2rem;
  padding: 0.5rem;
}

.link-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.75rem 1rem;
  background: transparent;
  font-size: 1rem;
  color: var(--primary);
  font-family: inherit;
}

.link-input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: var(--grey);
  color: var(--light);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background-color: var(--primary);
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading Animation */
.loading-dots {
  display: flex;
  gap: 0.25rem;
}

.loading-dots span {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: var(--grey);
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.loading-text {
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.9rem;
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
  z-index: 1000;
}

.modal-content {
  background-color: var(--light);
  padding: 2rem;
  border-radius: 1rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  color: var(--primary);
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
}

.length-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.length-option {
  padding: 1.5rem;
  border: 2px solid var(--grey);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: var(--light);
}

.length-option:hover {
  background-color: var(--grey);
  color: var(--light);
  transform: translateY(-2px);
}

.length-option:hover .option-header h4,
.length-option:hover p {
  color: var(--light);
}

.option-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.option-icon {
  font-size: 1.5rem;
}

.option-header h4 {
  color: var(--primary);
  margin: 0;
  font-size: 1.2rem;
}

.length-option p {
  color: var(--primary);
  margin: 0;
  opacity: 0.8;
  font-size: 0.95rem;
}

.length-option.selected {
  background-color: var(--primary);
  border-color: var(--primary);
  color: var(--light);
}

.length-option.selected .option-header h4,
.length-option.selected p {
  color: var(--light);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
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

.btn-primary:disabled {
  background-color: var(--grey);
  cursor: not-allowed;
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

.error-message .message-content {
  background-color: #ffe6e6;
  border-color: #ff4444;
  color: #cc0000;
}

.length-badge {
  background-color: var(--grey);
  color: var(--light);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

@media (max-width: 768px) {
  .chat-messages {
    padding: 0.5rem;
    gap: 1rem;
  }
  
  .message-content {
    max-width: 85%;
    padding: 0.75rem 1rem;
  }
  
  .chat-input-container {
    padding: 0.75rem;
  }
  
  .paste-link-btn {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
  
  .modal-content {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .length-option {
    padding: 1rem;
  }
  
  .summary-actions {
    flex-direction: column;
  }
  
  .action-btn {
    justify-content: center;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .message-content {
    max-width: 90%;
    padding: 0.5rem 0.75rem;
  }
  
  .link-input-wrapper {
    padding: 0.25rem;
  }
  
  .link-input {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .send-btn {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>