// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
const stateInput = document.getElementById('state-input');
const fetchBtn = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

fetchBtn.addEventListener('click', () => {
  const state = stateInput.value.toUpperCase().trim();
  
  // 1. Handle empty input
  if(state === '') {
    showError('Please enter a state abbreviation');
    return;
  }

  fetchWeatherAlerts(state);
});

function fetchWeatherAlerts(state) {
  // 3. Hide error and clear UI before new request
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';
  alertsDisplay.innerHTML = '';

  fetch(`https://api.weather.gov/alerts/active?area=${state}`)
    .then(response => {
      // 2. Handle bad state code / API error
      if (!response.ok) {
        throw new Error(`Invalid state code or API error. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      displayAlerts(data, state);
      stateInput.value = ''; // clear input
    })
    .catch(errorObject => { // Step 4: use errorObject.message
      console.log(errorObject.message);
      showError(errorObject.message);
    });
}

function displayAlerts(data, state) {
  const alerts = data.features;
  const count = alerts.length;

  // Step 3: Clear previous data
  alertsDisplay.innerHTML = '';

  // Test expects this EXACT format: "Weather Alerts: 2"
  const summary = document.createElement('h2');
  summary.textContent = `Weather Alerts: ${count}`;
  alertsDisplay.appendChild(summary);

  // List of headlines
  if (count > 0) {
    const ul = document.createElement('ul');
    alerts.forEach(alert => {
      const headline = alert.properties.headline;
      const li = document.createElement('li');
      li.textContent = headline;
      ul.appendChild(li);
    });
    alertsDisplay.appendChild(ul);
  }
}

function showError(message) {
  errorMessage.classList.remove('hidden'); // show it
  errorMessage.textContent = message; // put errorObject.message here
}