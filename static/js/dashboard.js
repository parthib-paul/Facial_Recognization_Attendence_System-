// Professional Dashboard JavaScript
document.addEventListener("DOMContentLoaded", () => {
  const trainBtn = document.getElementById("trainBtn");
  const trainProgress = document.getElementById("trainProgress");
  const progressText = document.getElementById("progressText");
  const trainMsg = document.getElementById("trainMsg");

  // Training status polling
  async function pollStatus() {
    try {
      const res = await fetch("/train_status");
      const data = await res.json();
      
      // Update progress bar
      trainProgress.style.width = data.progress + "%";
      progressText.textContent = data.progress + "%";
      
      // Update status message
      trainMsg.textContent = data.message || "Training in progress...";
      
      return data;
    } catch (e) {
      console.error("Status polling error:", e);
      trainMsg.textContent = "Unable to check training status";
      return null;
    }
  }

  // Training button handler
  trainBtn.addEventListener("click", async () => {
    trainBtn.disabled = true;
    trainBtn.textContent = "Starting...";
    
    try {
      const start = await fetch("/train_model");
      if (!start.ok && start.status !== 202) {
        throw new Error("Failed to start training");
      }
      
      trainMsg.textContent = "Training started...";
      
      // Poll for progress
      const pollInterval = setInterval(async () => {
        const status = await pollStatus();
        if (status && status.progress >= 100) {
          clearInterval(pollInterval);
          trainBtn.disabled = false;
          trainBtn.textContent = "Start Training";
          trainMsg.textContent = "Training completed successfully";
          showNotification("Model training completed", "success");
        }
      }, 2000);
      
    } catch (error) {
      trainBtn.disabled = false;
      trainBtn.textContent = "Start Training";
      trainMsg.textContent = "Training failed. Please try again.";
      showNotification("Training failed. Please try again.", "error");
    }
  });

  // Enhanced Chart
  let chart = null;
  async function updateChart() {
    try {
      const res = await fetch("/attendance_stats");
      const data = await res.json();
      const ctx = document.getElementById("attendanceChart").getContext("2d");
      
      if (!chart) {
        chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: data.dates,
            datasets: [{
              label: "Daily Attendance",
              data: data.counts,
              backgroundColor: 'rgba(102, 126, 234, 0.8)',
              borderColor: 'rgba(102, 126, 234, 1)',
              borderWidth: 2,
              borderRadius: 6,
              borderSkipped: false,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                  drawBorder: false
                },
                ticks: {
                  color: '#64748b'
                }
              },
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  color: '#64748b'
                }
              }
            },
            animation: {
              duration: 1500,
              easing: 'easeInOutQuart'
            }
          }
        });
      } else {
        chart.data.labels = data.dates;
        chart.data.datasets[0].data = data.counts;
        chart.update('active');
      }
    } catch (error) {
      console.error('Chart update failed:', error);
    }
  }

  // Update statistics with REAL data
  async function updateStats() {
    try {
      // Get students data
      const studentsRes = await fetch("/students");
      const studentsData = await studentsRes.json();
      
      // Update total students
      const totalStudentsEl = document.getElementById("totalStudents");
      if (totalStudentsEl) {
        animateNumber(totalStudentsEl, studentsData.students.length);
      }
      
      // Get REAL attendance data for today
      const today = new Date().toISOString().split('T')[0];
      const attendanceRes = await fetch(`/attendance_record?period=daily`);
      const attendanceData = await attendanceRes.text();
      
      // Parse attendance data to count today's records
      let todayAttendance = 0;
      try {
        // Create a temporary div to parse the HTML response
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = attendanceData;
        const records = tempDiv.querySelectorAll('tbody tr');
        todayAttendance = records.length;
      } catch (e) {
        console.log('Could not parse attendance data, using 0');
        todayAttendance = 0;
      }
      
      // Update today's attendance with REAL data
      const todayAttendanceEl = document.getElementById("todayAttendance");
      if (todayAttendanceEl) {
        animateNumber(todayAttendanceEl, todayAttendance);
      }
      
      // Update accuracy (mock data for now since we don't have real accuracy tracking)
      const accuracyEl = document.getElementById("accuracyRate");
      if (accuracyEl) {
        const accuracy = 95; // Fixed at 95% for now
        animateNumber(accuracyEl, accuracy, '%');
      }
      
    } catch (error) {
      console.error('Stats update failed:', error);
      
      // Fallback to basic student count
      const totalStudentsEl = document.getElementById("totalStudents");
      if (totalStudentsEl) {
        animateNumber(totalStudentsEl, 0);
      }
      
      const todayAttendanceEl = document.getElementById("todayAttendance");
      if (todayAttendanceEl) {
        animateNumber(todayAttendanceEl, 0);
      }
    }
  }

  // Animate number counting
  function animateNumber(element, targetValue, suffix = '') {
    const startValue = parseInt(element.textContent) || 0;
    const duration = 1500;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
      
      element.textContent = currentValue + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }
    
    requestAnimationFrame(updateNumber);
  }

  // Simple notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: none;
      border-radius: 8px;
    `;
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 4000);
  }

  // Initialize dashboard
  updateChart();
  updateStats();
  
  // Update chart every 30 seconds
  setInterval(updateChart, 30000);
  
  // Update stats every 60 seconds
  setInterval(updateStats, 60000);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 't':
          e.preventDefault();
          if (!trainBtn.disabled) trainBtn.click();
          break;
        case 'a':
          e.preventDefault();
          window.location.href = '/add_student';
          break;
        case 'm':
          e.preventDefault();
          window.location.href = '/mark_attendance';
          break;
        case 'r':
          e.preventDefault();
          window.location.href = '/attendance_record';
          break;
      }
    }
  });
});
