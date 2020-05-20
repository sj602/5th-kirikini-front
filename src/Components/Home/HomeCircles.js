import React, { useState, Fragment } from 'react';
import {
  View, Text,
  TouchableOpacity, Image, Modal,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  DEVICE_HEIGHT, DEVICE_WIDTH, mealColor,
  home, yellow, weight, gray
} from '../../utils/consts';

const HomeCircles = props => {
  const [selectedMeal, setSelectedMeal] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={circles.circlesContainer}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          borderBottomColor: 'white',
          borderBottomWidth: 3,
          width: '100%'
        }}
      />
      <View style={{ width: DEVICE_HEIGHT / 40 }} />
      {props.meals &&
        props.meals.map(item => {
          var circleColor = mealColor.a;
          if (item.mealType === 0) {
            circleColor = mealColor.a;
          }
          if (item.mealType === 1) {
            circleColor = mealColor.b;
          }
          if (item.mealType === 2) {
            circleColor = mealColor.c;
          }
          if (item.mealType === 3) {
            circleColor = mealColor.d;
          }

          return (
            <Fragment key={item.id}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedMeal(item);
                  setModalVisible(!modalVisible);
                }}
                style={{
                  backgroundColor: circleColor,
                  borderRadius: 300,
                  width:
                    item.average_rate * (DEVICE_HEIGHT / 110) +
                    DEVICE_HEIGHT / 15,
                  height:
                    item.average_rate * (DEVICE_HEIGHT / 110) +
                    DEVICE_HEIGHT / 15,
                  marginRight: DEVICE_HEIGHT / 40,

                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Image
                  style={{
                    zIndex: 20,
                    width: DEVICE_HEIGHT / 15,
                    height: DEVICE_HEIGHT / 15,
                    borderRadius: 200,
                    resizeMode: 'cover'
                  }}
                  source={{ uri: item.picURL }}
                />

                {item.gihoType === 0 && (
                  <Image
                    style={{
                      zIndex: 20,
                      width: DEVICE_HEIGHT / 37,
                      height: DEVICE_HEIGHT / 37,
                      resizeMode: 'contain',
                      position: 'absolute'
                    }}
                    source={require('../../../assets/img/iconCupSmall.png')}
                  />
                )}
                {item.gihoType === 1 && (
                  <Image
                    style={{
                      zIndex: 20,
                      width: DEVICE_HEIGHT / 37,
                      height: DEVICE_HEIGHT / 37,
                      resizeMode: 'contain',
                      position: 'absolute'
                    }}
                    source={require('../../../assets/img/iconBeerSmall.png')}
                  />
                )}
              </TouchableOpacity>

              <Modal animation="fade" transparent={true} visible={modalVisible}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                  style={{ width: DEVICE_WIDTH, height: DEVICE_HEIGHT }}
                >
                  <View style={modal.view}>
                    <Image
                      source={{ uri: selectedMeal.picURL }}
                      style={modal.img}
                    />
                  </View>
                  <View style={modal.info}>
                    <View style={modal.scoreContainer}>
                      <Text style={modal.score}>
                        {Math.round(selectedMeal.average_rate * 10) / 10}
                      </Text>
                      <Text style={modal.jum}>점</Text>
                    </View>
                    <Text style={modal.time}>
                      {Object.keys(selectedMeal).length > 0
                        ? selectedMeal.created_at.slice(11, 13) < 12
                          ? '오전 ' +
                            selectedMeal.created_at.slice(11, 13) +
                            '시 ' +
                            selectedMeal.created_at.slice(14, 16) +
                            '분'
                          : '오후 ' +
                            Number(selectedMeal.created_at.slice(11, 13) - 12) +
                            '시 ' +
                            selectedMeal.created_at.slice(14, 16) +
                            '분'
                        : null}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Modal>
            </Fragment>
          );
        })}
    </View>
  );
};

const circles = EStyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '15rem'
  },
  circlesContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sun: {
    width: '35rem',
    height: '35rem',
    marginRight: '10rem',
    resizeMode: 'cover'
  },
  moon: {
    width: '40rem',
    height: '40rem',

    resizeMode: 'cover'
  }
});


const modal = EStyleSheet.create({
  view: {
    flex: 0.414,
    top: home.margin,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: '70rem',
    borderBottomRightRadius: '70rem'
  },
  img: {
    width: DEVICE_WIDTH - 54,
    height: (DEVICE_HEIGHT / 100) * 38 - 20,
    borderTopLeftRadius: '60rem',
    borderBottomRightRadius: '60rem',
    resizeMode: 'cover'
  },
  info: {
    flexDirection: 'column',
    width: '180rem',
    height: (DEVICE_HEIGHT / 100) * 14,
    position: 'absolute',
    top: (DEVICE_HEIGHT / 100) * 52,
    left: 27,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  score: {
    fontSize: '32rem',
    lineHeight: '32rem',
    fontFamily: 'JosefinSans-Bold',
    color: yellow.b,
    textAlign: 'center'
  },
  jum: {
    fontSize: '25rem',
    lineHeight: '32rem',
    fontWeight: weight.eight,
    color: yellow.b,
    textAlign: 'center',
    bottom: '2rem'
  },
  time: {
    fontSize: '15rem',
    color: gray.c,
    fontWeight: weight.seven
  }
});

export default HomeCircles;