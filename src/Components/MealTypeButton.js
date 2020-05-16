import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { mealType } from '../store/meal/action';
import { gray, yellow, meal } from '../utils/consts';
import EStyleSheet from 'react-native-extended-stylesheet';

const mealTypes = [
  {
    key: 0,
    text: '집밥 ',
    color: meal.a
  },
  {
    key: 1,
    text: '외식 ',
    color: meal.b
  },
  {
    key: 2,
    text: '배달 ',
    color: meal.c
  },
  {
    key: 3,
    text: '간편 ',
    color: meal.d
  }
];

const MealTypeButton = props => {
  const [selected, setSelected] = useState(null);
  const dispatch = useDispatch();

  const MakeMealTypeButton = () => {
    mealTypes.map(item => {
      return (
        <TouchableOpacity
          key={item.key}
          style={btColor(item.color).button}
          onPress={() => {
            setSelected(item.key);
            dispatch(mealType(item.key));
          }}
        >
          {selected === item.key && (
            <View style={btColor(item.color).selected} />
          )}
          {selected !== item.key && (
            <Text style={[mealbtSt.txtUnselected, font.seven]}>
              {' '}
              {item.text}
            </Text>
          )}
          {selected === item.key && (
            <Text style={[mealbtSt.txtSelected, font.eight]}> {item.text}</Text>
          )}
          {/* <Text style={mealbtSt.buttonText}> {item.text}</Text> */}
        </TouchableOpacity>
      );
    });

    return (
      <View style={mealbtSt.container}>
        <MakeMealTypeButton mealTypes={mealTypes} />
      </View>
    );
  }
};

const btColor = color =>
  EStyleSheet.create({
    button: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '55rem',
      height: '55rem',
      borderRadius: 100,
      backgroundColor: color + '70'
    },
    selected: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      width: '56rem',
      height: '56rem',
      borderRadius: 100,
      borderWidth: '3.5rem',
      borderColor: yellow.a,
      backgroundColor: color
    }
  });
const font = EStyleSheet.create({
  eight:
    Platform.OS === 'ios'
      ? {
          fontWeight: '800'
        }
      : {
          fontWeight: 'bold'
        },
  seven:
    Platform.OS === 'ios'
      ? {
          fontWeight: '700'
        }
      : {
          fontWeight: 'bold'
        },
  six:
    Platform.OS === 'ios'
      ? {
          fontWeight: '600'
        }
      : {
          fontWeight: 'normal'
        }
});

const mealbtSt = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  txtUnselected: {
    position: 'absolute',
    fontSize: '15.5rem',
    lineHeight: '21rem',
    color: gray.d
  },
  txtSelected: {
    position: 'absolute',
    color: 'white',
    fontSize: '15.5rem'
  }
});

export default MealTypeButton;
