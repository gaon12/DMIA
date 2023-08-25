import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Button, CheckBox, Icon } from 'react-native-elements';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const LocationSection = ({ location, loadingLocation, locationError, address, showMap, setShowMap, onMapPress }) => (
  <View>
    <Text>
      현재 위치: {loadingLocation ? "위치 정보를 가져오는 중..." : locationError ? "위치 정보를 가져오지 못했습니다." : address ? `${address.city} ${address.borough} ${address.road} ${address.house_number ? `${address.house_number} ` : ""}(${address.quarter ? `${address.quarter} ` : ""}${address.building ? address.building : ""})` : "위치를 불러오는 중..."}
    </Text>
    <Text>좌표: {location && `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`}</Text>
    <Button
      title={showMap ? "지도 접기" : "지도"}
      containerStyle={styles.mapButtonContainer}
      onPress={() => {
        location ? setShowMap(!showMap) : alert("위도와 경도 값이 없습니다.");
      }}
    />
    {showMap && <MapView initialRegion={{ latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }} onPress={onMapPress} style={styles.map}><Marker coordinate={location} /></MapView>}
  </View>
);

const TextInputSection = () => (
  <>
    <TextInput style={{ ...styles.textInput, height: '15%' }} placeholder="현재 상황을 적어주세요." />
    <TextInput style={styles.textInput} placeholder="발생한 날짜와 시간을 적어주세요." />
    <TextInput style={{ ...styles.textInput, height: '30%' }} placeholder="신고 내용을 입력하세요" multiline />
  </>
);

const ReportContent = ({ textReportType, setStep, getLocation, location, loadingLocation, locationError, address, showMap, setShowMap, onMapPress }) => (
  <ScrollView style={styles.box}>
    {textReportType === 1 && <LocationSection location={location} loadingLocation={loadingLocation} locationError={locationError} address={address} showMap={showMap} setShowMap={setShowMap} onMapPress={onMapPress} />}
    <TextInputSection />
    <View style={styles.buttonRow}>
      <Button title="이전 단계" onPress={() => setStep(step - 1)} />
      <Button title="신고 완료" onPress={() => setStep(4)} />
    </View>
  </ScrollView>
);

const Police = () => {
  const [step, setStep] = useState(1);
  const [reportMethod, setReportMethod] = useState(null);
  const [textReportType, setTextReportType] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(false);

  const getLocation = useCallback(async () => {
    setLoadingLocation(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      setLocationError(true);
      setLoadingLocation(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setLocation({ latitude, longitude });
    reverseGeocoding(latitude, longitude);
    setLoadingLocation(false);
  }, []);

  const reverseGeocoding = (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => setAddress(data.address));
  };

  const onMapPress = e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    reverseGeocoding(latitude, longitude);
  };

  useEffect(() => {
    if (textReportType === 1) {
      getLocation();
    }
  }, [textReportType, getLocation]);

  const renderOptions = () => (
    <View style={styles.box}>
      {reportOptions.map((option, index) => (
        <Button
          key={index}
          title={option}
          titleStyle={styles.buttonTitle}
          containerStyle={styles.buttonContainer}
          buttonStyle={{
            ...styles.button,
            backgroundColor: buttonColors[index],
          }}
          onPress={() => {
            setReportMethod(index);
            setStep(2);
          }}
        />
      ))}
    </View>
  );

  const renderTextReport = () => (
    <View style={styles.box}>
      {textReportOptions.map((option, index) => (
        <CheckBox
          key={index}
          title={option}
          checked={textReportType === index}
          onPress={() => setTextReportType(index)}
        />
      ))}
      <Button
        title="다음 단계"
        onPress={() => setStep(3)}
        disabled={textReportType === null}
      />
    </View>
  );

  const renderComplete = () => (
    <View style={styles.box}>
      <Text style={styles.headerText}>신고 완료</Text>
      <Text>신고가 완료되었습니다. 감사합니다.</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progressContainer}>
        {steps.map((s, index) => (
          <>
            <View style={styles.stepContainer}>
              <TouchableOpacity onPress={() => index < step && setStep(index + 1)}>
                <Icon name={stepIcons[index]} type="font-awesome" size={15} />
                <Text style={[styles.stepText, index < step ? styles.activeStep : index === step - 1 ? styles.currentStep : styles.inactiveStep]}>{s}</Text>
              </TouchableOpacity>
            </View>
            {index < steps.length - 1 && <View style={styles.arrowContainer}><Text style={styles.arrow}>→</Text></View>}
          </>
        ))}
      </View>
      {step === 1 && renderOptions()}
      {step === 2 && reportMethod === 0 && renderTextReport()}
      {step === 2 && reportMethod !== 0 && <ReportContent textReportType={textReportType} setStep={setStep} getLocation={getLocation} location={location} loadingLocation={loadingLocation} locationError={locationError} address={address} showMap={showMap} setShowMap={setShowMap} onMapPress={onMapPress} />}
      {step === 3 && <ReportContent textReportType={textReportType} setStep={setStep} getLocation={getLocation} location={location} loadingLocation={loadingLocation} locationError={locationError} address={address} showMap={showMap} setShowMap={setShowMap} onMapPress={onMapPress} />}
      {step === 4 && renderComplete()}
      {step > 1 && <Button title="이전 단계" onPress={() => setStep(step - 1)} containerStyle={styles.prevButtonContainer} />}
    </ScrollView>
  );
};

const steps = ['유형', '입력', '완료'];
const reportOptions = ['문자 신고', '온라인 신고 (온라인 범죄만)', '전화 신고'];
const buttonColors = ['#ff4757', '#1e90ff', '#2ed573'];
const textReportOptions = ['직접 모든 내용을 입력', '위치, 상황, 시간 등을 칸으로 나누어 입력', '미리 준비되어 있는 신고 사항들 선택 (교통사고, 싸움 발생 등)'];
const stepIcons = ['file-text-o', 'keyboard-o', 'check-circle-o'];

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  progressContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  stepContainer: { flexDirection: 'row', alignItems: 'center' },
  arrowContainer: { justifyContent: 'center', alignItems: 'center' },
  stepText: { marginLeft: 5 },
  activeStep: { color: 'blue' },
  currentStep: { fontWeight: 'bold' },
  inactiveStep: { color: 'grey' },
  box: { margin: 5, padding: 7, borderRadius: 10, backgroundColor: '#ffffff', marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  buttonTitle: { color: '#ffffff' },
  button: { backgroundColor: '#007bff' },
  buttonContainer: { marginBottom: 20 },
  textInput: { marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  map: { height: 300, borderRadius: 10, margin: 10 },
  arrow: { fontSize: 24, fontWeight: 'bold' },
  prevButtonContainer: { marginTop: 10 },
  mapButtonContainer: { marginTop: 10, marginBottom: 10 },
});

export default Police;
