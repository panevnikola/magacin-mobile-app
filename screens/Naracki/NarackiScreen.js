import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Button,
  Platform,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import NarackiItem from '../../components/naracki/NarackiItem';
import Colors from '../../constants/Colors';
import { API_URL_IP_NETWORK } from '../../constants/Variables';
import * as actions from '../../store/actions/actions';

const NarackiScreen = (props) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();

  const [lastOrderNumber, setLastOrderNumber] = useState();
  const [primeniNaracki, setPrimeniNaracki] = useState([]);
  const naracki = useSelector((state) => state.naracki.naracki);
  const partner = useSelector((state) => state.naracki.partner);

  const fDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const loadLastOrderNumber = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const result = await fetch(`${API_URL_IP_NETWORK}/naracki/posledna/last`);

      const resData = await result.json();

      console.log('last number ', resData[0].id);

      if (resData.status === 404) {
        setError(resData.message);
      }
      setLastOrderNumber(resData[0].orderNumber);
    } catch (err) {
      console.log('CATCH ERR ', err);
      setError(err);
    }
    setIsRefreshing(false);
  }, [setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadLastOrderNumber
    );

    // clean-up function to remove event listeners
    return () => {
      willFocusSub.remove();
    };
  }, [loadLastOrderNumber]);

  useEffect(() => {
    setIsLoading(true);
    loadLastOrderNumber().then(() => {
      setIsLoading(false);
    });
  }, [loadLastOrderNumber]);

  const fetchPrimeniNaracki = useCallback(
    async (selectedDate = '') => {
      setPrimeniNaracki([]);
      setError(null);
      setIsRefreshing(true);
      try {
        const dateToRequest =
          selectedDate !== '' ? fDate(selectedDate) : fDate(date);

        console.log('FEEETCH try dateToRequest ', dateToRequest);

        const result = await fetch(
          `${API_URL_IP_NETWORK}/naracki/byDatumAndUser/${dateToRequest}/${user.id}`
        );

        const resData = await result.json();

        // START OF NEW VERSION

        // if (result.status === 200) {
        //   const uniqueOrders = [];
        //   const map = new Map();
        //   for (const item of resData) {
        //     if (!map.has(item.orderNumber)) {
        //       map.set(item.orderNumber, true); // set any value to Map
        //       uniqueOrders.push({
        //         ...item,
        //       });
        //     }
        //   }
        //   console.log('uniqueOrders ', uniqueOrders);
        //   // setAllNaracki(result.data);
        // }

        // END OF NEW VERSION

        const orderNumbers = new Set(resData.map((item) => item.orderNumber));

        const orderNumbersArray = Array.from(orderNumbers);

        console.log('orderNumbersArray ', orderNumbersArray);

        orderNumbersArray.map(async (item) => {
          console.log('item num ', item);
          const resultByOrderNumber = await fetch(
            `${API_URL_IP_NETWORK}/naracki/orderNumber/${item}`
          );

          const resDataByOrderNumber = await resultByOrderNumber.json();
          console.log('item resultByOrderNumber ', resultByOrderNumber);

          setPrimeniNaracki((oldArray) => {
            return [...oldArray, resDataByOrderNumber];
          });
        });

        if (resData.status === 404) {
          setError(resData.message);
        }
        // setPrimeniNaracki(resData);
      } catch (err) {
        setError(err);
      }
      setIsRefreshing(false);
    },
    [setIsLoading, setError]
  );

  // useEffect(() => {
  //   const willFocusSub = props.navigation.addListener(
  //     'willFocus',
  //     fetchPrimeniNaracki
  //   );

  //   // clean-up function to remove event listeners
  //   return () => {
  //     willFocusSub.remove();
  //   };
  // }, [fetchPrimeniNaracki]);

  useEffect(() => {
    setIsLoading(true);
    fetchPrimeniNaracki().then(() => {
      setIsLoading(false);
    });
  }, [fetchPrimeniNaracki]);

  const onChange = (event, selectedDate) => {
    setPrimeniNaracki([]);
    console.log('selectedDate ', selectedDate);
    setShow(Platform.OS === 'ios');
    setDate(selectedDate);
    fetchPrimeniNaracki(selectedDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const FormatDate = () => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const d = new Date(date);

    return (
      <Text style={styles.dateText}>
        {`${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`}
      </Text>
    );
  };

  const showToastWithGravityAndOffset = () => {
    ToastAndroid.showWithGravityAndOffset(
      'Нарачката е успешно направена!',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    );
  };

  const onSubmit = async (naracki) => {
    setIsLoading(true);
    const narackiToSubmit = [];
    await naracki.map((item) => {
      console.log(item);
      narackiToSubmit.push([
        lastOrderNumber + 1,
        item.id,
        user.id,
        item.kolicina,
        fDate(date),
        partner.id,
        'Waiting',
        1,
      ]);
    });

    console.log('narackiToSubmit ', narackiToSubmit);

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(narackiToSubmit),
    };

    const result = await fetch(`${API_URL_IP_NETWORK}/naracki`, requestOptions);

    console.log('submit data result ', result);

    // if (resData.status === 404) {
    //   setIsLoading(false);
    //   setError(resData.message);
    // }

    const resData = await result.json();

    console.log('submit data json ', resData);

    await dispatch(actions.removeNaracka());

    fetchPrimeniNaracki();
    setIsLoading(false);

    showToastWithGravityAndOffset();
  };

  console.log('primeni naracki ', primeniNaracki);
  console.log('naracki ', naracki);

  return (
    <ScrollView style={styles.screen}>
      {isLoading && (
        <View style={styles.centered}>
          <ActivityIndicator size='small' color={Colors.primary} />
        </View>
      )}
      <LinearGradient
        // Background Linear Gradient
        colors={[Colors.primary, 'transparent']}
        style={styles.background}
      />
      <View style={styles.dateContainer}>
        <View>
          <Ionicons
            onPress={showDatepicker}
            name={Platform.OS === 'android' ? 'md-calendar' : 'ios-calendar'}
            size={26}
            color={Colors.white}
          />
        </View>
        {show && (
          <DateTimePicker
            testID='dateTimePicker'
            value={date}
            mode={mode}
            is24Hour={true}
            display='default'
            onChange={onChange}
          />
        )}
      </View>
      <View style={styles.titleContainer}>
        <FormatDate />
      </View>
      <View style={styles.noviNaracki}>
        {naracki.length > 0 && (
          <Text style={styles.narackiLabel}>Нови нарачки</Text>
        )}
        {naracki.length > 0 && (
          <NarackiItem items={naracki} newItem={true} onSubmit={onSubmit} />
        )}
      </View>
      <View style={styles.primeniNaracki}>
        {primeniNaracki.length > 0 && (
          <Text style={styles.narackiLabel}>Примени нарачки</Text>
        )}
        {primeniNaracki.length > 0 &&
          primeniNaracki.map((item) => {
            const on = new Set(item.map((item) => item.orderNumber));
            const uniquePartner = new Set(item.map((item) => item.partner.ime));
            return (
              <NarackiItem
                key={Math.floor(Math.random() * 100)}
                items={item}
                orderNumber={on.values().next().value}
                newItem={false}
                onSubmit={onSubmit}
                uniquePartner={uniquePartner.values().next().value}
                status={item[0].status}
              />
            );
          })}
      </View>
    </ScrollView>
  );
};

NarackiScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Нарачки',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title='Menu'
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
  },
  dateText: {
    fontFamily: 'open-sans',
    marginRight: 10,
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 120,
  },
  titleContainer: {
    display: 'flex',
    alignSelf: 'center',
    height: 40,
    width: 170,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 25,
    position: 'absolute',
    top: 100,
  },
  title: {
    fontFamily: 'open-sans',
    fontSize: 18,
    color: Colors.primary,
  },
  noviNaracki: {
    marginTop: 40,
  },
  narackiLabel: {
    margin: 10,
    fontFamily: 'open-sans',
    color: '#888',
    fontSize: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NarackiScreen;
