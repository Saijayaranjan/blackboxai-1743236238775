// Sensor data and Firebase integration
let sensorData = {
    moisture: 0,
    temperature: 0,
    humidity: 0
};

// Mobile menu toggle and data fetching
document.addEventListener('DOMContentLoaded', function() {
    // Fetch sensor data every 5 seconds
    setInterval(fetchSensorData, 5000);
    fetchSensorData();
    // Update soil data display
    function updateSoilDataDisplay() {
        document.getElementById('moisture-value').textContent = sensorData.moisture + '%';
        document.getElementById('temp-value').textContent = sensorData.temperature + '°C';
        document.getElementById('humidity-value').textContent = sensorData.humidity + '%';
    }

    // Fetch sensor data from server
    async function fetchSensorData() {
        try {
            const response = await fetch('/api/sensor-data');
            sensorData = await response.json();
            updateSoilDataDisplay();
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
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