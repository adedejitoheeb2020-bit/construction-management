import requests
from datetime import date, timedelta

def get_weather(latitude, longitude):
    base_url = 'http://api.open-meteo.com/v1/forecast'
    query_data = {
        "latitude": latitude,
        "longitude": longitude,
        "current_weather": True,
        "daily": ["temperature_2m_max", "temperature_2m_min", "precipitation_sum"],
        "timezone": "auto",
        "forecast_days": 7
    }
    response = requests.get(base_url, params=query_data)
    if response.status_code == 200:
        data = response.json()
        # Extract current weather
        current = data.get("current_weather", {})

        # Extract 7-day forecast
        forecast = []
        daily_data = data.get("daily", {})
        dates = daily_data.get("time", [])
        temp_max = daily_data.get("temperature_2m_max", [])
        temp_min = daily_data.get("temperature_2m_min", [])
        precipitation = daily_data.get("precipitation_sum", [])

        for i in range (len(dates)):
            forecast.append({
                "date": dates[i],
                "temp_max": temp_max[i],
                "temp_min": temp_min[i],
                "precipitation": precipitation[i],
            })
        return {
            "current": current,
            "forecast": forecast,
        }
    else:
        return {"error": "could not retrieve weather data"}

def generate_weather_alert(latitude, longitude):
    data = get_weather(latitude, longitude)
    forecast = data.get("forecast", [])
    alerts = []

    for day in forecast:
        if day["precipitation"] > 5:
            alerts.append(f"Heavy rainfall expected on {day['date']} ({day['precipitation']} mm).")

        if day["temp_max"] > 35:
            alerts.append(f"High temperature on {day['date']} ({day['temp_max']} °C).")

    return alerts or ["No severe weather expected in the next 7 days."]