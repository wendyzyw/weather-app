import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    ScrollView, Pressable, ImageBackground, TouchableOpacity,
} from 'react-native';
import {ListItem, Avatar, Button, SearchBar} from 'react-native-elements';
import config from '../../assets/config.json';
import cityListJson from '../../assets/city.list.json';
import Modal from "react-native-modal";
import Detail from "../detail";
import Icon from 'react-native-vector-icons/FontAwesome';

const imageBackgroundSrc = '../../assets/background.jpg';

const Dashboard = ({navigation}) => {
    const cityList = [
        {
            name: 'Sydney',
            temperature: 0,
            id: 2147714
        },
        {
            name: 'Melbourne',
            temperature: 0,
            id: 2158177
        },
        {
            name: 'Brisbane',
            temperature: 0,
            id: 2174003
        }
    ];
    const [modalVisible, setModalVisible] = useState(false);
    const [weather, setWeather] = useState({cityList: []});
    const [search, setSearch] = useState('');
    const [filteredList, setFilteredList] = useState([]);

    const searchFilter = (event, text) => {
        const data = cityListJson.filter( city => {
            const cityName = city.name.toUpperCase();
            const typedName = text.toUpperCase();
            return cityName.indexOf(typedName) > -1
        });
        console.log(data);
        setFilteredList(data);
    }

    const addCity = (id, name) => {
        const query = config.API_CALL_WEATHER_CITY_ID + '?id=' + id + '&units=metric&appid=' + config.API_KEY;
        fetch(query)
            .then( res => res.json() )
            .then( data => {
                setWeather({cityList: [...weather.cityList, {id: id, name: name, temperature: data.main.temp,
                        icon: config.ICON_URL_PREFIX + data.weather[0].icon + config.ICON_URL_POSTFIX}]});
            })
            .catch( error => console.log(error) );
        clearModalStates();
    }

    const clearModalStates = () => {
        setModalVisible(false);
        setSearch('');
        setFilteredList([]);
    }

    const fetchAllCityWeatherData = () => {
        // api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}
        Promise.all( cityList.map(city => {
            const query = config.API_CALL_WEATHER_CITY_ID + '?id=' + city.id + '&units=metric&appid=' + config.API_KEY;
            return fetch(query).then(res => res.json());
        }) )
            .then(data => {
                cityList.map((city, i) => {
                    city.temperature = data[i].main.temp;
                    city.icon = config.ICON_URL_PREFIX + data[i].weather[0].icon + config.ICON_URL_POSTFIX;
                });
                setWeather({cityList: cityList});
            })
            .catch(error => console.log(error));
    }

    useEffect( () => {
        // query weather api every 1 minute
        const id = setInterval( () => {
            console.log("Updating");
            fetchAllCityWeatherData();
        }, 60000 );

        fetchAllCityWeatherData();
        return () => clearInterval(id);
    }, [] );

    return (
        <ImageBackground source={require(imageBackgroundSrc)} resizeMode='cover' style={styles.imageBackgroundViewStyle} >
            <SafeAreaView style={{flex: 1}}>
                <Modal
                    animationType="slide"
                    propagateSwipe={true}
                    isVisible={modalVisible}
                    onBackdropPress={clearModalStates}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View contentContainerStyle={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={{color: '#353B63', fontSize: 25, fontWeight: 'bold'}}>Find a city</Text>
                            <SearchBar
                                platform='android'
                                placeholder="Type Here..."
                                onChangeText={(search) => setSearch(search)}
                                onSubmitEditing={(event) => searchFilter(event, search)}
                                value={search}
                                onClear={() => setFilteredList([])}
                            />
                            <ScrollView style={styles.searchAreaScrollViewStyle}>
                                {filteredList.length === 0 && <Text style={{color: '#A892B0', fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>No city found.</Text>}
                                {filteredList.map((item,i) =>
                                    <ListItem key={i} onPress={() => addCity(item.id, item.name)}>
                                        <ListItem.Title>{item.name}</ListItem.Title>
                                        <ListItem.Subtitle>{item.country}</ListItem.Subtitle>
                                    </ListItem>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
                <View style={{marginTop: 20}}>
                    {weather.cityList.map( (city, index) => (
                        <TouchableOpacity key={index}  onPress={() => navigation.navigate('Detail', {cityId: city.id})}>
                            <ListItem containerStyle={styles.listItemContainerStyle}>
                                <View style={{backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 10, padding: 10}}>
                                    <Avatar source={{uri: city.icon}} />
                                </View>
                                <View style={styles.listItemWrapperStyle} onPress={() => navigation.navigate('Detail', {cityId: city.id})}>
                                    <Text style={{color: '#353B63', fontSize: 18, fontWeight: 'bold'}}>{city.name}</Text>
                                    <Text style={{color: '#A892B0', fontSize: 25, fontWeight: 'bold'}}>{city.temperature}°</Text>
                                </View>
                            </ListItem>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                        <ListItem containerStyle={styles.listItemContainerStyle}>
                            <View style={{backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: 10, padding: 10}}>
                                <Icon name="plus-square" size={30} color="#9A27FF" />
                            </View>
                            <Text style={{color: '#A892B0', fontSize: 18, fontWeight: 'bold'}}>Add more cities</Text>
                        </ListItem>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ImageBackground>

    );
}

const styles = StyleSheet.create({
    imageBackgroundViewStyle: {
        flex: 1,
        height: '100%'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        // flex: 1,
        // margin: 20,
        minHeight: 200,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    searchAreaScrollViewStyle: {
        flexGrow: 1,
        maxHeight: 400
    },
    listItemContainerStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        marginHorizontal: 20,
        marginVertical: 8,
        padding: 17,
        borderRadius: 10
    },
    listItemWrapperStyle: {
        display: 'flex',
        flex:1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

});

export default Dashboard;
