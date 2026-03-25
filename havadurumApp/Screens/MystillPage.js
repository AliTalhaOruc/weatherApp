import { View, Text, StyleSheet } from "react-native"
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import LottieView from "lottie-react-native";
import { Getdomtext } from "../Getdomtext";

export const MystillPage = () => {
    const [chartData, setChartData] = useState([]);
    const totalVotes = chartData.reduce((sum, item) => sum + item.population, 0);
    const dominant = chartData.reduce((prev, curr) => (curr.population > prev.population ? curr : prev), chartData[0]);
    const [flag, setFlag] = useState(false)
    const [isempty, setIsempty] = useState(false)
    const screenWidth = Dimensions.get("window").width;

    const getColorForStyle = (style) => {
        switch (style) {
            case 'Minimalist': return '#A0CED9';
            case 'Sportif': return '#C3F0CA';
            case 'Vintage': return '#FBC4AB';
            case 'Bohem': return '#D7A9E3';
            case 'Casual': return '#B0AEAC';
            case 'Cool/Urban': return '#2B3941'
            case 'Şık/Elegant': return '#11125F'
            case 'Renkli/Fun': return '#B42AA1'
            default: return '#ccc';
        }
    };
    const transformToChartData = (votes) => {
        return Object.keys(votes).map((style, index) => ({
            name: style,
            population: votes[style],
            color: getColorForStyle(style),
            legendFontColor: "#333",
            legendFontSize: 12
        }));
    };
    useEffect(() => {
        (async () => {
            const raw = await AsyncStorage.getItem("styleVotes");
            const parsed = raw ? JSON.parse(raw) : {};
            if (Object.keys(parsed).length === 0) {
                setIsempty(true);
                return;
            }

            const transformed = transformToChartData(parsed);
            setChartData(transformed);
        })();
    }, []);

    // useEffect(() => {
    //     const sampleVotes = {
    //         "Bohem": 0,
    //         "Sportif": 0,
    //         "Minimalist": 0
    //     };
    //     const transformed = transformToChartData(sampleVotes);
    //     setChartData(transformed);
    //     setFlag(true);
    // }, []);

    return (
        <View style={styles.container}>

            {isempty &&
                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Henüz secim yapmadınız</Text>
                    <LottieView
                        source={require("../assets/empty_State.json")}
                        autoPlay
                        loop
                        style={{ width: 300, height: 300 }}
                    />
                </View>
            }

            <PieChart
                data={chartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                    color: () => "#fff",
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 0]}
                hasLegend={true}
            />

            {dominant?.name && (
                <>


                    <View><Text style={{ fontWeight: '700', fontSize: 16, paddingHorizontal: 30 }}>{`Bu zamana kadar ${totalVotes} oy verdin. En baskin stilin: ${dominant.name} ✨`}</Text></View>
                    <View style={{ justifyContent: 'space-evenly', alignItems: 'center', borderRadius: 25, padding: 10, backgroundColor: getColorForStyle(dominant.name), marginHorizontal: 40, borderWidth: 1, height: '35%' }}>
                        <View><Text style={{ fontSize: 20, fontWeight: 'bold' }}>{dominant.name}</Text></View>
                        <View><Text style={{ fontSize: 15, fontWeight: '700', textAlign: 'center', marginTop: 8 }}>{Getdomtext(dominant.name)}</Text></View>
                    </View>
                </>
            )}




        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 50,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    }
})