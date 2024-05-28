import React, { useEffect, useState, useRef, useRoute } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Image, Platform, ScrollView, Alert, Modal, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import base64 from 'react-native-base64';
import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';


const defaultThumbnail = { uri: 'https://img.freepik.com/free-photo/phone-with-music-icon-headphones-blurred-background-music-listening-concept-copy-space_169016-14360.jpg?w=996&t=st=1709444622~exp=1709445222~hmac=e46c75533bc86727bb07659617d35146ebf511683c7e89f6427893c285ac9722' };

const Home = ({ route }) => {
  const currentSong = route.params?.currentSong;
  const librarySong = route.params?.librarySong;

  const [englishSongs, setEnglishSongs] = useState([]);
  const [hindiSongs, setHindiSongs] = useState([]);
  const [punjabiSongs, setPunjabiSongs] = useState([]);
  const [hiphopSongs, setHiphopSongs] = useState([]);
  const [hindiRetroSongs, setHindiRetroSongs] = useState([]);
  const [currentAudioThumbnail, setCurrentAudioThumbnail] = useState(defaultThumbnail.uri);
  const [currentAudioTitle, setCurrentAudioTitle] = useState('');
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFixedViewVisible, setIsFixedViewVisible] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState('');
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState('english');


  const navigation = useNavigation();
  const clientId = '599ab1fde207493aac214ed842b26fd3';
  const clientSecret = 'ce8e0e204d4b495fab0297d5168b2614';
  const authUrl = 'https://accounts.spotify.com/api/token';
  const apiUrl = 'https://api.spotify.com/v1/search?type=track&q=';
  const englishQuery = ['shape of you', 'perfect', 'play date', 'way down we go', 'safari serena', 'another love', 'cupid', 'play alan walker', 'headlights', 'faded'];
  const hindiQuery = ['mehrama', 'tum hi ho', 'dunki', 'chaleya', 'labon ko pritam', 'tum se hi pritam', 'tu hi haqeeqat', 'tum mile', 'tum ho', 'matargashti'];
  const punjabiQuery = ['qismat', 'dil diyan gallan', 'jaguar sukh e', 'kya baat ay', 'na ja', 'high rated gabru', 'made in india', 'raat di gedi', 'Daku', 'Elevated Shubh'];
  const hiphopQuery = ['as it was', 'lush life', 'Dancin', 'cradles sub urban', 'there you are zayn', 'one thing right', 'hello', 'night changes', 'you and i one direction', 'snap'];
  const hindiRetroQuery = ['mere sapno ki rani', 'ye kahan aa gaye hum', 'mere naina sawan bhado', 'mere mehboob qayamat hogi', 'yeh sham mastani', 'ye raat bheegi bheegi', 'ye raaten ye mausam', 'tere bina zindagi se', 'tere bina jiya jaye na', 'dekha ek khwab','kora kagaz tha ye man mera','kabhi kabhi mere dil me','chalte chalte yun hi koi lata mangeshkar','tum aa gaye ho','tum jo mil gaye ho','tum pukar lo',];
  const base64Encode = (str) => {
    return base64.encode(str);
  };

  const spinValue = useRef(new Animated.Value(0)).current; // Using useRef instead of useState

  useEffect(() => {
    Animated.loop(
      Animated.timing(
        spinValue,
        {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }
      )
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });


  useEffect(() => {
    // Check if currentSong exists and is different from the currently playing song
    if (currentSong && currentSong !== currentAudioUrl) {
      playSound(currentSong.url, currentSong.title, currentSong.thumbnail, currentSong.language);
      setIsFixedViewVisible(true); // Show the fixed view when playing the current song
    }
  }, [currentSong]);

  //handle library song
  useEffect(() => {
    if (librarySong && librarySong !== currentAudioUrl) {
      playSound(librarySong.uri, librarySong.filename.substring(0, 30), "https://images.ctfassets.net/bdyhigkzupmv/6lySzcy7qcIN1tf81Qkus/5b5ac73daeaf61f9057c0b0dd8447a31/hero-guitar-outro.jpg", 'english');
      setIsFixedViewVisible(true);
    }
  }, [librarySong])

  // Rest of your code...
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchSongs = async (language, queries, setSongs) => {
          const allThumbnails = [];
          for (let i = 0; i < queries.length; i++) {
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
            const response2 = await fetch(`${apiUrl}${queries[i]}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            const data2 = await response2.json();
            const track = data2.tracks.items[0]; // Fetch only the first song
            const thumbnail = {
              id: track.id,
              thumbnail: track.album.images[0]?.url || defaultThumbnail.uri,
              title: track.name,
              preview_url: track.preview_url,
              language,
            };
            allThumbnails.push(thumbnail);
          }
          setSongs(allThumbnails);
        };

        await fetchSongs('english', englishQuery, setEnglishSongs);
        await fetchSongs('hindi', hindiQuery, setHindiSongs);
        await fetchSongs('punjabi', punjabiQuery, setPunjabiSongs);
        await fetchSongs('hiphop', hiphopQuery, setHiphopSongs);
        await fetchSongs('hindiRetro', hindiRetroQuery, setHindiRetroSongs);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };
    fetchData();
  }, []);

  const playSound = async (uri, title, thumbnail, language) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      setCurrentLanguage(language);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setCurrentAudioTitle(title);
            setCurrentAudioThumbnail(thumbnail);
            setCurrentAudioUrl(uri);
            setPosition(status.positionMillis);
            setDuration(status.durationMillis);
          } else {
            console.log('Error loading sound:', status.error);
            // Handle error loading sound
          }
        }
      );

      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate); // Set the onPlaybackStatusUpdate function
    } catch (error) {
      console.error('Error playing sound:', error);
      // Handle other errors
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    setIsPlaying(status.isPlaying);
    setPosition(status.positionMillis);
    setDuration(status.durationMillis);
  };

  const onSeek = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setPosition(value);

      // Check if the seek position is close to the end of the track
      const nearEndThreshold = 2900; // You can adjust this threshold as needed
      if (duration - value <= nearEndThreshold) {
        // Play the next song when seeking near the end
        playNextSong();
      }
    }
  };

  const playNextSong = async () => {
    let currentLanguageSongs = [];
    console.log(currentLanguage);
    switch (currentLanguage) {
      case 'english':
        currentLanguageSongs = englishSongs;
        break;
      case 'hindi':
        currentLanguageSongs = hindiSongs;
        break;
      case 'punjabi':
        currentLanguageSongs = punjabiSongs;
        break;
      case 'hiphop':
        currentLanguageSongs = hiphopSongs;
        break;
      case 'hindiRetro':
        currentLanguageSongs = hindiRetroSongs;
        break;
      default:
        currentLanguageSongs = [];
    }

    // Find the index of the current song
    const currentIndex = currentLanguageSongs.findIndex(song => song.preview_url === currentAudioUrl);

    // Play the next song if available
    if (currentIndex !== -1 && currentIndex < currentLanguageSongs.length - 1) {
      const nextSong = currentLanguageSongs[currentIndex + 1];
      await playSound(nextSong.preview_url, nextSong.title, nextSong.thumbnail, nextSong.language); // Pass the language of the next song
    }
  };


  const playPreviousSong = () => {
    let currentLanguageSongs = [];

    switch (currentLanguage) {
      case 'english':
        currentLanguageSongs = englishSongs;
        break;
      case 'hindi':
        currentLanguageSongs = hindiSongs;
        break;
      case 'punjabi':
        currentLanguageSongs = punjabiSongs;
        break;
      case 'hiphop':
        currentLanguageSongs = hiphopSongs;
        break;
      case 'hindiRetro':
        currentLanguageSongs = hindiRetroSongs;
        break;
      default:
        currentLanguageSongs = [];
    }

    // Find the index of the current song
    const currentIndex = currentLanguageSongs.findIndex(song => song.preview_url === currentAudioUrl);

    // Play the previous song if available
    if (currentIndex !== -1 && currentIndex > 0) {
      const previousSong = currentLanguageSongs[currentIndex - 1];
      playSound(previousSong.preview_url, previousSong.title, previousSong.thumbnail, previousSong.language);
    }
  };




  const stopSound = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
      Alert.alert('Error', 'Failed to stop the audio.');
    }
  };

  const toggleSound = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error('Error toggling sound:', error);
      Alert.alert('Error', 'Failed to toggle the sound.');
    }
  };

  // download with mp3 extention
  const downloadfile = async (uri,title) => {
    const filename = title;
    const result = await FileSystem.downloadAsync(
      uri,
      FileSystem.documentDirectory + filename
    );
    save(result.uri, filename, result.headers["Content-Type"]);
  }
  const save = async (uri, filename, mimetype) => {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
          })
          .catch(e => console.log(e));
      } else {
        shareAsync(uri);
      }
    } else {
      shareAsync(uri);
    }
    Alert.alert("Downloaded", "Your file has been downloaded successfully");
  };



  const [isVisible, setIsVisible] = useState(false);

  const navigateToPlayMusicScreen = () => {
    setIsVisible(true);
  };

  const handleDown = () => {
    setIsVisible(false);
  }

  const renderAudioThumbnail = ({ item }) => (
    <TouchableOpacity onPress={() => { playSound(item.preview_url, item.title, item.thumbnail, item.language); setIsFixedViewVisible(true); }}>
      <View style={styles.thumbnailContainer}>
        <Image
          style={styles.thumbnail}
          source={{ uri: item.thumbnail }}
        />
        <Text style={styles.title}>{item.title.substring(0,15)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
          <Text style={{ color: 'white', alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginBottom: 15 }}>English Songs</Text>
          <FlatList
            style={styles.flatListContainer}
            horizontal
            data={englishSongs}
            keyExtractor={(item) => item.id}
            renderItem={renderAudioThumbnail}
          />

          <Text style={{ color: 'white', alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginBottom: 15 }}>Hindi Songs</Text>
          <FlatList
            style={styles.flatListContainer}
            horizontal
            data={hindiSongs}
            keyExtractor={(item) => item.id}
            renderItem={renderAudioThumbnail}
          />

          <Text style={{ color: 'white', alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginBottom: 15 }}>Punjabi Songs</Text>
          <FlatList
            style={styles.flatListContainer}
            horizontal
            data={punjabiSongs}
            keyExtractor={(item) => item.id}
            renderItem={renderAudioThumbnail}
          />
          <Text style={{ color: 'white', alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginBottom: 15 }}>Hip Hop Melodies</Text>
          <FlatList
            style={styles.flatListContainer}
            horizontal
            data={hiphopSongs}
            keyExtractor={(item) => item.id}
            renderItem={renderAudioThumbnail}
          />
          <Text style={{ color: 'white', alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 20, marginBottom: 15 }}>Hindi Retro</Text>
          <FlatList
            style={styles.flatListContainer}
            horizontal
            data={hindiRetroSongs}
            keyExtractor={(item) => item.id}
            renderItem={renderAudioThumbnail}
          />

        </View>
      </ScrollView>
      {isFixedViewVisible && (
        <TouchableWithoutFeedback onPress={navigateToPlayMusicScreen}>
          <View style={styles.fixedView}>
            <View style={styles.audioInfoContainer}>
              <Animated.Image style={[{ width: 50, height: 50, borderRadius: 50 }, { transform: [{ rotate: spin }] }]} source={{ uri: currentAudioThumbnail }} />
              <Text style={{ fontSize: 15, color: 'white' }}>{currentAudioTitle}</Text>
            </View>
            <TouchableOpacity onPress={toggleSound}>
              {isPlaying ? <AntDesign name="pause" size={44} color="white" /> : <Entypo name="controller-play" size={44} color="white" />}
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      )}
      <Modal animationType='slide' visible={isVisible} style={styles.modal} onRequestClose={() => {
        setIsVisible(!isVisible);
      }}>
        <View style={styles.down}>
          <AntDesign name="down" size={24} color="black" style={styles.downarrow} onPress={handleDown} />
        </View>
        <View style={styles.container1}>
          <Text style={styles.title1}>Now Playing</Text>
          {currentAudioThumbnail && (
            <Image
              style={styles.thumbnail1}
              source={{ uri: currentAudioThumbnail }}
            />
          )}
          {currentAudioTitle && (
            <Text style={styles.title1}>{currentAudioTitle}</Text>
          )}
          <View style={{ flexDirection: 'row', marginTop: 70 }}>
            <Slider
              style={{ width: 300, marginLeft: 14 }}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onSlidingComplete={onSeek}
              disabled={!sound}
            />
            <Text style={{ color: 'white' }}>{formatTime(duration)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 40, marginTop: 40 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 30, marginLeft: 8 }}>
              <TouchableOpacity onPress={playPreviousSong} style={{ marginLeft: 50 }}>
                <AntDesign name="banckward" size={40} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleSound}>
                {isPlaying ? <AntDesign name="pausecircle" size={40} color="white" /> : <AntDesign name="play" size={40} color="white" />}
              </TouchableOpacity>
              <TouchableOpacity onPress={playNextSong}>
                <AntDesign name="forward" size={40} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>downloadfile(currentAudioUrl,currentAudioTitle)}>
              <MaterialIcons name="file-download" size={40} color="white" />
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </>
  );
}
const formatTime = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};
const styles = StyleSheet.create({
  modal: {
    marginBottom: 50,
    backgroundColor: '#232534'
  },
  container: {
    flexGrow: 1,
    padding: 4,
    backgroundColor: '#232534',
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#232534',
    // marginBottom:50
  },
  title: {
    color: 'white',
    fontSize: 15,
    marginBottom: 10,
  },
  flatListContainer: {
    // No marginBottom to reduce the gap
    marginBottom: 45,
  },
  thumbnailContainer: {
    marginRight: 10,
    alignItems: 'center',
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  fixedView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#232534',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopColor: '#45475b',
    borderTopWidth: 1.5,
  },
  audioInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  title1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white'
  },
  thumbnail1: {
    width: 300,
    height: 300,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 20,
  },
  down: {
    padding: 10
  },
  downarrow: {
    fontSize: 30
  }

});

export default Home;