import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity} from 'react-native';
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
        <ImageBackground source={require('../../assets/background.jpg')} resizeMode='cover' style={{flex: 1, height: '100%'}} >
        <SafeAreaView>
            <ScrollView>
                <View>
                    <TouchableOpacity>
                        <Card containerStyle={{flex: 1,
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            marginVertical: 10,
                            padding: 25,
                            elevation: 0,
                            borderRadius: 15,
                            borderWidth: 0}}>
                            <Card.Title>{weatherData.profile.description}</Card.Title>
                        </Card>
                    </TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Card containerStyle={styles.cardContainerLeftStyle} >
                            <Card.Title>Wind</Card.Title>
                            <Card.FeaturedSubtitle style={{alignSelf: 'center'}}>{weatherData.measurements.wind}</Card.FeaturedSubtitle>
                        </Card>
                        <Card containerStyle={styles.cardContainerRightStyle}>
                            <Card.Title>Humidity</Card.Title>
                            <Card.FeaturedSubtitle style={{alignSelf: 'center'}}>{weatherData.measurements.humidity}</Card.FeaturedSubtitle>
                        </Card>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Card containerStyle={styles.cardContainerLeftStyle}>
                            <Card.Title>Min temperature</Card.Title>
                            <Card.FeaturedSubtitle style={{alignSelf: 'center'}}>{weatherData.measurements.min}</Card.FeaturedSubtitle>
                        </Card>
                        <Card containerStyle={styles.cardContainerRightStyle}>
                            <Card.Title>Max temperature</Card.Title>
                            <Card.FeaturedSubtitle style={{alignSelf: 'center'}}>{weatherData.measurements.max}</Card.FeaturedSubtitle>
                        </Card>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    cardContainerLeftStyle: {
        flex: 1,
        marginRight: 7.5,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        marginVertical: 10,
        padding: 25,
        elevation: 0,
        borderRadius: 15,
        borderWidth: 0
    },
    cardContainerRightStyle: {
        flex: 1,
        marginLeft: 7.5,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        marginVertical: 10,
        padding: 25,
        elevation: 0,
        borderRadius: 15,
        borderWidth: 0
    },
});

export default Detail;
