import React from 'react';
import { Platform, SafeAreaView, Button, View, Text } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import {
  createDrawerNavigator,
  DrawerNavigatorItems,
} from 'react-navigation-drawer';
import { Ionicons } from '@expo/vector-icons';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/UI/HeaderButton';

import Colors from '../constants/Colors';
import ArtikliScreen from '../screens/ArtikliScreen';
import GrupiScreen from '../screens/GrupiScreen';
import PodgrupiScreen from '../screens/Podgrupi/PodgrupiScreen';
import NarackiScreen from '../screens/Naracki/NarackiScreen';
import CameraScreen from '../screens/CameraScreen';
import ArtikalDetailsScreen from '../screens/ArtikalDetailsScreen';
import PartneriScreen from '../screens/Partneri/PartneriScreen';
import UserProfileScreen from '../screens/UserProfile/UserProfileScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import StartupScreen from '../screens/Startup/StartupScreen';
import * as authActions from '../store/actions/authActions';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold',
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary,
  headerRight: () => {
    const partner = useSelector((state) => state.naracki.partner);

    return (
      <Text
        style={{
          fontSize: 12,
          // color: Colors.white,
          color: Colors.primary, // For web only to be switched to white
          fontWeight: '700',
          marginHorizontal: 10,
        }}
      >
        {partner.ime
          ? partner.ime.length > 25
            ? partner.ime.substring(0, 25) + `..`
            : partner.ime
          : ''}
      </Text>
    );
  },
};

const HomeNavigator = createStackNavigator(
  {
    Partneri: PartneriScreen,
    Grupi: GrupiScreen,
    Podgrupi: PodgrupiScreen,
    Artikli: ArtikliScreen,
    ArtikalDetails: ArtikalDetailsScreen,
    // Naracki: NarackiScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-person' : 'ios-person'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const NarackiNavigator = createStackNavigator(
  {
    Naracki: NarackiScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const UserProfileNavigator = createStackNavigator(
  {
    User: UserProfileScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-person' : 'ios-person'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNavOptions,
  }
);

const tabScreenConfig = {
  Partneri: {
    screen: HomeNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Ionicons name='cube' size={25} color={tabInfo.tintColor} />;
      },
    },
  },
  Camera: {
    screen: CameraScreen,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Ionicons name='camera' size={25} color={tabInfo.tintColor} />;
      },
    },
  },
  Naracki: {
    screen: NarackiNavigator,
    navigationOptions: {
      tabBarIcon: (tabInfo) => {
        return <Ionicons name='list' size={25} color={tabInfo.tintColor} />;
      },
    },
  },
};

const HomeTabNavigator =
  Platform.OS === 'android'
    ? createMaterialBottomTabNavigator(tabScreenConfig, {
        activeColor: Colors.primary,
        inactiveColor: '#dddddd',
        barStyle: { backgroundColor: 'transparent' },
        shifting: true,
        navigationOptions: {
          drawerIcon: (drawerConfig) => (
            <Ionicons
              name={
                Platform.OS === 'android' ? 'md-documents' : 'ios-documents'
              }
              size={23}
              color={drawerConfig.tintColor}
            />
          ),
        },
      })
    : createBottomTabNavigator(tabScreenConfig, {
        tabBarOptions: {
          activeTintColor: Colors.accent,
        },
        navigationOptions: {
          drawerIcon: (drawerConfig) => (
            <Ionicons
              name={
                Platform.OS === 'android' ? 'md-documents' : 'ios-documents'
              }
              size={23}
              color={drawerConfig.tintColor}
            />
          ),
        },
      });

const StartNavigator = createDrawerNavigator(
  {
    GrupiScreen: HomeTabNavigator,
    // Naracki: NarackiNavigator,
    User: UserProfileNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary,
    },
    contentComponent: (props) => {
      const dispatch = useDispatch();
      const isAuth = useSelector(
        (state) => state.auth.token !== null && state.auth.token !== undefined
      );
      return (
        <View style={{ flex: 1, padding: 10, marginTop: 40 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerNavigatorItems {...props} />
            <Button
              title={isAuth ? 'Logout' : 'Login'}
              color={Colors.primary}
              onPress={() => {
                isAuth
                  ? dispatch(authActions.logout())
                  : props.navigation.navigate('Login');
              }}
            />
          </SafeAreaView>
        </View>
      );
    },
  }
);

const LoginNavigator = createStackNavigator(
  {
    Login: LoginScreen,
  },
  {
    defaultNavigationOptions: defaultNavOptions,
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Start: StartNavigator,
  Login: LoginNavigator,
});

export default createAppContainer(MainNavigator);
