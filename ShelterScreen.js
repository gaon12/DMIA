import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Button, Overlay, Icon } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const ShelterScreen = () => {
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.5665,
    longitude: 126.9780,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [allowGps, setAllowGps] = useState(true);
  const [gpsPermission, setGpsPermission] = useState(null);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: '권한이 없어 현재 위치를 찾을 수 없습니다.',
          text2: '설정에서 권한 허용이 가능합니다.',
        });
        return;
      }

      Toast.show({
        type: 'info',
        text1: '현재 위치를 찾는 중입니다!',
      });

      const lightDark = await AsyncStorage.getItem('lightdark');
      const allowGpsValue = await AsyncStorage.getItem('allowgps');

      if (lightDark === 'auto') setTheme(colorScheme);
      if (allowGpsValue === 'false') setAllowGps(false);

      if (allowGps || allowGpsValue === null) {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, [allowGps, colorScheme]);

  return (
    <View style={theme === 'dark' ? styles.darkContainer : styles.lightContainer}>
      <MapView style={styles.map} region={mapRegion} onRegionChangeComplete={region => setMapRegion(region)}>
        {location && <Marker coordinate={location.coords} />}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button icon={<Icon name="plus" type="font-awesome" color="black" />} buttonStyle={styles.button} onPress={() => setMapRegion(prevRegion => ({
          ...prevRegion,
          latitudeDelta: prevRegion.latitudeDelta / 2,
          longitudeDelta: prevRegion.longitudeDelta / 2,
        }))} />
        <Button icon={<Icon name="minus" type="font-awesome" color="black" />} buttonStyle={styles.button} onPress={() => setMapRegion(prevRegion => ({
          ...prevRegion,
          latitudeDelta: prevRegion.latitudeDelta * 2,
          longitudeDelta: prevRegion.longitudeDelta * 2,
        }))} />
        {location && <Button icon={<Icon name="location-arrow" type="font-awesome" color="black" />} buttonStyle={styles.button} onPress={() => setMapRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        })} />}
        <Button icon={<Icon name="cog" type="font-awesome" color="black" />} buttonStyle={styles.button} onPress={() => setIsSettingsVisible(true)} />
        <Button icon={<Icon name="ellipsis-v" type="font-awesome" color="black" />} buttonStyle={styles.button} onPress={() => setIsOptionsVisible(true)} />
      </View>
      <Overlay isVisible={isSettingsVisible}>
        <Button title="닫기" onPress={() => setIsSettingsVisible(false)} />
      </Overlay>
      <Overlay isVisible={isOptionsVisible}>
        <Button title="닫기" onPress={() => setIsOptionsVisible(false)} />
      </Overlay>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
}

const styles = StyleSheet.create({
  lightContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
  },
  button: {
    backgroundColor: 'white',
    margin: 5,
  },
});

export default ShelterScreen;