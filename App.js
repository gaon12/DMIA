import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import Toast from 'react-native-toast-message';

import HomeScreen from './HomeScreen';
import DisasterInfoScreen from './DisasterInfoScreen';
import ShelterScreen from './ShelterScreen';
import ActionGuideScreen from './ActionGuideScreen';
import SettingsScreen from './SettingsScreen';

import DisasterMsg from './disasterMsg';
import News from './news';

import ReportMain from './report/ReportMain';
import Police from './report/Police';
import FireEmergency from './report/FireEmergency';
import Spy from './report/Spy';
import CountyResidencyReport from './report/CountyResidencyReport';
import Complaints from './report/Complaints';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function DisasterInfoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="재난 정보" component={DisasterInfoScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DisasterMsg" component={DisasterMsg} options={{ headerShown: false }} />
      <Stack.Screen name="News" component={News} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function ActionGuideStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="국민행동요령" component={ActionGuideScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ReportMain" component={ReportMain} options={{ headerShown: false }} />
      <Stack.Screen name="Police" component={Police} options={{ headerShown: false }} />
      <Stack.Screen name="FireEmergency" component={FireEmergency} options={{ headerShown: false }} />
      <Stack.Screen name="Spy" component={Spy} options={{ headerShown: false }} />
      <Stack.Screen name="CountyResidencyReport" component={CountyResidencyReport} options={{ headerShown: false }} />
      <Stack.Screen name="Complaints" component={Complaints} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === '홈') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === '재난 정보') {
              iconName = focused ? 'alert-circle' : 'alert-circle-outline';
            } else if (route.name === '대피소 조회') {
              iconName = focused ? 'map' : 'map-outline';
            } else if (route.name === '국민행동요령') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === '설정') {
              iconName = focused ? 'cogs' : 'cogs';
            }

            return <Icon name={iconName} size={size} color={color} type="material-community" />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
        }}>
  <Tab.Screen name="홈" component={HomeScreen} />
  <Tab.Screen name="재난 정보" component={DisasterInfoStack} />
  <Tab.Screen name="대피소 조회" component={ShelterScreen} />
  <Tab.Screen name="국민행동요령" component={ActionGuideStack} />
  <Tab.Screen name="설정" component={SettingsScreen} />
</Tab.Navigator>

    </NavigationContainer>
  );
}

export default App;
