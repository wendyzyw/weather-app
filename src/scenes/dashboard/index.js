import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
} from 'react-native';
import {ListItem, Avatar, Button, SearchBar} from 'react-native-elements';
import config from '../../assets/config.json';
import cityListJson from '../../assets/city.list.json';
import Modal from "react-native-modal";

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
        console.log("filter");
        const data = cityListJson.filter( city => {
            const cityName = city.name.toUpperCase();
            const typedName = text.toUpperCase();
            return cityName.indexOf(typedName) > -1
        });
        console.log(data);
        setFilteredList(data);
    }

    const clearModalStates = () => {
        setModalVisible(false);
        setSearch('');
        setFilteredList([]);
    }

    useEffect( () => {
        // api.openweathermap.org/data/2.5/weather?id={city id}&appid={API key}
        Promise.all( cityList.map(city => {
            const query = config.API_CALL_WEATHER_CITY_ID + '?id=' + city.id + '&units=metric&appid=' + config.API_KEY;
            return fetch(query).then(res => res.json());
        }) )
            .then(data => {
                cityList.map((city, i) => city.temperature = data[i].main.temp);
                setWeather({cityList: cityList});
            })
            .catch(error => console.log(error));
    }, [] );

    return (
        <SafeAreaView>
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
                        <Text>Find a city</Text>
                        <SearchBar
                            platform='android'
                            // containerStyle={{width: 300}}
                            placeholder="Type Here..."
                            onChangeText={(search) => setSearch(search)}
                            onSubmitEditing={(event) => searchFilter(event, search)}
                            value={search}
                        />
                        <ScrollView style={{flexGrow: 1, maxHeight: 400}}>
                            {filteredList.map((item,i) =>
                                <ListItem key={i}>
                                    <ListItem.Title>{item.name}</ListItem.Title>
                                    <ListItem.Subtitle>{item.country}</ListItem.Subtitle>
                                </ListItem>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <TouchableHighlight>
                <View>
                    {weather.cityList.map( (city, index) => (
                        <ListItem key={index}>
                            <View style={{display: 'flex', flex:1, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <View>
                                <Text>{city.name}</Text></View>
                                <View><Text>{city.temperature}</Text></View>
                            </View>
                        </ListItem>
                    ))}
                    <ListItem>
                        <Button title='Add more cities' onPress={() => setModalVisible(!modalVisible)} />
                    </ListItem>
                </View>
            </TouchableHighlight>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
});

export default Dashboard;
