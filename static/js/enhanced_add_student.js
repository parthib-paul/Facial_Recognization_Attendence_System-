// Enhanced Add Student with Duplicate Prevention
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("studentForm");
  const submitBtn = document.getElementById("saveInfoBtn");
  const nameInput = document.getElementById("name");
  const rollInput = document.getElementById("roll");
  const regNoInput = document.getElementById("reg_no");
  
  // Real-time duplicate checking
  let duplicateCheckTimeout;
  
  nameInput.addEventListener('input', () => {
    clearTimeout(duplicateCheckTimeout);
    duplicateCheckTimeout = setTimeout(checkForDuplicates, 500);
  });
  
  rollInput.addEventListener('input', () => {
    clearTimeout(duplicateCheckTimeout);
    duplicateCheckTimeout = setTimeout(checkForDuplicates, 500);
  });
  
  regNoInput.addEventListener('input', () => {
    clearTimeout(duplicateCheckTimeout);
    duplicateCheckTimeout = setTimeout(checkForDuplicates, 500);
  });
  
  async function checkForDuplicates() {
    const name = nameInput.value.trim();
    const roll = rollInput.value.trim();
    const regNo = regNoInput.value.trim();
    
    if (!name) return;
    
    try {
      const response = await fetch('/check_duplicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, roll, regNo })
      });
      
      const result = await response.json();
      
      if (result.duplicate) {
        showDuplicateWarning(result);
        submitBtn.disabled = true;
      } else {
        hideDuplicateWarning();
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error('Duplicate check failed:', error);
    }
  }
  
  function showDuplicateWarning(result) {
    let warningDiv = document.getElementById('duplicate-warning');
    if (!warningDiv) {
      warningDiv = document.createElement('div');
      warningDiv.id = 'duplicate-warning';
      warningDiv.className = 'alert alert-warning mt-3';
      form.appendChild(warningDiv);
    }
    
    let warningText = '⚠️ Potential duplicate found:<br>';
    if (result.exact_name) {
      warningText += `• Student with name "${result.exact_name.name}" already exists<br>`;
    }
    if (result.roll_number) {
      warningText += `• Roll number "${result.roll_number.roll}" is already used<br>`;
    }
    if (result.reg_number) {
      warningText += `• Registration number "${result.reg_number.reg_no}" is already used<br>`;
    }
    
    warningDiv.innerHTML = warningText;
  }
  
  function hideDuplicateWarning() {
    const warningDiv = document.getElementById('duplicate-warning');
    if (warningDiv) {
      warningDiv.remove();
    }
  }
  
  // Enhanced form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Disable submit button to prevent double submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...';
    
    const formData = new FormData(form);
    
    try {
      const response = await fetch("/add_student", {
        method: "POST",
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Success
        showSuccessMessage(result.message);
        form.reset();
        hideDuplicateWarning();
        
        // Enable next step
        document.getElementById("startCaptureBtn").disabled = false;
        
      } else if (response.status === 409) {
        // Duplicate error
        showErrorMessage(result.message);
        
      } else if (response.status === 400) {
        // Validation error
        showValidationErrors(result.details);
        
      } else {
        // Other error
        showErrorMessage(result.error || "Failed to save student");
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      showErrorMessage("Network error. Please try again.");
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Save Student Info';
    }
  });
  
  function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
      ✅ ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    form.insertBefore(alertDiv, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
  }
  
  function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
      ❌ ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    form.insertBefore(alertDiv, form.firstChild);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 8000);
  }
  
  function showValidationErrors(errors) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-danger alert-dismissible fade show';
    alertDiv.innerHTML = `
      ❌ Validation Errors:<br>
      ${errors.map(error => `• ${error}`).join('<br>')}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    form.insertBefore(alertDiv, form.firstChild);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 10000);
  }
});
