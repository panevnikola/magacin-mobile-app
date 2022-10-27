import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/authActions';

const StartupScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');

      if (userData == null) {
        props.navigation.navigate('Login'); //Should be /Login route when all is done
        return;
      }

      const transformedData = JSON.parse(userData);

      console.log('startupscreen transformedData ', transformedData);

      const { token, user, expirationDate } = transformedData;

      props.navigation.navigate('Partneri');
      dispatch(authActions.tryLogin(token, user, expirationDate));
    };

    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size='large' color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StartupScreen;
