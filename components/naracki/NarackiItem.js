import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import Counter from 'react-native-counters';
import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'react-native-paper';

import Colors from '../../constants/Colors';
import * as actions from '../../store/actions/actions';

export const LIST_ITEM_HEIGHT = 54;

const NarackiItem = (props) => {
  const partnerZaNovaNaracka = useSelector((state) => state.naracki.partner);
  const {
    items,
    isLast,
    newItem,
    orderNumber,
    onSubmit,
    uniquePartner,
    status,
  } = props;
  const bottomRadius = isLast ? 8 : 0;

  const [collapsed, setCollapsed] = useState(true);
  const [seen, setSeen] = useState(false);

  const dispatch = useDispatch();

  const onChange = (number, type) => {
    console.log(number, type, item); // 1, + or -
  };

  const toggleExpanded = () => {
    setCollapsed((prevState) => !prevState);
    setSeen(true);
  };

  const removeItemFromNaracka = async (id) => {
    await dispatch(actions.removeItemFromNaracka(id));
  };

  return (
    <View style={styles.card}>
      <TouchableWithoutFeedback onPress={toggleExpanded}>
        <Animated.View
          style={[
            styles.container2,
            {
              borderBottomLeftRadius: bottomRadius,
              borderBottomRightRadius: bottomRadius,
            },
          ]}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {newItem ? 'Нова нарачка' : `Бр. на нарачка: ${orderNumber}`}
            </Text>
            <Text style={styles.partnerTitle}>
              {!newItem ? uniquePartner : partnerZaNovaNaracka.ime}
            </Text>
          </View>
          {!seen && newItem && (
            <View style={styles.novo}>
              <Text style={styles.novoTitle}>NOVO</Text>
            </View>
          )}
          <View style={styles.arrowContainer}>
            {status === 'Ready for pickup' && (
              <Text style={styles.status}>Спремна</Text>
            )}
            <Ionicons
              name={collapsed ? 'arrow-down' : 'arrow-up'}
              size={26}
              color={Colors.primary}
            />
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
      <Collapsible collapsed={collapsed} align='center'>
        {items.map((item) => (
          <View
            key={item.id}
            style={[
              styles.container,
              {
                borderBottomLeftRadius: bottomRadius,
                borderBottomRightRadius: bottomRadius,
              },
            ]}
          >
            <View>
              <Text style={styles.name}>
                {item.artikal ? item.artikal.ime : item.ime}
              </Text>
              <View style={styles.artikalOpisContainer}>
                <Text style={styles.artikalOpis}>
                  {item.artikal ? item.artikal.opis : item.opis}
                </Text>
                <Text style={styles.artikalCena}>
                  {item.artikal ? item.artikal.cena : item.cena} MKD
                </Text>
              </View>
            </View>
            <View style={styles.actionContainer}>
              <View style={styles.pointsContainer}>
                <Text style={styles.points}>x{item.kolicina}</Text>
              </View>
              {newItem && (
                <Ionicons
                  name='remove-circle'
                  size={26}
                  color={Colors.danger}
                  style={{ marginLeft: 10 }}
                  onPress={() => removeItemFromNaracka(item.id)}
                />
              )}
            </View>
          </View>
        ))}
        {newItem && (
          <Button
            style={styles.submitButton}
            onPress={() => onSubmit(items)}
            color={Colors.primary}
            mode='contained'
          >
            Потврди нарачка
          </Button>
        )}
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 2,
  },
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#f4f4f6',
    height: LIST_ITEM_HEIGHT,
    // shadowColor: 'black',
    // shadowOpacity: 0.26,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 2,
    // elevation: 1,
    // borderRadius: 4,
    marginHorizontal: 5,
    // marginVertical: 5
  },
  name: {
    fontSize: 16,
  },
  novo: {
    backgroundColor: '#44c282',
    padding: 5,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 4,
    marginLeft: 100,
  },
  novoTitle: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'open-sans',
  },
  pointsContainer: {
    borderRadius: 8,
    backgroundColor: Colors.primary,
    padding: 8,
  },
  points: {
    color: Colors.white,
    fontFamily: 'open-sans-bold',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    marginBottom: 5,
    backgroundColor: Colors.white,
    padding: 20,
    // borderTopLeftRadius: 8,
    // borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.grey,
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
    // borderRadius: 4,
    marginHorizontal: 2,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontFamily: 'open-sans-bold',
    marginVertical: 5,
  },
  partnerTitle: {
    fontSize: 13,
    fontWeight: '100',
    color: Colors.grey,
  },
  items: {
    overflow: 'hidden',
  },
  submitButton: {
    marginHorizontal: 5,
    marginTop: 10,
  },
  artikalOpisContainer: {
    flexDirection: 'row',
  },
  artikalOpis: {
    fontSize: 13,
    fontWeight: '100',
    color: Colors.grey,
  },
  artikalCena: {
    fontSize: 13,
    fontWeight: '100',
    color: Colors.grey,
    marginLeft: 10,
  },
  arrowContainer: {
    flexDirection: 'row',
  },
  status: {
    marginRight: 10,
    marginTop: 5,
  },
});

export default NarackiItem;
