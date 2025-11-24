<template>
  <div class="history-page">
    <div class="history-container">
      <div class="history-header">
        <h1>Summary History</h1>
        <p>Your previously generated news summaries</p>
      </div>

      <div class="history-content">
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading your history...</p>
        </div>

        <div v-else-if="summaries.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>No summaries yet</h3>
          <p>Your generated summaries will appear here</p>
          <router-link to="/home" class="cta-button">Generate Your First Summary</router-link>
        </div>

        <div v-else class="summaries-grid">
          <div 
            v-for="summary in sortedSummaries" 
            :key="summary.id" 
            class="summary-card"
          >
            <div class="summary-header">
              <div class="summary-meta">
                <span class="length-badge" :class="summary.length">{{ summary.length }}</span>
                <span class="timestamp">{{ formatDate(summary.timestamp) }}</span>
              </div>
              <button class="delete-btn" @click="deleteSummary(summary.id)" title="Delete summary">
                <i class="fas fa-trash"></i>
              </button>
            </div>
            
            <div class="link-preview">
              <i class="fas fa-link"></i>
              <span class="link-text" :title="summary.link">{{ truncateLink(summary.link) }}</span>
            </div>
            
            <div class="summary-text">
              {{ truncateText(summary.summary, 200) }}
            </div>
            
            <div class="summary-actions">
              <button class="action-btn view-btn" @click="viewSummary(summary)">
                <i class="fas fa-eye"></i>
                View Full
              </button>
              <button class="action-btn copy-btn" @click="copySummary(summary.summary)">
                <i class="fas fa-copy"></i>
                Copy
              </button>
              <button class="action-btn download-btn" @click="downloadSummaryPDF(summary)">
                <i class="fas fa-download"></i>
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Detail Modal -->
    <div v-if="selectedSummary" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Summary Details</h2>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <h3>Source Link</h3>
            <a :href="selectedSummary.link" target="_blank" class="source-link">
              {{ selectedSummary.link }}
            </a>
          </div>
          <div class="detail-section">
            <h3>Summary</h3>
            <div class="full-summary">
              {{ selectedSummary.summary }}
            </div>
          </div>
          <div class="detail-meta">
            <span class="detail-badge" :class="selectedSummary.length">{{ selectedSummary.length }} summary</span>
            <span class="detail-date">Generated on {{ formatFullDate(selectedSummary.timestamp) }}</span>
          </div>
        </div>
        <div class="modal-actions">
          <button class="action-btn copy-btn" @click="copySummary(selectedSummary.summary)">
            <i class="fas fa-copy"></i>
            Copy Summary
          </button>
          <button class="action-btn download-btn" @click="downloadSummaryPDF(selectedSummary)">
            <i class="fas fa-download"></i>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase.js'
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import jsPDF from 'jspdf'

export default {
  name: 'History',
  setup() {
    const router = useRouter()
    const summaries = ref([])
    const loading = ref(true)
    const selectedSummary = ref(null)
    let unsubscribe = null

    const sortedSummaries = computed(() => {
      return [...summaries.value].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
    })

    const formatDate = (timestamp) => {
      if (!timestamp) return ''
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }

    const formatFullDate = (timestamp) => {
      if (!timestamp) return ''
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const truncateLink = (link) => {
      if (link.length > 50) {
        return link.substring(0, 47) + '...'
      }
      return link
    }

    const truncateText = (text, length) => {
      if (text.length <= length) return text
      return text.substring(0, length) + '...'
    }

    const viewSummary = (summary) => {
      selectedSummary.value = summary
    }

    const closeModal = () => {
      selectedSummary.value = null
    }

    const copySummary = async (summaryText) => {
      try {
        await navigator.clipboard.writeText(summaryText)
        alert('Summary copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy summary:', err)
        alert('Failed to copy summary. Please try again.')
      }
    }

    const downloadSummaryPDF = (summary) => {
      try {
        const doc = new jsPDF()
        
        doc.setProperties({
          title: 'News Summary',
          subject: `${summary.length.charAt(0).toUpperCase() + summary.length.slice(1)} News Summary`,
          creator: 'AI News Summarizer'
        })
        
        const margin = 20
        let yPosition = margin
        const pageWidth = doc.internal.pageSize.getWidth()
        const maxWidth = pageWidth - (margin * 2)
        
        // Add title
        doc.setFontSize(20)
        doc.setFont('helvetica', 'bold')
        doc.text('News Summary', pageWidth / 2, yPosition, { align: 'center' })
        
        yPosition += 15
        
        // Add summary length
        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        doc.text(`Summary Type: ${summary.length.charAt(0).toUpperCase() + summary.length.slice(1)}`, margin, yPosition)
        
        yPosition += 10
        
        // Add date
        const date = summary.timestamp.toDate ? summary.timestamp.toDate() : new Date(summary.timestamp)
        const formattedDate = date.toLocaleDateString()
        doc.text(`Generated on: ${formattedDate}`, margin, yPosition)
        
        yPosition += 10
        
        // Add source link
        doc.text('Source:', margin, yPosition)
        const sourceLinkLines = doc.splitTextToSize(summary.link, maxWidth)
        sourceLinkLines.forEach((line, index) => {
          if (index === 0) {
            doc.text(line, margin + 25, yPosition)
          } else {
            yPosition += 7
            doc.text(line, margin, yPosition)
          }
        })
        yPosition += 10
        
        yPosition += 10
        
        // Add summary content
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        
        const splitText = doc.splitTextToSize(summary.summary, maxWidth)
        
        splitText.forEach(line => {
          if (yPosition > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage()
            yPosition = margin
          }
          
          doc.text(line, margin, yPosition)
          yPosition += 7
        })
        
        const fileName = `news-summary-${summary.length}-${Date.now()}.pdf`
        doc.save(fileName)
        
      } catch (err) {
        console.error('PDF generation error:', err)
        alert('Failed to generate PDF. Please try again.')
      }
    }

    const deleteSummary = async (summaryId) => {
      if (!confirm('Are you sure you want to delete this summary? This action cannot be undone.')) {
        return
      }

      try {
        await deleteDoc(doc(db, "summaries", summaryId))
        // The real-time listener will automatically update the list
        console.log('Summary deleted successfully')
      } catch (error) {
        console.error('Error deleting summary:', error)
        alert('Failed to delete summary. Please try again.')
      }
    }

    const loadSummaries = () => {
      const user = auth.currentUser
      
      if (!user) {
        router.push('/login')
        return
      }

      loading.value = true

      try {
        // Clean up previous listener if it exists
        if (unsubscribe) {
          unsubscribe()
        }

        // Simple query without composite index requirements
        // Just get all summaries for the user and sort client-side
        const q = query(
          collection(db, "summaries"),
          where("userId", "==", user.uid)
        )

        unsubscribe = onSnapshot(q, 
          (querySnapshot) => {
            summaries.value = []
            querySnapshot.forEach((doc) => {
              summaries.value.push({
                id: doc.id,
                ...doc.data()
              })
            })
            loading.value = false
            console.log('Loaded summaries:', summaries.value.length)
          }, 
          (firestoreError) => {
            console.error("Error fetching summaries:", firestoreError)
            loading.value = false
          }
        )
      } catch (err) {
        console.error('Error setting up listener:', err)
        loading.value = false
      }
    }

    onMounted(() => {
      // Wait for auth to be ready
      const unsubscribeAuth = auth.onAuthStateChanged((user) => {
        if (user) {
          loadSummaries()
        } else {
          router.push('/login')
        }
      })

      // Cleanup auth listener on unmount
      return () => {
        if (unsubscribeAuth) unsubscribeAuth()
        if (unsubscribe) unsubscribe()
      }
    })

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })

    return {
      summaries,
      sortedSummaries,
      loading,
      selectedSummary,
      formatDate,
      formatFullDate,
      truncateLink,
      truncateText,
      viewSummary,
      closeModal,
      copySummary,
      downloadSummaryPDF,
      deleteSummary
    }
  }
}
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  background: var(--light);
  padding: 2rem;
}

.history-container {
  max-width: 1200px;
  margin: 0 auto;
}

.history-header {
  text-align: center;
  margin-bottom: 3rem;
}

.history-header h1 {
  font-size: 2.5rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.history-header p {
  color: #666;
  font-size: 1.1rem;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--grey);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--grey);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background: var(--primary);
  transform: translateY(-2px);
}

.summaries-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.summary-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e1e1e1;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.summary-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.length-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  display: inline-block;
}

.length-badge.short {
  background: #e3f2fd;
  color: #1976d2;
}

.length-badge.standard {
  background: #e8f5e8;
  color: #2e7d32;
}

.length-badge.long {
  background: #fff3e0;
  color: #f57c00;
}

.timestamp {
  font-size: 0.8rem;
  color: #666;
}

.delete-btn {
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: #ffebee;
  color: #cc0000;
}

.link-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.link-preview i {
  color: var(--grey);
}

.link-text {
  color: #666;
  word-break: break-all;
}

.summary-text {
  line-height: 1.6;
  color: #333;
  margin-bottom: 1.5rem;
  max-height: 120px;
  overflow: hidden;
  position: relative;
}

.summary-text::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(transparent, white);
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
  flex: 1;
  justify-content: center;
}

.view-btn {
  background: var(--light);
  color: var(--primary);
  border: 1px solid var(--grey);
}

.view-btn:hover {
  background: var(--grey);
  color: var(--light);
}

.copy-btn {
  background: var(--primary);
  color: var(--light);
  border: 1px solid var(--primary);
}

.copy-btn:hover {
  background: var(--grey);
  color: var(--light);
  border-color: var(--grey);
}

.download-btn {
  background: var(--light);
  color: var(--primary);
  border: 1px solid var(--grey);
}

.download-btn:hover {
  background: var(--grey);
  color: var(--light);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e1e1e1;
}

.modal-header h2 {
  color: var(--primary);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  color: var(--primary);
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.source-link {
  color: var(--grey);
  text-decoration: none;
  word-break: break-all;
  display: block;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #e1e1e1;
}

.source-link:hover {
  color: var(--primary);
  text-decoration: underline;
}

.full-summary {
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #e1e1e1;
  max-height: 300px;
  overflow-y: auto;
}

.detail-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e1e1e1;
}

.detail-badge {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
}

.detail-badge.short {
  background: #e3f2fd;
  color: #1976d2;
}

.detail-badge.standard {
  background: #e8f5e8;
  color: #2e7d32;
}

.detail-badge.long {
  background: #fff3e0;
  color: #f57c00;
}

.detail-date {
  color: #666;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e1e1e1;
  background: #f8f9fa;
  border-radius: 0 0 1rem 1rem;
}

.modal-actions .action-btn {
  flex: 1;
}

@media (max-width: 768px) {
  .history-page {
    padding: 1rem;
  }

  .summaries-grid {
    grid-template-columns: 1fr;
  }

  .modal-overlay {
    padding: 1rem;
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-header,
  .modal-body,
  .modal-actions {
    padding: 1rem;
  }

  .detail-meta {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .history-header h1 {
    font-size: 2rem;
  }

  .summary-card {
    padding: 1rem;
  }

  .summary-actions {
    flex-direction: column;
  }
}
</style>