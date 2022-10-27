import React from 'react';
import { useDispatch } from 'react-redux';
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import Counter from 'react-native-counters';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';
import * as actions from '../../store/actions/actions';

const CustomModal = ({
  modalVisible,
  handleCloseModal,
  data,
  selectHandler,
}) => {
  const dispatch = useDispatch();

  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const onChange = async (number, type) => {
    data.kolicina = number;
    if (data?.kolicina > 0) {
      await dispatch(actions.addNaracka(data));
    } else {
      await dispatch(actions.removeItemFromNaracka(data?.id));
    }
  };

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCloseModal}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView>
            <TouchableCmp onPress={selectHandler} useForeground>
              <Image
                style={styles.image}
                source={{
                  uri: data?.slikaUrl,
                }}
              />
            </TouchableCmp>
            <View style={styles.actions}>
              <Text style={styles.title}>{data?.ime}</Text>
            </View>
            <Text style={styles.price}>{data?.cena} MKD</Text>
            <Text style={styles.description}>{data?.opis}</Text>
            <View style={styles.dostapno}>
              <Text
                style={
                  data?.dostapnost
                    ? styles.dostapnoLabelSuccess
                    : styles.dostapnoLabelDanger
                }
              >
                {data?.dostapnost ? 'Dostapno' : 'Ne e dostapno'}
              </Text>
              {data?.dostapnost ? (
                <Ionicons
                  name={'checkmark-circle'}
                  size={26}
                  color={Colors.success}
                />
              ) : (
                <Ionicons
                  name={'close-circle'}
                  size={26}
                  color={Colors.danger}
                />
              )}
            </View>
            <View style={styles.counterContainer}>
              <Counter start={0} onChange={onChange.bind(this)} />
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleCloseModal}
            >
              <Text style={styles.textStyle}>Zatvori</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  modalView: {
    width: '90%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  //Artikal
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    backgroundColor: Colors.white,
  },
  actions: {
    marginVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 20,
    color: Colors.primary,
    textAlign: 'center',
  },
  price: {
    fontFamily: 'open-sans',
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  dostapno: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
  dostapnoLabelSuccess: {
    fontFamily: 'open-sans',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    color: Colors.success,
    marginRight: 5,
  },
  dostapnoLabelDanger: {
    fontFamily: 'open-sans',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    color: Colors.danger,
    marginRight: 5,
  },
  headerTitle: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700',
  },
  counterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
});

export default CustomModal;
