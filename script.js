const mockWeatherData = {
    "Delhi": {
      current: { temp: 32, humidity: 55, wind: 10 },
      forecast: [
        { day: "Mon", high: 34, low: 26 },
        { day: "Tue", high: 36, low: 27 },
        { day: "Wed", high: 33, low: 25 },
        { day: "Thu", high: 31, low: 24 },
        { day: "Fri", high: 30, low: 23 },
      ]
    },
    "London": {
      current: { temp: 15, humidity: 70, wind: 8 },
      forecast: [
        { day: "Mon", high: 17, low: 10 },
        { day: "Tue", high: 16, low: 9 },
        { day: "Wed", high: 18, low: 11 },
        { day: "Thu", high: 19, low: 12 },
        { day: "Fri", high: 20, low: 13 },
      ]
    }
  };
  
  const cityInput = document.getElementById('cityInput');
  const searchBtn = document.getElementById('searchBtn');
  const errorMsg = document.getElementById('errorMsg');
  const weatherDetails = document.getElementById('weatherDetails');
  const forecastDetails = document.getElementById('forecastDetails');
  const searchHistory = document.getElementById('searchHistory');
  
  let tempChart;
  
  searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (!mockWeatherData[city]) {
      errorMsg.textContent = "City not found in mock data!";
      return;
    }
    errorMsg.textContent = "";
    displayWeather(city);
    saveToHistory(city);
  });
  
  function displayWeather(city) {
    const data = mockWeatherData[city];
    const { temp, humidity, wind } = data.current;
    weatherDetails.innerHTML = `
      <p>Temperature: ${temp}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${wind} km/h</p>
    `;
  
    forecastDetails.innerHTML = "";
    const highs = [], lows = [], labels = [];
  
    data.forecast.forEach(day => {
      forecastDetails.innerHTML += `
        <div>
          <h4>${day.day}</h4>
          <p>High: ${day.high}°C</p>
          <p>Low: ${day.low}°C</p>
        </div>
      `;
      highs.push(day.high);
      lows.push(day.low);
      labels.push(day.day);
    });
  
    renderChart(labels, highs, lows);
  }
  
  function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    if (!history.includes(city)) {
      history.push(city);
      localStorage.setItem('weatherHistory', JSON.stringify(history));
      updateHistoryUI();
    }
  }
  
  function updateHistoryUI() {
    searchHistory.innerHTML = "";
    const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    history.forEach(city => {
      const li = document.createElement('li');
      li.textContent = city;
      li.addEventListener('click', () => displayWeather(city));
      searchHistory.appendChild(li);
    });
  }
  
  function renderChart(labels, highs, lows) {
    if (tempChart) tempChart.destroy();
  
    const ctx = document.getElementById('tempChart').getContext('2d');
    tempChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Highs',
            data: highs,
            borderColor: '#e63946',
            fill: false
          },
          {
            label: 'Lows',
            data: lows,
            borderColor: '#457b9d',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }
  
  //load history on page load
  updateHistoryUI();
  