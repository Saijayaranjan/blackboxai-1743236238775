// Sensor data and Firebase integration
let sensorData = {
    moisture: 0,
    temperature: 0,
    humidity: 0
};

// Chart setup
const ctx = document.getElementById('sensorChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Moisture (%)',
                data: [],
                borderColor: document.documentElement.classList.contains('dark') ? 'rgb(74, 222, 128)' : 'rgb(75, 192, 192)',
                backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(74, 222, 128, 0.1)' : 'rgba(75, 192, 192, 0.1)',
                tension: 0.1
            },
            {
                label: 'Temperature (°C)',
                data: [],
                borderColor: document.documentElement.classList.contains('dark') ? 'rgb(248, 113, 113)' : 'rgb(255, 99, 132)',
                backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(248, 113, 113, 0.1)' : 'rgba(255, 99, 132, 0.1)',
                tension: 0.1
            },
            {
                label: 'Humidity (%)',
                data: [],
                borderColor: document.documentElement.classList.contains('dark') ? 'rgb(56, 182, 255)' : 'rgb(54, 162, 235)',
                backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(56, 182, 255, 0.1)' : 'rgba(54, 162, 235, 0.1)',
                tension: 0.1
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Crop recommendations data
const cropData = {
    'Wheat': { minTemp: 10, maxTemp: 25, minMoisture: 40, maxMoisture: 80 },
    'Rice': { minTemp: 20, maxTemp: 35, minMoisture: 60, maxMoisture: 100 },
    'Corn': { minTemp: 15, maxTemp: 30, minMoisture: 50, maxMoisture: 90 },
    'Tomatoes': { minTemp: 18, maxTemp: 28, minMoisture: 60, maxMoisture: 85 },
    'Potatoes': { minTemp: 7, maxTemp: 25, minMoisture: 50, maxMoisture: 80 }
};

function updateChart(data) {
    // Add new data point
    const time = new Date().toLocaleTimeString();
    chart.data.labels.push(time);
    
    // Limit to 20 data points
    if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets.forEach(dataset => dataset.data.shift());
    }
    
    // Update datasets
    chart.data.datasets[0].data.push(data.moisture);
    chart.data.datasets[1].data.push(data.temperature);
    chart.data.datasets[2].data.push(data.humidity);
    
    chart.update();
}

function updateCropRecommendations(data) {
    const container = document.getElementById('crop-recommendations');
    container.innerHTML = '';
    
    for (const [crop, requirements] of Object.entries(cropData)) {
        const suitable = data.temperature >= requirements.minTemp && 
                        data.temperature <= requirements.maxTemp &&
                        data.moisture >= requirements.minMoisture && 
                        data.moisture <= requirements.maxMoisture;
        
        const card = document.createElement('div');
        card.className = `card ${suitable ? 'bg-green-50 dark:bg-green-900/20 border-green-200' : 'bg-gray-50 dark:bg-gray-700/20 border-gray-200'}`;
        card.innerHTML = `
            <div class="flex items-start justify-between">
                <h4 class="font-bold ${suitable ? 'text-green-800 dark:text-green-300' : 'text-gray-600 dark:text-gray-300'}">${crop}</h4>
                <span class="text-lg ${suitable ? 'text-green-500' : 'text-gray-400'}">
                    ${suitable ? '✓ Suitable' : '✗ Not suitable'}
                </span>
            </div>
            <div class="mt-3 text-sm ${suitable ? 'text-green-600 dark:text-green-200' : 'text-gray-500 dark:text-gray-400'}">
                <p>Ideal Temperature: ${requirements.minTemp}°C - ${requirements.maxTemp}°C</p>
                <p class="mt-1">Ideal Moisture: ${requirements.minMoisture}% - ${requirements.maxMoisture}%</p>
            </div>
        `;
        container.appendChild(card);
    }
}

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
    async function fetchSensorData() {
        try {
            const response = await fetch('sensor_data.json');
            if (!response.ok) throw new Error('Data not available');
            
            const data = await response.json();
            sensorData = {
                moisture: data.SoilMoisture || 0,
                temperature: data.Temperature || 0,
                humidity: data.Humidity || 0
            };
            
            updateChart(sensorData);
            updateCropRecommendations(sensorData);
        } catch (error) {
            console.error('Error fetching sensor data:', error);
            // Show "Data Not Available" message
            document.getElementById('moisture-value').textContent = '';
            document.getElementById('temp-value').textContent = '';
            document.getElementById('humidity-value').textContent = '';
            return;
        }
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