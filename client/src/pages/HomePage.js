import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'

const HomePage = () => {
  const [maxTemperature, setMaxTemperature] = useState(30)
  const [minTemperature, setMinTemperature] = useState(10)
  const [maxHumidity, setMaxHumidity] = useState(80)
  const [minHumidity, setMinHumidity] = useState(40)
  const [temperature, setTemperature] = useState(0)
  const [temperatureColor, setTemperatureColor] = useState('')
  const [humidity, setHumidity] = useState(0)
  const [humidityColor, setHumidityColor] = useState('')

  const socket = io('http://localhost:5000')

  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected to server')
    })

    socket.on('disconnect', () => {
      console.log('disconnected from server')
    })

    socket.on('temperature', (data) => {
      setTemperature(data.value)
      setTemperatureColor(data.color)
    })

    socket.on('humidity', (data) => {
      setHumidity(data.value)
      setHumidityColor(data.color)
    })

    return () => {
      socket.disconnect()
    }
  }, [socket])

  return (
    <div>
      <div>
        <label htmlFor="max-temperature-input">Max Temperature:</label>
        <input
          type="number"
          id="max-temperature-input"
          value={maxTemperature}
          onChange={(event) => setMaxTemperature(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="min-temperature-input">Min Temperature:</label>
        <input
          type="number"
          id="min-temperature-input"
          value={minTemperature}
          onChange={(event) => setMinTemperature(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="max-humidity-input">Max Humidity:</label>
        <input
          type="number"
          id="max-humidity-input"
          value={maxHumidity}
          onChange={(event) => setMaxHumidity(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="min-humidity-input">Min Humidity:</label>
        <input
          type="number"
          id="min-humidity-input"
          value={minHumidity}
          onChange={(event) => setMinHumidity(event.target.value)}
        />
      </div>
      <div>
        <p>Current Temperature: {temperature} &#8451;</p>
        <div
          style={{
            backgroundColor: temperatureColor,
            width: '50px',
            height: '50px',
          }}
        ></div>
      </div>
      <div>
        <p>Current Humidity: {humidity} %</p>
        <div
          style={{
            backgroundColor: humidityColor,
            width: '50px',
            height: '50px',
          }}
        ></div>
      </div>
    </div>
  )
}

export default HomePage
