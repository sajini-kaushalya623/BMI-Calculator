// ==================== DOM ELEMENTS ====================
const bmiForm = document.getElementById('bmiForm');
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const resetBtn = document.getElementById('resetBtn');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const resultSection = document.getElementById('resultSection');
const bmiValue = document.getElementById('bmiValue');
const bmiCategory = document.getElementById('bmiCategory');
const bmiDescription = document.getElementById('bmiDescription');
const healthTip = document.getElementById('healthTip');
const tipText = document.getElementById('tipText');

// ==================== EVENT LISTENERS ====================

// Form submission
bmiForm.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateBMI();
});

// Reset button
resetBtn.addEventListener('click', resetCalculator);

// Clear error on input
weightInput.addEventListener('input', hideError);
heightInput.addEventListener('input', hideError);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        resetCalculator();
    }
});

// Auto-focus on load
window.addEventListener('load', function() {
    weightInput.focus();
});

// ==================== MAIN FUNCTIONS ====================

/**
 * Calculate BMI based on weight and height inputs
 */
function calculateBMI() {
    // Get input values
    const weight = parseFloat(weightInput.value);
    const heightCm = parseFloat(heightInput.value);

    // Validate inputs
    if (!validateInputs(weight, heightCm)) {
        showError('Please enter valid weight and height values!');
        hideResult();
        return;
    }

    // Convert height from cm to meters
    const heightM = heightCm / 100;

    // Calculate BMI: weight (kg) / height² (m²)
    const bmi = weight / (heightM * heightM);

    // Round to 2 decimal places
    const bmiRounded = bmi.toFixed(2);

    // Get BMI category information
    const categoryInfo = getBMICategory(bmi);

    // Display results
    displayResult(bmiRounded, categoryInfo);

    // Hide error if shown
    hideError();

    // Scroll to result (smooth scroll)
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Validate user inputs
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {boolean} - True if valid, false otherwise
 */
function validateInputs(weight, height) {
    // Check if values are numbers
    if (isNaN(weight) || isNaN(height)) {
        return false;
    }

    // Check if weight is in valid range (1-500 kg)
    if (weight <= 0 || weight > 500) {
        showError('Weight must be between 1 and 500 kg!');
        return false;
    }

    // Check if height is in valid range (1-300 cm)
    if (height <= 0 || height > 300) {
        showError('Height must be between 1 and 300 cm!');
        return false;
    }

    return true;
}

/**
 * Get BMI category and related information
 * @param {number} bmi - Calculated BMI value
 * @returns {object} - Category information object
 */
function getBMICategory(bmi) {
    let category, description, className, tip;

    if (bmi < 18.5) {
        // Underweight
        category = 'Underweight';
        description = 'You may need to gain weight. A balanced diet with more calories and strength training can help.';
        className = 'underweight';
        tip = 'Focus on nutrient-dense foods and consider consulting a nutritionist.';
    } 
    else if (bmi >= 18.5 && bmi <= 24.9) {
        // Normal weight
        category = 'Normal Weight';
        description = 'Congratulations! You have a healthy weight. Keep up the good work with balanced nutrition and regular exercise.';
        className = 'normal';
        tip = 'Maintain your healthy lifestyle with regular physical activity and balanced meals.';
    } 
    else if (bmi >= 25 && bmi <= 29.9) {
        // Overweight
        category = 'Overweight';
        description = 'You may benefit from losing some weight. Consider a balanced diet and increased physical activity.';
        className = 'overweight';
        tip = 'Aim for 30 minutes of moderate exercise daily and reduce processed foods.';
    } 
    else {
        // Obese (BMI >= 30)
        category = 'Obese';
        description = 'Your health may be at risk. Please consult with a healthcare provider for personalized guidance and support.';
        className = 'obese';
        tip = 'Seek professional medical advice for a safe and effective weight management plan.';
    }

    return {
        category: category,
        description: description,
        className: className,
        tip: tip
    };
}

/**
 * Display the calculated result
 * @param {string} bmi - BMI value (formatted string)
 * @param {object} info - Category information object
 */
function displayResult(bmi, info) {
    // Update result values
    bmiValue.textContent = bmi;
    bmiCategory.textContent = info.category;
    bmiDescription.textContent = info.description;
    tipText.textContent = info.tip;

    // Remove all category classes
    resultSection.classList.remove('underweight', 'normal', 'overweight', 'obese');
    
    // Add new category class
    resultSection.classList.add(info.className);

    // Show result section
    resultSection.classList.add('show');
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message = 'Please enter valid values!') {
    errorText.textContent = message;
    errorMessage.classList.add('show');
}

/**
 * Hide error message
 */
function hideError() {
    errorMessage.classList.remove('show');
}

/**
 * Hide result section
 */
function hideResult() {
    resultSection.classList.remove('show');
}

/**
 * Reset calculator to initial state
 */
function resetCalculator() {
    // Clear inputs
    weightInput.value = '';
    heightInput.value = '';

    // Hide error and result
    hideError();
    hideResult();

    // Focus on weight input
    weightInput.focus();

    // Optional: Show reset confirmation
    console.log('Calculator reset successfully');
}

/**
 * Format number to 2 decimal places
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
function formatNumber(num) {
    return num.toFixed(2);
}

/**
 * Log calculation for analytics (optional)
 * @param {number} bmi - BMI value
 * @param {string} category - BMI category
 */
function logCalculation(bmi, category) {
    const timestamp = new Date().toISOString();
    console.log(`BMI Calculated: ${bmi} | Category: ${category} | Time: ${timestamp}`);
    
    // You can extend this to save to localStorage or send to analytics
    // saveToLocalStorage(bmi, category, timestamp);
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Save calculation history to localStorage (optional feature)
 */
function saveToLocalStorage(bmi, category, timestamp) {
    let history = JSON.parse(localStorage.getItem('bmiHistory')) || [];
    
    history.push({
        bmi: bmi,
        category: category,
        timestamp: timestamp
    });
    
    // Keep only last 10 calculations
    if (history.length > 10) {
        history = history.slice(-10);
    }
    
    localStorage.setItem('bmiHistory', JSON.stringify(history));
}

/**
 * Load calculation history from localStorage (optional feature)
 */
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('bmiHistory')) || [];
    return history;
}

// ==================== INITIALIZATION ====================

/**
 * Initialize the calculator
 */
function init() {
    console.log('BMI Calculator initialized');
    
    // Optional: Load previous calculations
    // const history = loadHistory();
    // console.log('Previous calculations:', history);
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
```

---

## 📂 **PROJECT FOLDER STRUCTURE**
```
bmi-calculator/
│
├── index.html          # Main HTML file
├── style.css           # Stylesheet
├── script.js           # JavaScript logic
└── README.md           # Documentation (optional)