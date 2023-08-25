import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Police from './Police';
import FireEmergency from './FireEmergency';
import Spy from './Spy';
import CountyResidencyReport from './CountyResidencyReport';
import Complaints from './Complaints';

function ReportMain() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const components = [<Police />, <FireEmergency />, <Spy />, <CountyResidencyReport />, <Complaints />];
  const titles = ["경찰 신고", "소방·응급 신고", "간첩 신고", "군 주민신고", "민원 문의"];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {titles.map((title, index) => (
          <TouchableOpacity key={index} style={styles.tab} onPress={() => setSelectedIndex(index)}>
            <Text style={index === selectedIndex ? styles.selectedText : styles.text}>{title}</Text>
            {index === selectedIndex && <View style={styles.indicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.content}>
        {components[selectedIndex]}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    maxHeight: 50,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  text: {
    color: 'gray',
    fontSize: 18, // 글자 크기 조정
  },
  selectedText: {
    color: 'blue',
    fontSize: 18, // 글자 크기 조정
  },
  indicator: {
    height: 3,
    backgroundColor: 'blue',
    width: '100%', // 인디케이터의 길이를 탭의 길이와 동일하게 만듭니다.
    position: 'absolute',
    bottom: 0,
  },
  content: {
    flex: 1,
    padding: 10
  }
});

export default ReportMain;
