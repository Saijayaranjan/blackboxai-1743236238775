// Sensor data and Firebase integration
let sensorData = {
    moisture: 0,
    temperature: 0,
    humidity: 0
};

// Dark Mode Toggle Functionality
function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    
    const icon = darkModeToggle.querySelector('i');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Initialize based on user preference or system preference
    if (localStorage.getItem('darkMode') === 'enabled' || 
        (localStorage.getItem('darkMode') === null && prefersDark)) {
        document.documentElement.classList.add('dark');
        icon?.classList?.replace('fa-moon', 'fa-sun');
    }

    // Set up click handler
    darkModeToggle.addEventListener('click', function() {
        const isDark = document.documentElement.classList.toggle('dark');
        if (icon) {
            if (isDark) {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('darkMode', 'enabled');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('darkMode', 'disabled');
            }
        }
    });
}

// Mobile menu toggle and data fetching
document.addEventListener('DOMContentLoaded', function() {
    setupDarkMode();
    // Fetch sensor data every 5 seconds
    setInterval(fetchSensorData, 5000);
    fetchSensorData();
    // Update soil data display
    function updateSoilDataDisplay() {
        document.getElementById('moisture-value').textContent = sensorData.moisture + '%';
        document.getElementById('temp-value').textContent = sensorData.temperature + '°C';
        document.getElementById('humidity-value').textContent = sensorData.humidity + '%';
    }

    // Generate mock sensor data
    function fetchSensorData() {
        // Always use mock data in development
        sensorData = {
            moisture: Math.floor(Math.random() * 100),
            temperature: Math.floor(Math.random() * 30),
            humidity: Math.floor(Math.random() * 100)
        };
        updateSoilDataDisplay();
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature, .testimonial');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (elementPosition < screenPosition) {
                element.classList.add('animate-fadeIn');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load

    // Form submission handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to a server
            alert('Form submitted! (This is a demo)');
            form.reset();
        });
    });
});