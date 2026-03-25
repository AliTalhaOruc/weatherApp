import { ImageBackground, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const InfoPage = () => {
    const route = useRoute();
    const params = route.params;
    const textcolor = "white";

    return (
        <ImageBackground blurRadius={1} style={{ flex: 1 }} source={params.theme ? require("../assets/infoPagebgimg.webp") : require("../assets/nightthemebackgrund2.webp")}>
            <View style={styles.container}>
                <View style={styles.datestyle}>
                    <Text style={[styles.datetxt, { color: textcolor }]}>{params.date}</Text>
                    <Text>{params.theme}</Text>
                </View>

                <View style={{
                    width: '100%', height: '25%', justifyContent: 'center', alignItems: 'center',
                    marginTop: 15,
                }}>
                    <Text style={{ color: textcolor, fontWeight: 'bold', fontSize: 20, width: '90%' }}>{params.cityname} /  Hissedilen:{params.item.main.feels_like}</Text>
                    <Text style={{ fontSize: 70, color: textcolor, fontWeight: 'bold' }}>{params.item.main.temp}°</Text>
                    <View style={{ position: 'absolute', bottom: 0, left: '10%', width: '100%' }}>
                        <Text style={{ color: textcolor, fontSize: 17 }}>{params.item.weather[0].description}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 10, width: "100%", height: 70, }}>
                    <Image style={{ position: 'absolute', bottom: 0, width: 200, height: 200, right: 0, }} source={{ uri: `https://openweathermap.org/img/wn/${params.item.weather[0].icon}@2x.png` }} />
                </View>

                <View style={styles.middlecontainer}>
                    <View style={styles.middleinfocontainer}>
                        <Fontisto name="wind" size={24} color={textcolor} />
                        <Text style={[styles.middlecontainertxt, { color: textcolor }]}>{params.item.wind.speed} m/s</Text>
                        <Text style={{ color: textcolor }}>Rüzgar hızı</Text>
                    </View>
                    <View style={styles.middleinfocontainer}>
                        <Ionicons name="water" size={24} color={textcolor} />
                        <Text style={[styles.middlecontainertxt, { color: textcolor }]}>{params.item.main.humidity} %</Text>
                        <Text style={{ color: textcolor }}>Nem</Text>
                    </View>
                    <View style={styles.middleinfocontainer}>
                        <MaterialCommunityIcons name="car-brake-low-pressure" size={24} color={textcolor} />
                        <Text style={[styles.middlecontainertxt, { color: textcolor }]}>{params.item.main.pressure}</Text>
                        <Text style={{ color: textcolor }}>Basınç</Text>
                    </View>

                </View>

                <View style={styles.subinfocontainer}>
                    <View style={styles.subcontainerinfo}>
                        <Text style={[styles.subinfocontainertxt, { color: textcolor }]}>Max sıcaklık : {params.item.main.temp_max} C°</Text>
                    </View>
                    <View style={styles.subcontainerinfo}>
                        <Text style={[styles.subinfocontainertxt, { color: textcolor }]}>Görüş mesafesi : {params.item.visibility} </Text>
                    </View>
                    <View style={styles.subcontainerinfo}>
                        <Text style={[styles.subinfocontainertxt, { color: textcolor }]}>Deniz seviyesi : {params.item.main.sea_level} M</Text>
                    </View>
                    <View style={styles.subcontainerinfo}>
                        <Text style={[styles.subinfocontainertxt, { color: textcolor }]}>Rüzgar derece : {params.item.wind.deg} °</Text>
                    </View>
                </View>

            </View>
        </ImageBackground>
    )
}

export default InfoPage;

const styles = StyleSheet.create({
    container: {
        paddingTop: 80,
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 60
    },
    datestyle: {
        top: 10,
        width: '100%',
        alignItems: 'center',

    },
    datetxt: {
        fontSize: 20,
        fontWeight: 'bold',

    },
    middlecontainer: {
        width: '100%',
        height: "20%",
        flexDirection: 'row'
    },
    middleinfocontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 10,

        borderRadius: 30,
        marginHorizontal: 5,
        backgroundColor: "rgba(255,255,255,0.4)",

    },
    middlecontainertxt: {
        fontWeight: 'bold',
        fontSize: 20
    },
    subinfocontainer: {
        marginTop: 10,
        padding: 10,
        width: "100%",
        height: "30%",

    },
    subcontainerinfo: {
        flex: 1,
        marginVertical: 3,
        borderRadius: 20,
        paddingLeft: 10,
        justifyContent: 'center',
        backgroundColor: "rgba(255,255,255,0.4)"

    },
    subinfocontainertxt: {
        fontWeight: '600',
        fontSize: 20
    }

})