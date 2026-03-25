import React, { createContext, useState } from "react";

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [switchtoogle, setWitchtoogle] = useState(true);
    return (
        <WeatherContext.Provider value={{ weatherData, setWeatherData, switchtoogle, setWitchtoogle }}>
            {children}
        </WeatherContext.Provider>
    );
};