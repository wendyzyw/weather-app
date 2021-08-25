import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, ScrollView, ImageBackground, TouchableOpacity, Text} from 'react-native';
import config from "../../assets/config.json";
import {Avatar, Card} from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

const initialData = {
    profile: {
        name: '',
        temperate: '',
        feelsLike: '',
        summary: '',
        description: '',
        iconUri: ''
    },
    measurements: {
        wind: '',
        humidity: '',
        min: '',
        max: ''
    }
}

const weatherInfoCard = ( iconName, titleName, data, leftPositioned ) => (
    <Card containerStyle={leftPositioned ? styles.cardContainerLeftStyle : styles.cardContainerRightStyle}>
        <Icon name={iconName} size={25} color="#353B63" style={{width: 25}}/>
        <View style={styles.cardTextWrapperStyle}>
            <Card.Title style={styles.cardTitleStyle}>{titleName}</Card.Title>
            <Card.FeaturedSubtitle style={styles.cardSubtitleStyle}>{data}</Card.FeaturedSubtitle>
        </View>
    </Card>
);

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
                        iconUri: config.ICON_URL_PREFIX + data.weather[0].icon + config.ICON_URL_POSTFIX
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
                        <Card containerStyle={styles.profileContainerStyle}>
                            <Card.Title style={styles.profileTitleStyle}>{weatherData.profile.name}</Card.Title>
                            <Avatar source={{uri: weatherData.profile.iconUri}} size='xlarge' iconStyle={{flex: 1, textAlignVertical: 'center'}}/>
                            <Card.Title style={{color: '#353B63', fontSize: 50, fontWeight: 'bold'}}>{weatherData.profile.temperate}°</Card.Title>
                            <Card.Title style={styles.profileTextStyle}>{weatherData.profile.summary}, feels like {weatherData.profile.feelsLike}°</Card.Title>
                            <Card.Title style={styles.profileTextStyle}>{weatherData.profile.description}</Card.Title>
                        </Card>
                    </TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {weatherInfoCard('tint', 'Wind', weatherData.measurements.wind, true)}
                        {weatherInfoCard('tint', 'Humidity', weatherData.measurements.humidity, false)}
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {weatherInfoCard('thermometer', 'Min °C', weatherData.measurements.min, true)}
                        {weatherInfoCard('thermometer', 'Max °C', weatherData.measurements.max, false)}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    profileContainerStyle: {
        flex: 1,
        backgroundColor: 'transparent',
        marginVertical: 10,
        elevation: 0,
        borderWidth: 0,
        flexDirection: 'column',
        alignItems: 'center'
    },
    profileTitleStyle:{
        color: '#353B63',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 0,
        textAlign: 'center'
    },
    profileTextStyle:{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 0,
        textAlign: 'center'
    },
    cardContainerLeftStyle: {
        flex: 1,
        marginRight: 7.5,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        marginVertical: 10,
        padding: 25,
        elevation: 0,
        borderRadius: 15,
        borderWidth: 0,
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    cardContainerRightStyle: {
        flex: 1,
        marginLeft: 7.5,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        marginVertical: 10,
        padding: 25,
        elevation: 0,
        borderRadius: 15,
        borderWidth: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    cardTextWrapperStyle: {
        flex: 1,
        marginLeft: 35,
        marginTop: -30
    },
    cardTitleStyle:{
        color: '#A892B0',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 0,
        alignSelf: 'flex-start'
    },
    cardSubtitleStyle: {
        alignSelf: 'flex-start',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 0
    }
});

export default Detail;
