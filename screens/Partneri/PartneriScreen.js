import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Platform,
  View,
  Text,
  Button,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { SearchBar } from 'react-native-elements';
import { useDispatch } from 'react-redux';

import * as actions from '../../store/actions/actions';

import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import { API_URL_IP_NETWORK } from '../../constants/Variables';
import PartnerItem from '../../components/partneri/PartnerItem';

const PartneriScreen = (props) => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const [partneri, setPartneri] = useState([]);

  const [search, setSearch] = useState('');

  const loadPartneri = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      const result = await fetch(`${API_URL_IP_NETWORK}/partneri`);

      console.log('loadPartneri res ', result);

      const resData = await result.json();

      if (resData.status === 404) {
        setError(resData.message);
      }
      setPartneri(resData);
    } catch (err) {
      setError(err);
    }
    setIsRefreshing(false);
  }, [setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadPartneri
    );

    // clean-up function to remove event listeners
    return () => {
      willFocusSub.remove();
    };
  }, [loadPartneri]);

  useEffect(() => {
    setIsLoading(true);
    loadPartneri().then(() => {
      setIsLoading(false);
    });
  }, [loadPartneri]);

  const selectItemHandler = (item) => {
    dispatch(actions.selectParnter(item));
    props.navigation.navigate('Grupi');
  };

  const updateSearch = (search) => {
    setSearch(search);
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          title='Try again'
          onPress={loadPartneri}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='small' color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView>
      <SearchBar
        placeholder='Најди партнер...'
        onChangeText={updateSearch}
        value={search}
        platform={Platform.OS === 'android' ? 'android' : 'ios'}
      />
      <FlatList
        onRefresh={loadPartneri}
        refreshing={isRefreshing}
        data={partneri.filter(
          (partner) =>
            partner.adresa.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
            partner.ime.toLowerCase().indexOf(search.toLowerCase()) !== -1
        )}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={10}
        renderItem={({ item }) => (
          <PartnerItem
            item={item}
            onSelect={() => {
              selectItemHandler(item);
            }}
          />
        )}
      />
    </ScrollView>
  );
};

PartneriScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Партнери',
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'open-sans',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700',
  },
});

export default PartneriScreen;
