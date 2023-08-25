import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useNavigation } from '@react-navigation/native';
import { Share } from 'react-native';
import { Icon } from 'react-native-elements';
import Toast from 'react-native-toast-message';

function DisasterInfoScreen() {
  const navigation = useNavigation();
  const [disasterMessages, setDisasterMessages] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetch('https://apis.uiharu.dev/disaster/get_disaster_messages.php?page=1')
      .then((response) => response.json())
      .then((data) => {
        setDisasterMessages(data.data.slice(0, 5));
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching disaster messages:', error);
        setLoading(false);
      });
  }, []);

  const handleCopyShare = (message) => {
    // 발송 지역을 쉼표로 분리
    const locations = message.location_name.split(',');
    // Set 객체를 사용하여 중복 제거
    const uniqueLocations = Array.from(new Set(locations));
    // 중복이 제거된 지역을 다시 문자열로 합치기
    const uniqueLocationString = uniqueLocations.join(',');

    // 중복이 제거된 지역을 사용하여 메시지 설정
    setSelectedMessage({
      ...message,
      location_name: uniqueLocationString,
    });

    setModalVisible(true);
  };

  const copyText = selectedMessage
    ? `긴급재난문자\n* ${selectedMessage.msg}\n* 발송 지역: ${selectedMessage.location_name}\n* 발송일: ${selectedMessage.create_date}`
    : '';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <View style={styles.header}>
          <Text style={styles.title}>긴급재난문자</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('DisasterMsg')}
            style={styles.moreContainer}>
            <Text style={styles.more}>더보기</Text>
          </TouchableOpacity>
        </View>
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <View key={index} style={styles.messageContainer}>
                <Text style={styles.placeholder}>Loading...</Text>
              </View>
            ))
          : disasterMessages.map((message, index) => {
              const match = message.msg.match(/^\[(.*?)\]/);
              const title = match ? match[1] : null;
              const content = match
                ? message.msg.replace(match[0], '')
                : message.msg;

              // 발송 지역을 쉼표로 분리
              const locations = message.location_name.split(',');
              // Set 객체를 사용하여 중복 제거
              const uniqueLocations = Array.from(new Set(locations));
              // 중복이 제거된 지역을 다시 문자열로 합치기
              const uniqueLocationString = uniqueLocations.join(',');

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleCopyShare({ ...message, location_name: uniqueLocationString })}
                  style={styles.messageContainer}>
                  {title && <Text style={styles.subtitle}>{title}</Text>}
                  <Text style={styles.message}>{content}</Text>
                  <Text style={styles.location}>{uniqueLocationString}</Text>
                  <Text style={styles.date}>{message.create_date}</Text>
                </TouchableOpacity>
              );
            })}
      </View>
      <View style={styles.box}>
        <View style={styles.header}>
          <Text style={styles.title}>실시간 재난 현황</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('News')}
            style={styles.moreContainer}>
            <Text style={styles.more}>더보기</Text>
          </TouchableOpacity>
        </View>
        {/* 실시간 재난 현황 내용은 여기에 추가 */}
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(copyText);
                  setModalVisible(false);
                  Toast.show({
                    type: 'success',
                    text1: '복사 완료!',
                    text2: '클립보드에 복사되었습니다.',
                  });
                }}>
                <Icon name="content-copy" type="material-community" />
                <Text style={styles.modalButton}>복사</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Share.share({
                    message: copyText,
                  })
                    .then((result) => {
                      if (
                        result.action === Share.sharedAction ||
                        result.action === Share.dismissedAction
                      ) {
                        setModalVisible(false);
                      }
                    })
                    .catch(() => {
                      setModalVisible(false);
                    });
                }}>
                <Icon name="share-variant" type="material-community" />
                <Text style={styles.modalButton}>공유</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10,
  },
  box: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moreContainer: {},
  more: {
    color: 'blue',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageContainer: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    backgroundColor: '#f9f9f9',
  },
  message: {
    fontSize: 14,
    marginBottom: 5,
  },
  location: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: 'gray',
  },
  placeholder: {
    fontSize: 14,
    color: 'gray',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    flexDirection: 'row', // 버튼을 가로로 배치
    justifyContent: 'space-around', // 버튼 사이에 간격 추가
  },
  modalButton: {
    // 각 버튼의 스타일
    padding: 10,
    fontSize: 18, // 글자 크기 조정
  },
});

export default DisasterInfoScreen;
