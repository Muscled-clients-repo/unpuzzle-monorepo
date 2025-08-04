class MeetingBooking {
  constructor() {
    this.stripe = Stripe('pk_test_51RebMZ2fB4WJ1ELeiZQXVTkzG3TZFKJpzmvD2QHc5rAwM16TSUcBMe1NDoENz1d1aeKmthsIWfGOKLUsAd8wvW4R00JRu8RYP4');
    this.elements = this.stripe.elements();
    this.currentMeeting = null;
    this.currentSession = null;
    this.sessionTimer = null;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadInstructors();
  }

  setupEventListeners() {
    // Booking form
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => this.handleBookingSubmit(e));
    }

    // Instructor selection
    const instructorSelect = document.getElementById('instructor-select');
    if (instructorSelect) {
      instructorSelect.addEventListener('change', (e) => this.handleInstructorChange(e));
    }

    // Meeting controls
    const startMeetingBtn = document.getElementById('start-meeting-btn');
    if (startMeetingBtn) {
      startMeetingBtn.addEventListener('click', () => this.startMeeting());
    }

    const endMeetingBtn = document.getElementById('end-meeting-btn');
    if (endMeetingBtn) {
      endMeetingBtn.addEventListener('click', () => this.endMeeting());
    }

    // Payment form
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
      paymentForm.addEventListener('submit', (e) => this.handlePaymentSubmit(e));
    }
  }

  async loadInstructors() {
    try {
      const response = await fetch('/api/users?role=instructor');
      const data = await response.json();
      
      if (data.success) {
        this.renderInstructors(data.data);
      }
    } catch (error) {
      console.error('Error loading instructors:', error);
    }
  }

  renderInstructors(instructors) {
    const container = document.getElementById('instructors-container');
    if (!container) return;

    container.innerHTML = instructors.map(instructor => `
      <div class="instructor-card" data-instructor-id="${instructor.id}">
        <div class="instructor-avatar">
          <img src="${instructor.image_url || '/img/ai-avatar.png'}" alt="${instructor.first_name}">
        </div>
        <div class="instructor-info">
          <h3>${instructor.first_name} ${instructor.last_name}</h3>
          <p class="instructor-bio">${instructor.bio || 'No bio available'}</p>
          <p class="instructor-rate">$${instructor.hourly_rate}/hour</p>
          <div class="instructor-expertise">
            ${instructor.expertise?.map(skill => `<span class="skill-tag">${skill}</span>`).join('') || ''}
          </div>
          <button class="book-btn" onclick="meetingBooking.showBookingForm('${instructor.id}')">
            Book Meeting
          </button>
        </div>
      </div>
    `).join('');
  }

  showBookingForm(instructorId) {
    const modal = document.getElementById('booking-modal');
    if (modal) {
      modal.style.display = 'block';
      document.getElementById('instructor-id').value = instructorId;
      this.loadInstructorAvailability(instructorId);
    }
  }

  async loadInstructorAvailability(instructorId) {
    try {
      const response = await fetch(`/api/meetings/instructor/${instructorId}/availability`);
      const data = await response.json();
      
      if (data.success) {
        this.renderAvailabilityCalendar(data.data);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
    }
  }

  renderAvailabilityCalendar(availability) {
    const calendar = document.getElementById('availability-calendar');
    if (!calendar) return;

    // Simple calendar implementation
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    
    calendar.innerHTML = days.map((day, index) => {
      const dayAvailability = availability.find(a => a.day_of_week === index);
      const isAvailable = dayAvailability && dayAvailability.is_available;
      
      return `
        <div class="calendar-day ${isAvailable ? 'available' : 'unavailable'}">
          <h4>${day}</h4>
          ${isAvailable ? `
            <p>${dayAvailability.start_time} - ${dayAvailability.end_time}</p>
            <button onclick="meetingBooking.selectTimeSlot(${index}, '${dayAvailability.start_time}', '${dayAvailability.end_time}')">
              Select Time
            </button>
          ` : '<p>Not available</p>'}
        </div>
      `;
    }).join('');
  }

  selectTimeSlot(dayOfWeek, startTime, endTime) {
    const dateInput = document.getElementById('meeting-date');
    const timeInput = document.getElementById('meeting-time');
    
    // Set next occurrence of this day
    const today = new Date();
    const targetDay = new Date(today);
    targetDay.setDate(today.getDate() + (dayOfWeek + 7 - today.getDay()) % 7);
    
    dateInput.value = targetDay.toISOString().split('T')[0];
    timeInput.value = startTime;
    
    this.updatePriceEstimate();
  }

  updatePriceEstimate() {
    const duration = parseInt(document.getElementById('meeting-duration').value) || 60;
    const instructorId = document.getElementById('instructor-id').value;
    
    // Get instructor rate from the instructor card
    const instructorCard = document.querySelector(`[data-instructor-id="${instructorId}"]`);
    const rateElement = instructorCard?.querySelector('.instructor-rate');
    const hourlyRate = parseFloat(rateElement?.textContent.match(/\$(\d+)/)?.[1]) || 50;
    
    const pricePerMinute = hourlyRate / 60;
    const totalPrice = pricePerMinute * duration;
    
    const priceDisplay = document.getElementById('price-estimate');
    if (priceDisplay) {
      priceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
    }
  }

  async handleBookingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = {
      instructor_id: formData.get('instructor_id'),
      start_time: new Date(`${formData.get('meeting_date')}T${formData.get('meeting_time')}`).toISOString(),
      duration_minutes: parseInt(formData.get('meeting_duration')),
      notes: formData.get('meeting_notes')
    };

    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();
      
      if (data.success) {
        this.currentMeeting = data.data.meeting;
        this.showPaymentForm(data.data.payment_intent);
      } else {
        alert('Booking failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    }
  }

  showPaymentForm(paymentIntent) {
    const bookingModal = document.getElementById('booking-modal');
    const paymentModal = document.getElementById('payment-modal');
    
    if (bookingModal) bookingModal.style.display = 'none';
    if (paymentModal) paymentModal.style.display = 'block';
    
    // Store payment intent for later use
    this.currentPaymentIntent = paymentIntent;
  }

  async handlePaymentSubmit(e) {
    e.preventDefault();
    
    const cardElement = this.elements.create('card');
    cardElement.mount('#card-element');
    
    try {
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(
        this.currentPaymentIntent.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: document.getElementById('cardholder-name').value,
            },
          },
        }
      );

      if (error) {
        alert('Payment failed: ' + error.message);
      } else if (paymentIntent.status === 'succeeded') {
        this.handlePaymentSuccess(paymentIntent);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed');
    }
  }

  async handlePaymentSuccess(paymentIntent) {
    // Update meeting payment status
    try {
      await fetch(`/api/meetings/${this.currentMeeting.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_status: 'paid'
        })
      });
      
      this.showBookingConfirmation();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  }

  showBookingConfirmation() {
    const paymentModal = document.getElementById('payment-modal');
    const confirmationModal = document.getElementById('confirmation-modal');
    
    if (paymentModal) paymentModal.style.display = 'none';
    if (confirmationModal) confirmationModal.style.display = 'block';
    
    // Show meeting details
    const meetingDetails = document.getElementById('meeting-details');
    if (meetingDetails && this.currentMeeting) {
      meetingDetails.innerHTML = `
        <h3>Meeting Confirmed!</h3>
        <p><strong>Date:</strong> ${new Date(this.currentMeeting.start_time).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${new Date(this.currentMeeting.start_time).toLocaleTimeString()}</p>
        <p><strong>Duration:</strong> ${this.currentMeeting.actual_duration_minutes} minutes</p>
        <p><strong>Total:</strong> $${this.currentMeeting.total_amount}</p>
        <button onclick="meetingBooking.viewMyMeetings()">View My Meetings</button>
      `;
    }
  }

  async startMeeting() {
    if (!this.currentMeeting) return;
    
    try {
      const response = await fetch(`/api/meetings/${this.currentMeeting.id}/session/start`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.currentSession = data.data;
        this.startSessionTimer();
        this.updateMeetingUI('in_progress');
      }
    } catch (error) {
      console.error('Error starting meeting:', error);
    }
  }

  async endMeeting() {
    if (!this.currentSession) return;
    
    try {
      const response = await fetch(`/api/meetings/session/${this.currentSession.id}/end`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meeting_id: this.currentMeeting.id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.stopSessionTimer();
        this.updateMeetingUI('completed');
        this.showMeetingSummary(data.data);
      }
    } catch (error) {
      console.error('Error ending meeting:', error);
    }
  }

  startSessionTimer() {
    const timerDisplay = document.getElementById('session-timer');
    let seconds = 0;
    
    this.sessionTimer = setInterval(() => {
      seconds++;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      if (timerDisplay) {
        timerDisplay.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  stopSessionTimer() {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  updateMeetingUI(status) {
    const startBtn = document.getElementById('start-meeting-btn');
    const endBtn = document.getElementById('end-meeting-btn');
    const statusDisplay = document.getElementById('meeting-status');
    
    if (statusDisplay) {
      statusDisplay.textContent = status.replace('_', ' ').toUpperCase();
    }
    
    if (startBtn) startBtn.style.display = status === 'scheduled' ? 'block' : 'none';
    if (endBtn) endBtn.style.display = status === 'in_progress' ? 'block' : 'none';
  }

  showMeetingSummary(sessionData) {
    const summaryModal = document.getElementById('summary-modal');
    if (summaryModal) {
      summaryModal.style.display = 'block';
      
      const summaryContent = document.getElementById('summary-content');
      if (summaryContent) {
        summaryContent.innerHTML = `
          <h3>Meeting Complete!</h3>
          <p><strong>Duration:</strong> ${sessionData.duration_minutes} minutes</p>
          <p><strong>Total Charge:</strong> $${sessionData.total_amount}</p>
          <button onclick="meetingBooking.closeSummary()">Close</button>
        `;
      }
    }
  }

  closeSummary() {
    const summaryModal = document.getElementById('summary-modal');
    if (summaryModal) {
      summaryModal.style.display = 'none';
    }
  }

  async viewMyMeetings() {
    try {
      const response = await fetch('/api/meetings/my/meetings');
      const data = await response.json();
      
      if (data.success) {
        this.renderMyMeetings(data.data);
      }
    } catch (error) {
      console.error('Error loading meetings:', error);
    }
  }

  renderMyMeetings(meetings) {
    const container = document.getElementById('my-meetings-container');
    if (!container) return;

    container.innerHTML = meetings.map(meeting => `
      <div class="meeting-card ${meeting.status}">
        <div class="meeting-header">
          <h4>Meeting with ${meeting.instructor?.first_name} ${meeting.instructor?.last_name}</h4>
          <span class="status-badge ${meeting.status}">${meeting.status}</span>
        </div>
        <div class="meeting-details">
          <p><strong>Date:</strong> ${new Date(meeting.start_time).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${new Date(meeting.start_time).toLocaleTimeString()}</p>
          <p><strong>Duration:</strong> ${meeting.actual_duration_minutes} minutes</p>
          <p><strong>Total:</strong> $${meeting.total_amount}</p>
        </div>
        <div class="meeting-actions">
          ${meeting.status === 'scheduled' ? `
            <button onclick="meetingBooking.startMeeting('${meeting.id}')">Start Meeting</button>
            <button onclick="meetingBooking.cancelMeeting('${meeting.id}')">Cancel</button>
          ` : ''}
          ${meeting.status === 'in_progress' ? `
            <button onclick="meetingBooking.endMeeting('${meeting.id}')">End Meeting</button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  async cancelMeeting(meetingId) {
    if (!confirm('Are you sure you want to cancel this meeting?')) return;
    
    try {
      const response = await fetch(`/api/meetings/${meetingId}/cancel`, {
        method: 'PATCH'
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.viewMyMeetings(); // Refresh the list
      }
    } catch (error) {
      console.error('Error cancelling meeting:', error);
    }
  }
}

// Initialize the meeting booking system
const meetingBooking = new MeetingBooking(); 