import React, { useState, useEffect } from 'react';
import {
  Text, Animated
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  DEVICE_WIDTH, weight, gray
} from '../../utils/consts';

const TouchGuideFade = () => {
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, alignSelf: 'center' }}>
      <Text style={balloonText.touchKirini}>끼리니 눌러서 끼니 추가 👉</Text>
    </Animated.View>
  );
};

// 하얀 말풍선 속 Text 스타일
const balloonText = EStyleSheet.create({
  touchKirini: {
    fontSize: '15rem',
    color: gray.c,
    alignSelf: 'center',
    right: DEVICE_WIDTH / 3,
    top: '7rem',
    fontWeight: weight.six
  }
});


export default TouchGuideFade;