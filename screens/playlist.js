import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Playlist = () => {
    const [folders, setFolders] = useState([]);
    const navigation = useNavigation();
    // Fetch audio files from the media library
    useEffect(() => {
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
                setFolders(media.assets);
            }
        })();
    }, [])

const navigateplayMusicScreen = (item) => {
    navigation.navigate('Home', { librarySong: item });
}

    return (
        <View>
            {/* Show the list of audio files */}
            <FlatList
            style={styles.flatList}
                data={folders}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={()=>navigateplayMusicScreen(item)}>
                        <View style={styles.folderItemContainer}>
                        <MaterialCommunityIcons name="music-circle" size={44} color="white" />
                        <Text style={styles.folderItemText}>{item.filename.substring(0, 35)}...</Text>
                        <MaterialCommunityIcons style={{position:'absolute',right:8}} name="dots-vertical" size={32} color="white" />
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.uri}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    folderItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor:'#3c3f54',
        marginVertical:5,
        marginHorizontal:8,
        borderRadius:10
    },
    audioThumbnail: {
        width: 50,
        height: 50,
        marginRight: 10
    },
    folderItemText: {
        fontSize: 16,
        marginLeft:15,
        color: '#fff'
    },
    flatList:{
        backgroundColor:'#232534',
    }
});

export default Playlist;
