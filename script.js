/**
 * MENTAL RELIEF - INTERACTIVE FEATURES
 * Simple JavaScript for breathing animation, text release, and sound controls
 */

// ============================================
// BREATHING ANIMATION CONTROLLER
// ============================================

class BreathingController {
    constructor() {
        this.circle = document.querySelector('.breathing-circle');
        this.toggleBtn = document.getElementById('breathingToggle');
        this.breathingText = document.querySelector('.breathing-text');
        this.isBreathing = false;
        this.breathingPhases = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
        this.currentPhase = 0;
        this.phaseInterval = null;
        
        this.init();
    }
    
    init() {
        this.toggleBtn.addEventListener('click', () => this.toggle());
    }
    
    toggle() {
        if (this.isBreathing) {
            this.stop();
        } else {
            this.start();
        }
    }
    
    start() {
        this.isBreathing = true;
        this.circle.classList.add('breathing');
        this.toggleBtn.textContent = 'Stop';
        this.toggleBtn.setAttribute('aria-pressed', 'true');
        
        // Update text every 2 seconds (8s cycle / 4 phases)
        this.updateBreathingText();
        this.phaseInterval = setInterval(() => {
            this.updateBreathingText();
        }, 2000);
    }
    
    stop() {
        this.isBreathing = false;
        this.circle.classList.remove('breathing');
        this.toggleBtn.textContent = 'Start Breathing';
        this.toggleBtn.setAttribute('aria-pressed', 'false');
        this.breathingText.textContent = 'Breathe';
        this.currentPhase = 0;
        
        if (this.phaseInterval) {
            clearInterval(this.phaseInterval);
            this.phaseInterval = null;
        }
    }
    
    updateBreathingText() {
        this.breathingText.textContent = this.breathingPhases[this.currentPhase];
        this.currentPhase = (this.currentPhase + 1) % this.breathingPhases.length;
    }
}

// ============================================
// TEXT RELEASE CONTROLLER
// ============================================

class TextReleaseController {
    constructor() {
        this.textarea = document.getElementById('releaseText');
        this.clearBtn = document.getElementById('clearText');
        this.charCount = document.querySelector('.char-count');
        
        this.init();
    }
    
    init() {
        // Update character count
        this.textarea.addEventListener('input', () => this.updateCharCount());
        
        // Clear and release button
        this.clearBtn.addEventListener('click', () => this.clearText());
        
        // Initial count
        this.updateCharCount();
    }
    
    updateCharCount() {
        const length = this.textarea.value.length;
        this.charCount.textContent = `${length} / 1000`;
    }
    
    clearText() {
        if (this.textarea.value.trim() === '') {
            return;
        }
        
        // Gentle fade-out animation
        this.textarea.style.transition = 'opacity 0.5s ease-out';
        this.textarea.style.opacity = '0.3';
        
        setTimeout(() => {
            this.textarea.value = '';
            this.updateCharCount();
            this.textarea.style.opacity = '1';
            this.textarea.focus();
            
            // Optional: Show brief confirmation
            this.showConfirmation();
        }, 500);
    }
    
    showConfirmation() {
        const originalText = this.clearBtn.textContent;
        this.clearBtn.textContent = '✓ Released';
        this.clearBtn.style.backgroundColor = '#81C784';
        
        setTimeout(() => {
            this.clearBtn.textContent = originalText;
            this.clearBtn.style.backgroundColor = '';
        }, 2000);
    }
}

// ============================================
// AFFIRMATION CONTROLLER
// ============================================

class AffirmationController {
    constructor() {
        this.input = document.getElementById('affirmationInput');
        this.addBtn = document.getElementById('addAffirmation');
        this.list = document.getElementById('affirmationsList');
        this.affirmations = [];
        
        // Load saved affirmations from localStorage
        this.loadFromStorage();
        this.init();
    }
    
    init() {
        // Add button click
        this.addBtn.addEventListener('click', () => this.addAffirmation());
        
        // Enter key to add
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addAffirmation();
            }
        });
        
        // Render existing affirmations
        this.render();
    }
    
    addAffirmation() {
        const text = this.input.value.trim();
        
        if (text === '') {
            this.input.focus();
            return;
        }
        
        // Create affirmation object
        const affirmation = {
            id: Date.now(),
            text: text,
            createdAt: new Date().toISOString()
        };
        
        // Add to array
        this.affirmations.unshift(affirmation);
        
        // Clear input
        this.input.value = '';
        this.input.focus();
        
        // Save and render
        this.saveToStorage();
        this.render();
        
        // Optional: Show brief feedback
        this.showAddedFeedback();
    }
    
    removeAffirmation(id) {
        // Find and remove
        this.affirmations = this.affirmations.filter(aff => aff.id !== id);
        
        // Save and render
        this.saveToStorage();
        this.render();
    }
    
    render() {
        // Clear list
        this.list.innerHTML = '';
        
        // Render each affirmation
        this.affirmations.forEach(affirmation => {
            const item = this.createAffirmationElement(affirmation);
            this.list.appendChild(item);
        });
    }
    
    createAffirmationElement(affirmation) {
        const div = document.createElement('div');
        div.className = 'affirmation-item';
        div.role = 'listitem';
        
        const text = document.createElement('span');
        text.className = 'affirmation-text';
        text.textContent = affirmation.text;
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'affirmation-remove';
        removeBtn.innerHTML = '×';
        removeBtn.setAttribute('aria-label', 'Remove affirmation');
        removeBtn.addEventListener('click', () => this.removeAffirmation(affirmation.id));
        
        div.appendChild(text);
        div.appendChild(removeBtn);
        
        return div;
    }
    
    saveToStorage() {
        try {
            localStorage.setItem('mentalReliefAffirmations', JSON.stringify(this.affirmations));
        } catch (e) {
            console.warn('Could not save affirmations to localStorage:', e);
        }
    }
    
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('mentalReliefAffirmations');
            if (saved) {
                this.affirmations = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load affirmations from localStorage:', e);
            this.affirmations = [];
        }
    }
    
    showAddedFeedback() {
        const originalText = this.addBtn.textContent;
        this.addBtn.textContent = '✓ Added';
        this.addBtn.style.backgroundColor = '#66BB6A';
        
        setTimeout(() => {
            this.addBtn.textContent = originalText;
            this.addBtn.style.backgroundColor = '';
        }, 1500);
    }
}

// ============================================
// GRATITUDE JOURNAL CONTROLLER
// ============================================

class GratitudeController {
    constructor() {
        this.dateElement = document.getElementById('gratitudeDate');
        this.input1 = document.getElementById('gratitude1');
        this.input2 = document.getElementById('gratitude2');
        this.input3 = document.getElementById('gratitude3');
        this.saveBtn = document.getElementById('saveGratitude');
        this.historyContainer = document.getElementById('gratitudeHistory');
        this.entries = [];
        
        this.loadFromStorage();
        this.init();
    }
    
    init() {
        // Set today's date
        this.updateDate();
        
        // Load today's entry if exists
        this.loadTodayEntry();
        
        // Save button
        this.saveBtn.addEventListener('click', () => this.saveGratitude());
        
        // Enter key to move to next field
        this.input1.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.input2.focus();
            }
        });
        
        this.input2.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.input3.focus();
            }
        });
        
        this.input3.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.saveGratitude();
            }
        });
        
        // Render history
        this.renderHistory();
    }
    
    updateDate() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        this.dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
    
    getTodayKey() {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD
    }
    
    saveGratitude() {
        const item1 = this.input1.value.trim();
        const item2 = this.input2.value.trim();
        const item3 = this.input3.value.trim();
        
        // At least one item must be filled
        if (!item1 && !item2 && !item3) {
            this.input1.focus();
            return;
        }
        
        const entry = {
            date: this.getTodayKey(),
            displayDate: new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
            }),
            items: [item1, item2, item3].filter(item => item !== ''),
            timestamp: Date.now()
        };
        
        // Remove existing entry for today if any
        this.entries = this.entries.filter(e => e.date !== entry.date);
        
        // Add new entry at the beginning
        this.entries.unshift(entry);
        
        // Keep only last 7 days
        this.entries = this.entries.slice(0, 7);
        
        // Save and render
        this.saveToStorage();
        this.renderHistory();
        this.showSavedFeedback();
        
        // Optional: Clear inputs
        // this.clearInputs();
    }
    
    loadTodayEntry() {
        const todayKey = this.getTodayKey();
        const todayEntry = this.entries.find(e => e.date === todayKey);
        
        if (todayEntry) {
            this.input1.value = todayEntry.items[0] || '';
            this.input2.value = todayEntry.items[1] || '';
            this.input3.value = todayEntry.items[2] || '';
        }
    }
    
    clearInputs() {
        this.input1.value = '';
        this.input2.value = '';
        this.input3.value = '';
        this.input1.focus();
    }
    
    renderHistory() {
        this.historyContainer.innerHTML = '';
        
        // Show last 5 entries (excluding today)
        const todayKey = this.getTodayKey();
        const pastEntries = this.entries.filter(e => e.date !== todayKey).slice(0, 5);
        
        pastEntries.forEach(entry => {
            const element = this.createEntryElement(entry);
            this.historyContainer.appendChild(element);
        });
    }
    
    createEntryElement(entry) {
        const div = document.createElement('div');
        div.className = 'gratitude-entry';
        
        const date = document.createElement('div');
        date.className = 'gratitude-entry-date';
        date.textContent = entry.displayDate;
        
        const items = document.createElement('div');
        items.className = 'gratitude-entry-items';
        
        entry.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'gratitude-entry-item';
            itemDiv.textContent = item;
            items.appendChild(itemDiv);
        });
        
        div.appendChild(date);
        div.appendChild(items);
        
        return div;
    }
    
    saveToStorage() {
        try {
            localStorage.setItem('mentalReliefGratitude', JSON.stringify(this.entries));
        } catch (e) {
            console.warn('Could not save gratitude to localStorage:', e);
        }
    }
    
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('mentalReliefGratitude');
            if (saved) {
                this.entries = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Could not load gratitude from localStorage:', e);
            this.entries = [];
        }
    }
    
    showSavedFeedback() {
        const originalText = this.saveBtn.innerHTML;
        this.saveBtn.innerHTML = '✓ Saved with Love';
        this.saveBtn.style.backgroundColor = '#66BB6A';
        
        setTimeout(() => {
            this.saveBtn.innerHTML = originalText;
            this.saveBtn.style.backgroundColor = '';
        }, 2000);
    }
}

// ============================================
// SOUND CONTROLLER
// ============================================

class SoundController {
    constructor() {
        this.soundButtons = document.querySelectorAll('.sound-btn');
        this.activeSounds = new Map();
        
        // Audio contexts for different sounds (simulated with Web Audio API)
        this.audioContext = null;
        this.oscillators = new Map();
        
        this.init();
    }
    
    init() {
        this.soundButtons.forEach(btn => {
            btn.addEventListener('click', () => this.toggleSound(btn));
        });
    }
    
    toggleSound(button) {
        const soundType = button.dataset.sound;
        const isActive = button.classList.contains('active');
        
        if (isActive) {
            this.stopSound(button, soundType);
        } else {
            this.playSound(button, soundType);
        }
    }
    
    playSound(button, soundType) {
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
        
        // Initialize audio context if needed
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Create a simple oscillator-based ambient sound
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Different frequencies for different sounds
        const soundConfigs = {
            rain: { freq: 200, type: 'sine', volume: 0.1 },
            ocean: { freq: 150, type: 'sine', volume: 0.12 },
            forest: { freq: 300, type: 'triangle', volume: 0.08 },
            wind: { freq: 180, type: 'sawtooth', volume: 0.06 }
        };
        
        const config = soundConfigs[soundType] || soundConfigs.rain;
        
        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.freq, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(config.volume, this.audioContext.currentTime + 1);
        
        // Add some variation with LFO (Low Frequency Oscillator)
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        lfo.frequency.value = 0.5;
        lfoGain.gain.value = 10;
        
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        lfo.start();
        
        // Store references
        this.oscillators.set(soundType, { oscillator, gainNode, lfo });
    }
    
    stopSound(button, soundType) {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
        
        const sound = this.oscillators.get(soundType);
        if (sound) {
            // Fade out
            const { oscillator, gainNode, lfo } = sound;
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
            
            setTimeout(() => {
                oscillator.stop();
                lfo.stop();
                this.oscillators.delete(soundType);
            }, 600);
        }
    }
}

// ============================================
// UTILITY: SMOOTH SCROLL
// ============================================

function smoothScrollInit() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// ACCESSIBILITY: KEYBOARD NAVIGATION
// ============================================

function enhanceAccessibility() {
    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('button, textarea');
    
    interactiveElements.forEach(element => {
        element.addEventListener('keydown', (e) => {
            // Allow Enter/Space to activate buttons
            if (element.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                element.click();
            }
        });
    });
}

// ============================================
// INITIALIZE APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize controllers
    const breathingController = new BreathingController();
    const textReleaseController = new TextReleaseController();
    const affirmationController = new AffirmationController();
    const gratitudeController = new GratitudeController();
    const soundController = new SoundController();
    
    // Initialize utilities
    smoothScrollInit();
    enhanceAccessibility();
    
    // Optional: Add a welcome fade-in
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.8s ease-in';
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('🌿 Mental Relief app initialized. Take a deep breath.');
});

// ============================================
// CLEANUP ON PAGE UNLOAD
// ============================================

window.addEventListener('beforeunload', () => {
    // Stop all sounds
    const soundController = new SoundController();
    if (soundController.audioContext) {
        soundController.audioContext.close();
    }
});
