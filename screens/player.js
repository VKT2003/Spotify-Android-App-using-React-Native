import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, Image, } from 'react-native';
import base64 from 'react-native-base64';
import { useNavigation } from '@react-navigation/native';


const Player = () => {
    const clientId = '599ab1fde207493aac214ed842b26fd3';
    const clientSecret = 'ce8e0e204d4b495fab0297d5168b2614';
    const authUrl = 'https://accounts.spotify.com/api/token';
    const apiUrl = 'https://api.spotify.com/v1/search?type=track&q=';
    const [query, setQuery] = useState('');
    const [songs, setSongs] = useState([]);

    const base64Encode = (str) => {
        return base64.encode(str);
    };
    const navigation = useNavigation();
    // Fetch songs from Spotify API
    const fetchData = async () => {
        try {
            const response = await fetch(authUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${base64Encode(`${clientId}:${clientSecret}`)}`,
                },
                body: 'grant_type=client_credentials',
            });

            const data = await response.json();
            const accessToken = data.access_token;

            const response1 = await fetch(`${apiUrl}${query}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data1 = await response1.json();
            const tracks = data1.tracks.items;

            const fetchedSongs = tracks.map(track => ({
                id: track.id,
                title: track.name,
                artist: track.artists[0].name,
                thumbnail: track.album.images[0].url,
                url: track.preview_url,
            }));

            setSongs(fetchedSongs);
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    const navigatePlayMusicScreen = (item) => {
        navigation.navigate('Home', { currentSong:item });
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                <TextInput
                    placeholder="Search any song"
                    placeholderTextColor={'white'}
                    onChangeText={(e) => setQuery(e)}
                    value={query}
                    style={{ borderRadius: 10, borderWidth: 0.3, padding: 10, marginRight: 10, borderColor: 'white', color: 'white', width: '80%' }}
                />
                <TouchableOpacity style={{ borderRadius: 10, borderWidth: 0.3, padding: 10, marginRight: 10, height: 50, borderColor: 'white', paddingTop: 14 }} onPress={fetchData}>
                    <Text style={{ color: 'white' }}>Search</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                style={{ marginTop: 10 ,padding:10,}}
                data={songs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 ,padding:7,borderBottomWidth:0.3,borderBottomColor:'white'}} onPress= {() => navigatePlayMusicScreen(item)}>
                        <Image source={{ uri: item.thumbnail }} style={{ width: 80, height: 80, borderRadius: 13 }} />
                        <View style={{ marginLeft: 15 }}>
                            <Text style={{ color: 'white', fontSize: 16 }}>{item.title}</Text>
                            <Text style={{ color: 'white', fontSize: 12 }}>{item.artist}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#232534',
    }
});

export default Player;
