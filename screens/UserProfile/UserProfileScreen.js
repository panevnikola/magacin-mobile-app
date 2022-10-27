import React from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Card, Icon } from 'react-native-elements';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import Tel from '../../components/userProfile/Tel';
import Email from '../../components/userProfile/Email';
import Separator from '../../components/userProfile/Separator';

const UserProfileScreen = (props) => {
  const user = useSelector((state) => state.auth.user);

  console.log('UserProfileScreen ', user);

  const avatar =
    'https://scontent.fskp3-1.fna.fbcdn.net/v/t1.6435-9/75055917_10218674916801529_1296341861463490560_n.jpg?_nc_cat=107&ccb=1-3&_nc_sid=730e14&_nc_ohc=luSZtwA8GogAX_-9d26&_nc_ht=scontent.fskp3-1.fna&oh=5e5a1443435a6bfdb70f2afd32aea85b&oe=60DFC7B5';
  const avatarBackground =
    'https://i.pinimg.com/originals/af/8d/63/af8d63a477078732b79ff9d9fc60873f.jpg';

  const address = { city: 'Tetovo', country: 'Macedonia' };

  const tels = [
    { id: 1, name: 'Mobile', number: '+38978111333' },
    { id: 2, name: 'Work', number: '+38970331221' },
  ];

  const emails = [
    { id: 1, name: 'Personal', email: 'nikola.panev93@gmail.com' },
    { id: 2, name: 'Work', email: 'nikolapanev@work.com' },
  ];

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <ImageBackground
          style={styles.headerBackgroundImage}
          blurRadius={5}
          source={{ uri: avatarBackground }}
        >
          <View style={styles.headerColumn}>
            <Image style={styles.userImage} source={{ uri: avatar }} />
            <Text style={styles.userNameText}>
              {user.firstName} {user.lastName}
            </Text>
            <View style={styles.userAddressRow}>
              <View>
                <Icon
                  name='place'
                  underlayColor='transparent'
                  iconStyle={styles.placeIcon}
                  onPress={() => {}}
                />
              </View>
              <View style={styles.userCityRow}>
                <Text style={styles.userCityText}>
                  {address.city}, {address.country}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const renderTel = () => (
    <FlatList
      contentContainerStyle={styles.telContainer}
      data={tels}
      renderItem={(list) => {
        const { id, name, number } = list.item;

        return (
          <Tel
            key={`tel-${id}`}
            index={list.index}
            name={name}
            number={number}
            onPressSms={() => {}}
            onPressTel={() => {}}
          />
        );
      }}
    />
  );

  const renderEmail = () => (
    <FlatList
      contentContainerStyle={styles.emailContainer}
      data={emails}
      renderItem={(list) => {
        const { email, id, name } = list.item;

        return (
          <Email
            key={`email-${id}`}
            index={list.index}
            name={name}
            email={email}
            onPressEmail={onPressEmail}
          />
        );
      }}
    />
  );

  const onPressEmail = (email) => {
    Linking.openURL(`mailfrom://${email}?subject=subject&body=body`).catch(
      (err) => console.log('Error:', err)
    );
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Card containerStyle={styles.cardContainer}>
          {renderHeader()}
          {renderTel()}
          <Separator />
          {renderEmail()}
        </Card>
      </View>
    </ScrollView>
  );
};

UserProfileScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'User',
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
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  emailContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 45,
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  userImage: {
    borderColor: '#FFF',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
});

export default UserProfileScreen;
