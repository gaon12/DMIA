import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ButtonGroup, Slider, Switch, Divider } from 'react-native-elements';
import * as Localization from 'expo-localization';

const SettingsScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(Localization.locale === 'ko-KR' ? 0 : 1);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const buttons = ['한국어', 'English'];

  const updateIndex = (selectedIndex) => {
    setSelectedIndex(selectedIndex);
    // 언어 변경 로직을 추가할 수 있습니다. (예: i18n 라이브러리와 함께 사용)
  };

  return (
    <ScrollView style={[styles.container, darkMode ? styles.dark : styles.light]}>
      <Text h4 style={styles.title}>설정</Text>
      <Text style={[styles.label, { fontSize }]}>언어</Text>
      <ButtonGroup
        onPress={updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={styles.buttonGroupContainer}
      />
      <Divider style={styles.divider} />
      <Text style={[styles.label, { fontSize }]}>글자 크기</Text>
      <Slider
        value={fontSize}
        onValueChange={(value) => setFontSize(value)}
        minimumValue={10}
        maximumValue={30}
        thumbStyle={styles.thumbStyle}
        trackStyle={styles.trackStyle}
      />
      <Divider style={styles.divider} />
      <Text style={[styles.label, { fontSize }]}>다크 모드</Text>
      <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} thumbColor={darkMode ? '#f1c40f' : '#f4f3f4'} />
      <Divider style={styles.divider} />
      <Text style={[styles.label, { fontSize }]}>알림</Text>
      <Switch value={notifications} onValueChange={() => setNotifications(!notifications)} thumbColor={notifications ? '#f1c40f' : '#f4f3f4'} />
      <Divider style={styles.divider} />
      <Text style={[styles.label, { fontSize }]}>버전 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  light: {
    backgroundColor: 'white',
    color: 'black',
  },
  dark: {
    backgroundColor: 'black',
    color: 'white',
  },
  title: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
  },
  buttonGroupContainer: {
    marginBottom: 20,
  },
  divider: {
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  thumbStyle: {
    height: 20,
    width: 20,
  },
  trackStyle: {
    height: 4,
  },
});

export default SettingsScreen;
