import { Text, StyleSheet, View, TouchableOpacity, ActivityIndicator, ImageBackground } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useEffect, useState } from "react"
import axios from "axios"
import { ScrollView } from "react-native-gesture-handler"
import Markdown from "react-native-markdown-display"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useContext } from "react";
import { WeatherContext } from "../WeatherContext"

export const GardropPage = () => {
    let alreadyVoted;
    const [Chatresponse, setChatresponse] = useState("")
    const [Loadingchatgpt, setLoadingchatgpt] = useState(false)
    const primarycolor = 'rgba(255,255,255,.8)'
    const [alreadygetcombin, setAlreadygetcombin] = useState(false)
    const [todayvote, setTodayvote] = useState(false)
    const [style, setstyle] = useState("")
    const navigation = useNavigation();
    const { weatherData } = useContext(WeatherContext);

    const saveCombin = async (combination) => {
        const today = new Date().toISOString().slice(0, 10);
        const data = { date: today, combination };
        await AsyncStorage.setItem("todaycombination", JSON.stringify(data));
        const exist = await loadcombin();
        if (exist) {
            setChatresponse(exist);
            setAlreadygetcombin(true);
        }

    }

    const loadcombin = async () => {
        const exist = await AsyncStorage.getItem("todaycombination");
        if (!exist) {
            alreadyVoted = false;
            return null;
        }

        const parsed = JSON.parse(exist);
        const today = new Date().toISOString().slice(0, 10);

        if (parsed.date === today) {
            setAlreadygetcombin(true);
            return parsed.combination;

        } else {
            await AsyncStorage.removeItem("todaycombination");
            return null;
        }
    };

    useEffect(() => {
        (async () => {
            const exist = await loadcombin();
            if (exist)
                setChatresponse(exist)
        })()
    }, [])
    // useEffect(() => {
    //     (async () => {
    //         const exist = await loadcombin();
    //         console.log("Kombin geldi mi?", exist);
    //         if (exist) {
    //             setChatresponse(exist);
    //             console.log("Kombin ayarlandı:", exist);
    //         }
    //     })();
    // }, []);

    const askGPT = async (tarz) => {

        const prompt = `${weatherData?.tempurature}°C ve ${weatherData?.condition} havada ne giyilir? 2 farklı kombin öner.${tarz} tarzda olsun, biri erkek biri kadın için olsun. Her kombin şu yapıda olsun bir de cevap verirken basına ${tarz} ekle:
- Üst:
- Alt:
- Ayakkabı:
- Aksesuar:`;

        setLoadingchatgpt(true);

        try {
            const result = await axios.post("http://localhost:5000/chat", {
                prompt: prompt
            });

            const content = result.data.choices[0].message.content;

            setChatresponse(content);
            await saveCombin(content);
            console.log(content);

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingchatgpt(false);
        }
    };

    const handlevote = async (style) => {
        const today = new Date().toISOString().slice(0, 10);
        const flagKey = `vote-${today}`;

        setAlreadygetcombin = await AsyncStorage.getItem(flagKey);
        if (alreadygetcombin) return;

        const existing = await AsyncStorage.getItem("styleVotes");
        const parsed = existing ? JSON.parse(existing) : {};
        parsed[style] = (parsed[style] || 0) + 1;

        await AsyncStorage.setItem("styleVotes", JSON.stringify(parsed));
        await AsyncStorage.setItem(flagKey, "true");
    };
    return (

        <ImageBackground blurRadius={12} style={{ flex: 1 }} resizeMode='cover' source={require("../assets/gardropbackground.jpg")}>
            <View style={styles.container}>
                {/* <View style={{ width: '100%' }}>
                    <View style={{ position: 'absolute', right: 0, top: -55 }}>
                        <TouchableOpacity onPress={() => navigation.navigate("MystillPage")} style={{ padding: 10, borderWidth: 1, borderRadius: 20 }}>
                            <Text style={{ fontWeight: 'bold' }}>Stil özetine git</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}
                <Text style={{ fontSize: 15, color: primarycolor }}>Hangi tarzda giyinmek istersiniz ?</Text>
                <View style={{ width: '100%', height: '10%', marginTop: 10, flexDirection: 'row', columnGap: 4 }}>
                    <View style={{ flex: 1, borderWidth: 1 }}>
                        <TouchableOpacity disabled={alreadygetcombin} onPress={() => {
                            askGPT("Minimalist")
                            setstyle("Minimalist")
                            handlevote("Minimalist");

                        }} style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 3 }, alreadygetcombin && styles.disabledbuttom]}>
                            <View>
                                <Text style={{ color: primarycolor }} >Minimalist</Text>
                            </View>
                            <View>
                                <Text>🧘‍♂️</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, borderWidth: 1 }}>
                        <TouchableOpacity disabled={alreadygetcombin} onPress={() => { askGPT("Sportif"), setstyle("Sportif"), handlevote("Sportif"); }} style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 3 }, alreadygetcombin && styles.disabledbuttom]}>
                            <View>
                                <Text style={{ color: primarycolor }}>Sportif</Text>
                            </View>
                            <View>
                                <Text>🏃‍♀️</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, borderWidth: 1 }}>
                        <TouchableOpacity disabled={alreadygetcombin} onPress={() => { askGPT("Vintage"), setstyle("Vintage"), handlevote("Vintage"); }} style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 3 }, alreadygetcombin && styles.disabledbuttom]}>
                            <View>
                                <Text style={{ color: primarycolor }}>Vintage</Text>
                            </View>
                            <View>
                                <Text>📼</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, borderWidth: 1 }}>
                        <TouchableOpacity disabled={alreadygetcombin} onPress={() => { askGPT("Bohem"), setstyle("Bohem"), handlevote("Bohem"); }} style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 3 }, alreadygetcombin && styles.disabledbuttom]}>
                            <View>
                                <Text style={{ color: primarycolor }}>Bohem</Text>
                            </View>
                            <View>
                                <Text>🌻</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ width: '100%', columnGap: 4, height: '10%', marginTop: 4, flexDirection: 'row' }}>
                    <View style={{ flex: 1, borderWidth: 1 }}>
                        <TouchableOpacity disabled={alreadygetcombin} onPress={() => { askGPT("Casual"), setstyle("Casual"), handlevote("Casual") }} style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 3 }, alreadygetcombin && styles.disabledbuttom]}>
                            <View>
                                <Text style={{ color: primarycolor }}>Casual</Text>
                            </View>
                            <View>
                                <Text>👕</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, borderWidth: 1 }}>
                        <TouchableOpacity disabled={alreadygetcombin} onPress={() => { askGPT("Cool/Urban"), setstyle("Cool/Urban"), handlevote("Cool/Urban") }} style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 3 }, alreadygetcombin && styles.disabledbuttom]}>
                            <View>
                                <Text style={{ color: primarycolor }}>Cool/Urban</Text>
                            </View>
                            <View>
                                <Text>😎</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, borderWidth: 1 }}>
                        <TouchableOpacity disabled={alreadygetcombin} onPress={() => { askGPT("Şık/Elegant"), setstyle("Şık/Elegant"), handlevote("Şık/Elegant") }} style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 3 }, alreadygetcombin && styles.disabledbuttom]}>
                            <View>
                                <Text style={{ color: primarycolor }}>Şık/Elegant</Text>
                            </View>
                            <View>
                                <Text>👔</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, borderWidth: 1 }}>
                        <TouchableOpacity disabled={alreadygetcombin} onPress={() => { askGPT("Renkli/Fun"), setstyle("Renkli/Fun"), handlevote("Renkli/Fun") }} style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 3 }, alreadygetcombin && styles.disabledbuttom]}>
                            <View>
                                <Text style={{ color: primarycolor }}>Renkli/Fun</Text>
                            </View>
                            <View>
                                <Text>🎨</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>



                <View style={{ borderRadius: 10, width: '100%', height: '60%', marginTop: 20, backgroundColor: 'rgba(50,50,50,.7)' }}>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ padding: 16 }}
                        showsVerticalScrollIndicator={true}
                    >
                        {Loadingchatgpt ? (

                            <ActivityIndicator size="large" color="white" />
                        ) : (
                            <Markdown
                                style={{
                                    body: {
                                        color: '#fff',
                                        fontSize: 16,
                                        lineHeight: 24,
                                    },
                                    strong: { color: '#FFD700' },
                                    bullet_list: { marginVertical: 4 },
                                }}
                            >
                                {Chatresponse}
                            </Markdown>
                        )}
                    </ScrollView>
                </View>
                {/* {
                    alreadyVoted ? (<View style={{ borderRadius: 15, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', width: '90%', borderWidth: 1, height: '5%', marginTop: 10 }}>
                        <View style={{ justifyContent: 'center', flexDirection: 'row', columnGap: 5, flex: 1, alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => handlevote(style)} style={{ padding: 5 }}><Text>Beğendim</Text></TouchableOpacity>
                            <Text><AntDesign name="checkcircle" size={24} color="green" /></Text>
                        </View>
                        <View style={{ justifyContent: 'center', flexDirection: 'row', columnGap: 5, flex: 1, alignItems: 'center' }}>
                            <TouchableOpacity style={{ padding: 5 }}><Text>Beğenmedim </Text></TouchableOpacity>
                            <Text><Entypo name="circle-with-cross" size={24} color="rgba(239, 15, 15, 0.8)" /></Text>
                        </View>
                    </View>) : null

                } */}

            </View >

        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    disabledbuttom: {
        backgroundColor: '#ddd',
        opacity: 0.6

    }

})