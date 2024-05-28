import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(0,0,0)',
  },
  folderItemContainer: {
    flexDirection: 'row',
    padding: 20,
    margin: 10,
    marginBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    backgroundColor: 'rgb(0,0,0)',
    borderRadius: 8,
  },
  folderItemText: {
    fontSize: 18,
    marginLeft: 10,
    color: 'white',
  },
  videoItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'white',
    backgroundColor: 'black',
  },
  videoThumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 8,
  },
  videoItemText: {
    fontSize: 16,
    color: 'white',
  },
  headerText: {
    padding: 20,
    marginBottom:10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor:'rgba(155, 29, 81, 0.6)'
  },
});

export default function VideoListScreen() {
  const [videoFolders, setVideoFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [videosInFolder, setVideosInFolder] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          const albums = await MediaLibrary.getAlbumsAsync();
          const videoAlbums = await Promise.all(
            albums.map(async (album) => {
              const assets = await MediaLibrary.getAssetsAsync({
                album: album.id,
                mediaType: 'video',
              });
              if (assets.totalCount > 0) {
                return album;
              }
              return null;
            })
          );

          setVideoFolders(videoAlbums.filter((album) => album !== null));
        }
      }
    })();
  }, []);

  const fetchThumbnails = async () => {
    if (videosInFolder.length > 0) {
      const videosWithThumbnails = await Promise.all(
        videosInFolder.map(async (video) => {
          const assetInfo = await MediaLibrary.getAssetInfoAsync(video);
          return { ...video, thumbnail: assetInfo.uri };
        })
      );
      setVideosInFolder(videosWithThumbnails);
    }
  };

  const renderFolderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.folderItemContainer}
      onPress={() => navigateToMediaInFolder(item)}
    >
      <Image
        source={{ uri: 'https://static-00.iconduck.com/assets.00/folder-icon-2048x1638-vinzc398.png' }}
        style={{ width: 24, height: 24 }}
      />
      <Text style={styles.folderItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.videoItemContainer}
      onPress={() => handlePlayVideo(item)}
    >
      <Image source={{ uri: item.uri }} style={styles.videoThumbnail} />
      <Text style={styles.videoItemText}>{item.filename}</Text>
    </TouchableOpacity>
  );

  const navigateToMediaInFolder = async (folder) => {
    const assets = await MediaLibrary.getAssetsAsync({ album: folder.id, mediaType: 'video' });
    setSelectedFolder(folder);
    setVideosInFolder(assets.assets);
    fetchThumbnails();
  };

  const handlePlayVideo = (video) => {
    navigation.navigate('VideoPlayer', { videoUri: video.uri });
  };

  const goBackToListFolders = () => {
    setSelectedFolder(null);
    setVideosInFolder([]);
  };

  return (
    <View style={styles.container}>
      {selectedFolder ? (
        <View>
          <TouchableOpacity onPress={goBackToListFolders}>
            <Text style={styles.headerText}>{'🔙 👈 Back to Folders 📂'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Videos in {selectedFolder.title}:</Text>
          <FlatList
            data={videosInFolder}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      ) : (
        <FlatList
          data={videoFolders}
          renderItem={renderFolderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}
