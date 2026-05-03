// Timer state variables
let timerInterval = null;      // Stores the interval ID
let elapsedSeconds = 0;        // Total seconds elapsed (HH:MM:SS)
let isRunning = false;         // Tracks if timer is actively counting
let currentStatus = "Reset";   // "Running", "Paused", or "Reset"

// DOM elements
const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const statusBadge = document.getElementById("statusValue");

// HELPER FUNCTIONS 
/**
 * Converts total seconds into "HH:MM:SS" format with leading zeros.
 * @param {number} totalSeconds - seconds elapsed (non-negative)
 * @returns {string} formatted time string (e.g., "01:05:09")
 */
function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Updates the timer display based on current elapsedSeconds.
 */
function updateDisplay() {
  timerDisplay.textContent = formatTime(elapsedSeconds);
}

/**
 * Updates the dynamic status badge with the correct text and styling touch.
 * Status changes: "Running", "Paused", "Reset"
 */
function updateStatusUI() {
  statusBadge.textContent = currentStatus;
  // optional: add a data attribute for extra CSS flair (already handled by badge)
  statusBadge.setAttribute("data-status", currentStatus.toLowerCase());
}

/**
 * Stops the timer interval if it exists and resets the interval variable.
 * Does NOT change elapsedSeconds or status flags.
 */
function stopTimerInterval() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

/**
 * Starts the timer interval (only if timer is not already running).
 * The interval increments elapsedSeconds every second and updates display.
 */
function startTimerInterval() {
  // Avoid duplicate intervals
  if (timerInterval !== null) return;
  
  timerInterval = setInterval(function() {
    // Increment seconds only if timer is marked as running
    // (extra safety: check isRunning inside interval as well)
    if (isRunning) {
      elapsedSeconds++;
      updateDisplay();
    }
  }, 1000);
}

// CORE TIMER ACTIONS 

/**
 * Start action: resume counting from current elapsed seconds.
 * - If status is Reset or Paused, begin counting.
 * - Updates status to "Running", ensures interval is active.
 */
function startTimer() {
  // Already running? do nothing
  if (isRunning) return;
  
  // If timer was reset (elapsedSeconds = 0) or paused, start counting
  isRunning = true;
  currentStatus = "Running";
  updateStatusUI();
  
  // Ensure the interval is alive (if stopped by pause/reset)
  if (timerInterval === null) {
    startTimerInterval();
  }
}

/**
 * Pause action: freeze the timer without resetting value.
 * - Only works if timer is currently Running.
 * - Updates status to "Paused", stops interval but keeps elapsedSeconds.
 */
function pauseTimer() {
  if (!isRunning) return;   // cannot pause if already paused or reset
  
  isRunning = false;
  currentStatus = "Paused";
  updateStatusUI();
  
  // Stop the ticking interval (keeps elapsedSeconds unchanged)
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

/**
 * Reset action: stop timer, set display and elapsedSeconds to zero.
 * - Status becomes "Reset".
 * - Clears any ongoing interval and disables running flag.
 */
function resetTimer() {
  // Stop any active interval first
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  // Reset all state variables
  isRunning = false;
  elapsedSeconds = 0;
  currentStatus = "Reset";
  
  // Update UI: display zero and fresh status
  updateDisplay();
  updateStatusUI();
}

// EVENT LISTENERS (Anonymous Functions)

// Button listeners (mouse & touch) 
// Start button: binds anonymous function
startBtn.addEventListener("click", function() {
  startTimer();
});

// Pause button: anonymous function to pause
pauseBtn.addEventListener("click", function() {
  pauseTimer();
});

// Reset button: anonymous reset routine
resetBtn.addEventListener("click", function() {
  resetTimer();
});

// --- Keyboard shortcuts (S, P, R) ---
// Using event-driven approach on whole window
window.addEventListener("keydown", function(event) {
  const key = event.key;
  // Support lowercase and uppercase (S, s, P, p, R, r)
  if (key === "s" || key === "S") {
    event.preventDefault();   // prevent browser "save as" or find-in-page
    startTimer();
  } else if (key === "p" || key === "P") {
    event.preventDefault();   // avoid print dialog
    pauseTimer();
  } else if (key === "r" || key === "R") {
    event.preventDefault();   // prevent browser reload (Ctrl+R is unaffected, but standalone R is safe)
    resetTimer();
  }
});

// INITIAL UI SETUP 
// Set initial timer display to 00:00:00, status "Reset"
updateDisplay();
updateStatusUI();
