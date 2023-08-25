import React from 'react';
import { View, Linking, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

const makeCall = (number) => {
  Alert.alert(
    '알림',
    '장난전화 및 허위신고는 처벌 대상입니다. 하지 말아 주세요! 계속 진행할까요?',
    [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '신고',
        onPress: () => Linking.openURL(`tel:${number}`),
      },
    ]
  );
};

const ActionGuideScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.box}>
      <Card containerStyle={{ margin: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Card.Title>신고</Card.Title>
          <TouchableOpacity onPress={() => navigation.navigate('ReportMain')}>
            <Text style={{ color: 'blue' }}>더보기</Text>
          </TouchableOpacity>
        </View>
        <Card.Divider />
        <Button
          title="112(경찰 신고)"
          onPress={() => makeCall('112')}
          containerStyle={{ marginBottom: 10 }}
          buttonStyle={{ backgroundColor: 'blue' }}
        />
        <Button
          title="119(소방/구급 신고)"
          onPress={() => makeCall('119')}
          containerStyle={{ marginBottom: 10 }}
          buttonStyle={{ backgroundColor: 'red' }}
        />
        <Button
          title="110(민원 문의)"
          onPress={() => makeCall('110')}
          buttonStyle={{ backgroundColor: 'green' }}
        />
      </Card>
      <Card containerStyle={{ margin: 10 }}>
        <Card.Title>국민행동요령</Card.Title>
        <Card.Divider />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default ActionGuideScreen;
