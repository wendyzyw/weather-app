import React, {useEffect, useState} from 'react';
import {View, Text, Button, SafeAreaView, ScrollView} from 'react-native';
import config from "../../assets/config.json";
import {Card} from "react-native-elements";

const initialData = {
    profile: {
        name: '',
        temperate: '',
        feelsLike: '',
        summary: '',
        description: '',
        iconCode: ''
    },
    measurements: {
        wind: '',
        humidity: '',
        min: '',
        max: ''
    }
}

const Detail = ({ route, navigation }) => {
    const { cityId } = route.params;
    const [weatherData, setWeatherData] = useState(initialData);

    useEffect( () => {
        const query = config.API_CALL_WEATHER_CITY_ID + '?id=' + cityId + '&units=metric&appid=' + config.API_KEY;
        fetch(query)
            .then( res => res.json() )
            .then( data =>
            {console.log(data);
                setWeatherData({
                    profile: {
                        name: data.name,
                        temperate: data.main.temp,
                        feelsLike: data.main.feels_like,
                        summary: data.weather[0].main,
                        description: data.weather[0].description,
                        iconCode: data.weather[0].icon
                    },
                    measurements: {
                        wind: data.wind.speed,
                        humidity: data.main.humidity,
                        min: data.main.temp_min,
                        max: data.main.temp_max
                    }
                }) }
            )
            .catch( error => console.log(error) )
    } , [] );

    return (
        <SafeAreaView>
            <ScrollView>
                <View>
                    <Card>
                        <Card.Title>{weatherData.profile.description}</Card.Title>
                    </Card>
                    <View>
                        <Card>
                            <Card.Title>{weatherData.measurements.wind}</Card.Title>
                        </Card>
                        <Card>
                            <Card.Title>{weatherData.measurements.humidity}</Card.Title>
                        </Card>
                    </View>
                    <View>
                        <Card>
                            <Card.Title>{weatherData.measurements.min}</Card.Title>
                        </Card>
                        <Card>
                            <Card.Title>{weatherData.measurements.max}</Card.Title>
                        </Card>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Detail;
