import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  Share,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {
  Input,
  CheckBox,
  Button,
  ButtonGroup,
  ListItem,
  Slider,
} from 'react-native-elements';
import Collapsible from 'react-native-collapsible';
import Toast from 'react-native-toast-message';

const DisasterMsg = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState([]);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const regions = [
    '서울특별시',
    '경기도',
    '인천광역시',
    '강원특별자치도',
    '대전광역시',
    '세종특별자치시',
    '충청북도',
    '충청남도',
    '경상북도',
    '경상남도',
    '전라북도',
    '전라남도',
    '제주특별자치도',
  ];

  const [refreshTimer, setRefreshTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

// fetchData의 시작 부분에서 강제 새로고침 관련 로직을 제거합니다.
const fetchData = useCallback(async () => {
  setIsLoading(true);

  try {
    const response = await fetch(
      `https://apis.uiharu.dev/disaster/get_disaster_messages.php?page=${page}&search=${searchTerm}&filter=${filter.join(
        ','
      )}`
    );
    const result = await response.json();
    const processedData = result.data.map((item) => ({
      ...item,
      location_name: removeDuplicates(item.location_name),
    }));
    setData(processedData);
    setTotalPages(result.total_pages);
    setIsLoading(false); // 로딩 상태 변경 위치 수정
  } catch (err) {
    setIsLoading(false);
    Toast.show({
      type: 'error',
      text1: '데이터를 가져오지 못했습니다.',
      text2: '인터넷 연결을 확인해주세요.',
    });
  }
}, [page, searchTerm, filter]);

// 첫 접속 시 데이터 불러오기 (useEffect 삭제)
useEffect(() => {
  fetchData();
}, [fetchData]);

useEffect(() => {
  let timer;
  if (refreshTimer > 0) {
    timer = setInterval(() => {
      setRefreshTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(timer); // 타이머가 1이 되면 다음 단계에서 0이 되므로 타이머를 정지
        }
        return prevTimer - 1;
      });
    }, 1000);
  }
  return () => {
    clearInterval(timer);
  };
}, [refreshTimer]);

// 강제 새로고침 처리
const handleRefresh = () => {
  if (refreshTimer > 0) {
    Toast.show({
      type: 'info',
      text1: '서버 부하를 줄이기 위해 잠시 뒤 수동으로 새로고침을 할 수 있습니다!',
      text2: `${refreshTimer}초 뒤 가능합니다!`,
    });
    return;
  }
  setRefreshTimer(15); // 강제 새로고침을 할 경우 타이머 시작
  fetchData();
};

  const [showRegionFilter, setShowRegionFilter] = useState(false);

  const handleTitle = (msg) => {
    const titleMatch = msg.match(/\[.*?\]/);
    return titleMatch ? titleMatch[0] : '재난문자';
  };

  const handleContent = (msg) => {
    return msg.replace(/\[.*?\]/, '');
  };

  const paginationSize = 5; // 페이지네이션의 크기
  const startPage =
    Math.floor((page - 1) / paginationSize) * paginationSize + 1;
  const endPage = Math.min(startPage + paginationSize - 1, totalPages);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const removeDuplicates = (str) => {
    return Array.from(new Set(str.split(','))).join(',');
  };

  const handleShare = async (item) => {
    const uniqueLocations = removeDuplicates(item.location_name);
    const content = `긴급재난문자\n* ${item.msg}\n* 발송 지역: ${uniqueLocations}\n* 발송일: ${item.create_date}`;
    Share.share({
      message: content,
    });
  };

  const handleCopy = async (item) => {
    const uniqueLocations = removeDuplicates(item.location_name);
    const content = `긴급재난문자\n* ${item.msg}\n* 발송 지역: ${uniqueLocations}\n* 발송일: ${item.create_date}`;
    await Clipboard.setStringAsync(content);
    Alert.alert('복사 완료', '재난문자가 클립보드에 복사되었습니다.');
  };

  const handleItemPress = (item) => {
    Alert.alert('옵션 선택', '원하는 옵션을 선택하세요.', [
      { text: '복사', onPress: () => handleCopy(item) },
      { text: '공유', onPress: () => handleShare(item) },
      { text: '취소', style: 'cancel' },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <View style={styles.searchContainer}>
          <Input
  placeholder="검색어를 입력하세요"
  onChangeText={(value) => setSearchTerm(value)}
  containerStyle={[styles.inputContainer, { flex: 0.9 }]} // flex 추가
/>
          <Button
            icon={{ name: 'refresh', color: 'white' }}
            onPress={handleRefresh}
            buttonStyle={styles.refreshButton}
          />
        </View>
        <Button
          title={`검색 옵션 ${showOptions ? '접기' : '펼치기'}`}
          onPress={() => setShowOptions(!showOptions)}
          buttonStyle={styles.optionsButton}
        />
        <Collapsible collapsed={!showOptions}>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              onPress={() => setShowRegionFilter(!showRegionFilter)}>
              <Text style={styles.optionTitle}>
                지역 필터 {showRegionFilter ? '(접기)' : '(펼치기)'}
              </Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <Collapsible collapsed={!showRegionFilter}>
              <View>
                {Array.from(
                  { length: Math.ceil(regions.length / 3) },
                  (_, i) => (
                    <View key={i} style={styles.checkboxRow}>
                      {regions.slice(i * 3, i * 3 + 3).map((region, index) => (
                        <CheckBox
                          key={index}
                          title={region}
                          checked={filter.includes(region)}
                          onPress={() =>
                            setFilter(
                              filter.includes(region)
                                ? filter.filter((f) => f !== region)
                                : [...filter, region]
                            )
                          }
                          containerStyle={styles.checkboxContainer}
                        />
                      ))}
                    </View>
                  )
                )}
              </View>
            </Collapsible>
            <Text style={styles.optionTitle}>한 페이지에 출력할 갯수</Text>
            <View style={styles.divider} />
            <View style={styles.sliderContainer}>
              <View style={styles.sliderWrapper}>
                <Slider
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={itemsPerPage}
                  onValueChange={(value) => setItemsPerPage(value)}
                  thumbStyle={styles.sliderThumb}
                  trackStyle={styles.sliderTrack}
                />
              </View>
              <Text>{itemsPerPage} 개</Text>
            </View>
          </View>
        </Collapsible>
      </View>
      <View style={styles.messagesContainer}>
        <View style={styles.box}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            data.slice(0, itemsPerPage).map((item, index) => (
              <ListItem
                key={index}
                onPress={() => handleItemPress(item)}
                bottomDivider>
                <ListItem.Content>
                  <ListItem.Title style={[styles.boldText, styles.textMargin]}>
                    {handleTitle(item.msg)}
                  </ListItem.Title>
                  <ListItem.Subtitle style={styles.textMargin}>
                    {handleContent(item.msg)}
                  </ListItem.Subtitle>
                  <Text style={styles.textMargin}>{item.location_name}</Text>
                  <Text style={styles.textMargin}>{item.create_date}</Text>
                </ListItem.Content>
              </ListItem>
            ))
          )}
        </View>
        <View style={styles.paginationContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            style={styles.paginationScroll}>
            <View style={styles.paginationWrapper}>
              <Button
                title="<<"
                onPress={() => handlePageChange(1)}
                buttonStyle={styles.pageButton}
                titleStyle={styles.pageButtonText}
              />
              <Button
                title="<"
                onPress={() => handlePageChange(startPage - paginationSize)}
                buttonStyle={styles.pageButton}
                titleStyle={styles.pageButtonText}
              />
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => (
                <Button
                  key={i}
                  title={`${startPage + i}`}
                  onPress={() => handlePageChange(startPage + i)}
                  buttonStyle={
                    page === startPage + i
                      ? styles.activePageButton
                      : styles.pageButton
                  }
                  titleStyle={
                    page === startPage + i
                      ? styles.activePageButtonText
                      : styles.pageButtonText
                  }
                />
              ))}
              <Button
                title=">"
                onPress={() => handlePageChange(endPage + 1)}
                buttonStyle={styles.pageButton}
                titleStyle={styles.pageButtonText}
              />
              <Button
                title=">>"
                onPress={() => handlePageChange(totalPages)}
                buttonStyle={styles.pageButton}
                titleStyle={styles.pageButtonText}
              />
            </View>
          </ScrollView>
        </View>
      </View>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  box: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  refreshButton: {
  backgroundColor: '#4CAF50', // 버튼 색상
  paddingHorizontal: 10, // 버튼 패딩 조정
  height: 40, // 버튼 높이 조정
},
  paginationWrapper: {
    // 새로운 스타일
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18, // 폰트 크기 조정
  },
  inputContainer: {
    marginBottom: -10,
  },
  optionsButton: {
    backgroundColor: '#4CAF50', // 색상 조정
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  checkboxContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 5,
  },
  optionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 10,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between', // 이 부분 추가
  },
  sliderWrapper: {
    flex: 0.9, // 슬라이더 컨테이너의 가로 길이를 조정 (flex값 조절)
  },
  sliderThumb: {
    height: 20,
    width: 20,
  },
  sliderTrack: {
    height: 4,
  },
  optionsContainer: {
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15, // 재난문자 출력 부분과 여백
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
    marginVertical: 10,
  },
  messagesContainer: {
    marginTop: 15, // 옵션과의 여백
  },
  paginationScroll: {
    // 새로운 스타일 추가
    flexGrow: 0,
    justifyContent: 'center',
  },
  pageButton: {
    backgroundColor: '#f0f0f0', // 색상 조정
    borderColor: '#dcdcdc', // 색상 조정
    borderWidth: 1,
    marginHorizontal: 3,
    paddingHorizontal: 10,
    height: 40,
  },
  activePageButton: {
    backgroundColor: '#4CAF50', // 색상 조정
    borderColor: '#4CAF50', // 색상 조정
    borderWidth: 1,
    marginHorizontal: 3,
    paddingHorizontal: 8,
    height: 40,
  },
  pageButtonText: {
    color: '#333333', // 색상 조정
  },
  textMargin: {
    marginVertical: 5,
  },
  activePageButtonText: {
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default DisasterMsg;