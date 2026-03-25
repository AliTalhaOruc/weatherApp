import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { FlatList, ScrollView, Image, ImageBackground, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, Modal, TouchableWithoutFeedback, Alert, ActivityIndicator } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import Feather from '@expo/vector-icons/Feather';
import LottieView from 'lottie-react-native';
import { Anim } from '../Anim';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { DescriptionWarning } from '../DescriptionWarning';
import { useContext } from "react";
import { WeatherContext } from '../WeatherContext';

export const HomePage = () => {
    const navigation = useNavigation();
    const [toggle, settoggle] = useState(false);
    const [cityname, setCityname] = useState("");
    const [weather, setWeather] = useState();
    const [loading, setLoading] = useState(false)
    const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
    const [forecast, setForecast] = useState([]);
    const [switchtoogle, setWitchtoogle] = useState(true);
    const nightthemecolor = "rgb(160, 146, 146)";
    const lightthemecolor = "black";
    let weathericon = "";
    const [selectedanim, setSelectedanim] = useState();
    const [favcities, setFavcities] = useState([]);
    const [showmodal, setShowmodal] = useState(false);
    const [loadingchatgpt, setLoadingchatgpt] = useState(false)
    const [chatmodal, setChatmodal] = useState(false)
    const [chatresponse, setChatresponse] = useState()
    const switchtumb = () => {
        setWitchtoogle(!switchtoogle);
    }
    const { setWeatherData } = useContext(WeatherContext);

    const fetchForecast = async (city) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=tr`
            );
            const filtered = response.data.list.filter(item =>
                item.dt_txt.includes('12:00:00')
            );
            setForecast(filtered);
        } catch (error) {
            console.error('Veri alınamadı:', error);
        }
    };

    const renderItem = ({ item }) => {
        const date = new Date(item.dt * 1000);
        return (
            <TouchableOpacity style={styles.buttoncard} onPress={() => navigation.navigate("InfoPage", { date: item.dt_txt, item: item, theme: switchtoogle, cityname: cityname, country: weather.sys.country })}>
                <View style={[styles.card, { backgroundColor: switchtoogle ? 'rgba(255,255,255,0.3)' : 'rgba(194, 188, 188, 0.5)' }]}>
                    <Text style={styles.date}>{date.toLocaleDateString('tr-TR', { weekday: 'long' })}</Text>
                    <Text style={styles.temp}>{item.main.temp}°C</Text>
                    <Image resizeMode='cover'
                        source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }}
                        style={{ width: 70, height: 70 }} />
                    <Text>{item.weather[0].description}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const getweatherimg = (iconcode) => {
        return Anim[iconcode] ? Anim[iconcode] : iconcode;
    };

    const getdescriptionwarning = (iconcode) => {
        return DescriptionWarning[iconcode] ? DescriptionWarning[iconcode] : "Bugün için özel bir not yok 😊";
    }

    const fetchweather = async (city) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=tr`);
            const data = await response.json();
            setWeather(data);
            setWeatherData({
                tempurature: data.main.temp,
                condition: data.weather[0].description
            })
            weathericon = data.weather[0].icon;
            setSelectedanim(getweatherimg(weathericon));
        } catch (error) {
            console.log("Hata olustu");

        } finally {
            setLoading(false);
            fetchForecast(city);
        }

    }

    let sunriseTime = null;
    if (weather?.sys?.sunrise) {
        const sunrise = new Date(weather.sys.sunrise * 1000);
        sunriseTime = sunrise.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Istanbul'
        });
    }

    const fetchweatherwithGps = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log("Konum izni reddedildi");
            return;
        }
        try {
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setLoading(true);

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            const data = await response.json();
            setCityname(data.name);
            setWeather(data);
            const weathericon = data.weather[0].icon;
            setSelectedanim(getweatherimg(weathericon));
            setWeatherData({
                tempurature: data.main.temp,
                condition: data.weather[0].description
            })
            fetchForecast(data.name);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const savecityname = async (city) => {
        try {
            const exist = await AsyncStorage.getItem(`F_${city}`);
            if (!exist) {
                await AsyncStorage.setItem(`F_${city}`, city);
            }
        } catch (error) {
            console.log("favori sehre eklenemedi!", error);
        }
    }

    const listallfavcity = async () => {
        try {
            const allkeys = await AsyncStorage.getAllKeys();
            const keys = allkeys.filter(key => key.startsWith("F_"))
            return keys;
        } catch (error) {
            console.log("favoriler listelenemedi", error);
            return [];
        }
    }

    const handleopenmodal = async () => {
        try {
            const cities = await listallfavcity();
            setFavcities(cities);
            setShowmodal(true);
        } catch (error) {
            console.log(error);

        }

    }

    const handledeletefavcity = (city) => {
        Alert.alert("Sehri sil", `${city} sehri favdan kaldırılsın mı?`, [
            {
                text: "Vazgeç",
                style: 'cancel',
            },
            {
                text: "Sil",
                style: "destructive",
                onPress: async () => {
                    await AsyncStorage.removeItem(city)
                    const update = await listallfavcity();
                    Toast.show({
                        type: 'success',
                        text1: `${city} favorilerim listesinden kaldırıldı`,
                        visibilityTime: 3000,
                        autoHide: true,
                        topOffset: 50,
                        bottomOffset: 30,
                    }
                    )
                    setFavcities(update);
                }
            }
        ])
    }
    useEffect(() => {
        const init = async () => {
            await fetchweatherwithGps();
        };
        init();
    }, []);
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 19 || hour <= 6) {
            setWitchtoogle(false);
        } else {
            setWitchtoogle(true);
        }
    }, []);


    return (
        <>
            <ImageBackground blurRadius={5} style={{ flex: 1 }} resizeMode='cover' source={switchtoogle ? require("../assets/backgroundimg.webp") : require("../assets/nightthemebackgrund2.webp")}>


                <View style={styles.container}>
                    <View style={{ flex: 1, padding: 10, width: '100%' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ position: 'absolute', top: 3, left: 0 }}>
                                <Switch

                                    onValueChange={() => switchtumb()}
                                    value={switchtoogle}
                                    thumbColor={switchtoogle ? "white" : "gray"}
                                    trackColor={switchtoogle ? "rgba(255,255,255,0.7)" : "gray"}
                                />
                            </View>
                            <View style={{ width: '100%', height: 100, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 30, flexDirection: 'row' }}>
                                {toggle ? <TextInput
                                    value={cityname}
                                    onChangeText={(e) => setCityname(e)}
                                    style={[styles.textinputstyle, { borderColor: switchtoogle ? lightthemecolor : nightthemecolor, color: switchtoogle ? lightthemecolor : nightthemecolor }]}
                                /> : null}

                                <TouchableOpacity onPress={() => {
                                    if (!toggle) {
                                        settoggle(!toggle)
                                    } else if (toggle && cityname.trim() != "") {
                                        fetchweather(cityname);
                                    } else {
                                        settoggle(!toggle)
                                    }

                                }} style={[styles.searchicon, { backgroundColor: switchtoogle ? "white" : nightthemecolor }]}>
                                    <AntDesign name="search1" size={28} color="black" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ justifyContent: 'center', flexDirection: 'row', width: '100%', justifyContent: 'flex-end', alignItems: 'center', columnGap: 10 }}>

                            <TouchableOpacity disabled={!cityname} onPress={() => {
                                savecityname(cityname);
                                Toast.show({
                                    type: 'success',
                                    text1: `${cityname} favorilerim listesine eklendi`,
                                    visibilityTime: 3000,
                                    autoHide: true,
                                    topOffset: 50,
                                    bottomOffset: 30,
                                }
                                )
                            }}>;
                                <View style={{ borderWidth: 1, borderRadius: 30, padding: 10, backgroundColor: switchtoogle ? '#A0CED9' : "gray" }}>
                                    <Text style={{ fontWeight: '500' }}>Favori şehirlere ekle</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => handleopenmodal()}>
                                <View style={{ padding: 5 }}>
                                    <View style={{ borderWidth: 1, borderRadius: 30, padding: 10, backgroundColor: switchtoogle ? '#A0CED9' : "gray" }}>
                                        <Text style={{ fontWeight: '500' }}>Favori şehirleri göster</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 4 }}>
                            {weather && weather.main ? <> <View style={styles.infocontainer}>
                                <View style={{ flex: 1, width: '100%' }}>
                                    <View style={{ width: '100%' }}><Text style={{ fontSize: 20, color: switchtoogle ? lightthemecolor : nightthemecolor }}>{weather.name}<Text style={{ color: switchtoogle ? lightthemecolor : nightthemecolor, fontSize: 13 }}>{weather.sys.country}</Text></Text></View>
                                    <View><Text style={{ fontSize: 35, color: switchtoogle ? lightthemecolor : nightthemecolor }}>{weather.main.temp} C°</Text></View>

                                    <View style={styles.Imagewrap}>
                                        <View style={styles.Imagestyle}>
                                            {typeof selectedanim === 'string' ? (
                                                <Image
                                                    source={{ uri: `https://openweathermap.org/img/wn/${selectedanim}@2x.png` }}
                                                    style={{}}
                                                    resizeMode="contain"
                                                />
                                            ) : selectedanim ? (
                                                <LottieView
                                                    source={selectedanim}
                                                    autoPlay
                                                    loop
                                                    style={{ width: '200%', height: '200%' }}
                                                />
                                            ) : null}
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                        <View><Text style={{ fontWeight: 'bold', fontSize: 16, color: switchtoogle ? lightthemecolor : nightthemecolor }}>Durum:{weather.weather[0].description} / Hissedilen:{weather.main.feels_like}</Text>
                                            <View style={{ marginTop: 7 }}><Text style={{ fontWeight: '600', color: switchtoogle ? "black" : nightthemecolor }}>{getdescriptionwarning(weather.weather[0].icon)}</Text></View>
                                        </View>

                                    </View>
                                    <View style={styles.middleinfocontainer}>
                                        <View style={styles.middleinfo}>

                                            <Ionicons name="water-outline" size={32} color={switchtoogle ? lightthemecolor : nightthemecolor} />
                                            <Text style={[styles.middletext, { color: switchtoogle ? lightthemecolor : nightthemecolor }]}>{weather.main.humidity}<Text style={{ fontSize: 15, color: switchtoogle ? lightthemecolor : nightthemecolor }}>%</Text></Text>

                                        </View>
                                        <View style={styles.middleinfo}>

                                            <MaterialCommunityIcons name="weather-windy" size={32} color={switchtoogle ? lightthemecolor : nightthemecolor} />
                                            <Text style={[styles.middletext, { color: switchtoogle ? lightthemecolor : nightthemecolor }]}>{weather.wind.speed}<Text style={{ fontSize: 10 }}> m/s</Text></Text>
                                        </View>
                                        <View style={[styles.middleinfo, { flex: 1.5 }]}>

                                            <Ionicons name="sunny-outline" size={32} color={switchtoogle ? lightthemecolor : nightthemecolor} />
                                            <Text style={[styles.middletext, { color: switchtoogle ? lightthemecolor : nightthemecolor }]}>{sunriseTime}<Text style={{ fontSize: 10 }}> a/m</Text> </Text>
                                        </View>

                                    </View>

                                </View>

                            </View>
                                <View style={{ flex: 2 }}>
                                    <View style={{ flex: 1 }}>

                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                data={forecast}
                                                keyExtractor={(item) => item.dt.toString()}
                                                renderItem={renderItem}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </>
                                : (null)
                            }

                        </View>
                    </View>
                    <Modal animationType='slide' visible={showmodal} transparent={true} onRequestClose={() => setShowmodal(false)}>
                        <TouchableWithoutFeedback onPress={() => setShowmodal(false)} >
                            <View style={styles.modaloverlay}>
                                <TouchableWithoutFeedback>
                                    <View style={styles.modalcontent}>
                                        <View style={{ marginBottom: 5, borderColor: 'white', alignItems: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => setShowmodal(false)} style={{ borderWidth: 1, borderColor: 'white' }}>
                                                <AntDesign name="close" size={30} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                        <ScrollView>
                                            {favcities.map((city, index) => {
                                                return (
                                                    <View key={city} style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center' }}>
                                                        <TouchableOpacity onLongPress={() =>
                                                            handledeletefavcity(city)
                                                        }
                                                            style={{ width: '80%' }}
                                                            onPress={() => {
                                                                const newcity = city.slice(2);
                                                                setCityname(newcity);

                                                                fetchweather(newcity);
                                                                setShowmodal(false);
                                                            }
                                                            }>

                                                            <View style={{ width: '100%', borderRadius: 10, marginVertical: 5, borderColor: 'white', borderWidth: 1, padding: 10, }}>
                                                                <Text style={{ color: 'white', fontSize: 20 }}><Feather name="star" size={24} color="yellow" />{city}</Text>
                                                            </View>

                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={{ padding: 8 }} onPress={() => handledeletefavcity(city)}>
                                                            <AntDesign name="delete" size={28} color="red" />
                                                        </TouchableOpacity>
                                                    </View>
                                                )
                                            })
                                            }

                                        </ScrollView>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
                <Toast />
            </ImageBackground >
            <Toast />
        </>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50
    },
    modaloverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },

    modalcontent: {
        padding: 10,
        height: '40%',
        width: '100%',
        backgroundColor: '#25292e',
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: 'absolute',
        bottom: 0,
    },
    textinputstyle: {
        width: '100%',
        height: 60,
        borderWidth: 2,
        borderRadius: 40,
        paddingLeft: 30,
        fontSize: 25,
    },
    searchicon: {
        position: 'absolute',
        right: 15,
        backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: '50%'
    },
    infocontainer: {
        width: '100%',
        flex: 3,
        alignItems: 'center',
        padding: 5,
        backgroundColor: 'rgba(255,255,255,0.3)',
        padding: 15,
        borderRadius: 25,
        marginTop: 10
    },
    Imagewrap: {
        width: '100%',
        height: '30%',

    },
    Imagestyle: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -20,

    },
    middleinfocontainer: {
        width: '100%',
        height: '25%',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        columnGap: 20,
        padding: 2,
    },
    middleinfo: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        columnGap: 2

    },
    middletext: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.7)'

    },
    buttoncard: {
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        alignItems: 'center',
        margin: 5,
        padding: 10,
        borderRadius: 10,
    },
    date: {
        fontWeight: 'bold',
    },
    temp: {
        fontWeight: 'bold',
        fontSize: 17
    }

});
