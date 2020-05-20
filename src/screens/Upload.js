import React, { useState, useEffect } from 'react';
import {
  Text, View, Image,
  Alert, Platform
} from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-community/async-storage';
import { RNS3 } from 'react-native-aws3';
import EStyleSheet from 'react-native-extended-stylesheet';
import axios from 'axios';
import MealTypeButton from '../components/Upload/MealTypeButton';
import DrinkTypeButton from '../components/Upload/DrinkTypeButton';
import {
  SAVE_MEAL_URL, DEVICE_WIDTH, DEVICE_HEIGHT,
  gray, yellow
} from '../utils/consts';
import { gihoType } from '../store/meal/action';
import secretKey from '../../secrets_front.json';

// AWS S3
const S3_OPTIONS = {
  keyPrefix: 'uploads/',
  bucket: 'kirikini',
  region: 'ap-northeast-2',
  accessKey: 'AKIAWMXSZW6I2XTZR5HX',
  secretKey: secretKey['AWS_S3_SECRET_KEY'],
  successActionStatus: 201
};

const calcPhotoTime = (meal_just_taken) => {
  if (meal_just_taken != null) {
    const time =
    meal_just_taken.timestamp == null
      ? ''
      : Number(meal_just_taken.timestamp.slice(11, 13)) < 12
      ? ' 오전 ' +
        Number(meal_just_taken.timestamp.slice(11, 13)) +
        '시 ' +
        meal_just_taken.timestamp.slice(14, 16) +
        '분'
      : ' 오후 ' +
        Number(meal_just_taken.timestamp.slice(11, 13) - 12) +
        '시 ' +
        meal_just_taken.timestamp.slice(14, 16) +
        '분';
    const date =
    meal_just_taken.timestamp == null
      ? ''
      : meal_just_taken.timestamp.slice(0, 4) +
        '년 ' +
        meal_just_taken.timestamp.slice(5, 7) +
        '월 ' +
        meal_just_taken.timestamp.slice(8, 10) +
        '일 ' +
        time;

    return [time, date];
  }
  else return [null, null];
}

const Upload = props => {
  const [mealScore, setMealScore] = useState(5);
  const [mealImage, setMealImage] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    
  }, [props.saved])
  console.log(props)
  const meal_photo_uri = props.meal_just_taken ? props.meal_just_taken.file.uri : null;
  const [time, date] = calcPhotoTime(props.meal_just_taken);

  // const updateMealImage = () => {
  //   AsyncStorage.getItem('@mealImage')
  //     .then(uri => setMealImage(uri))
  //     .catch(err => console.log('load image failed'));
  // };

  const onValueChange = mealScore => {
    setMealScore(mealScore);
  };

  const photoUpload = () => {
    if (props.saved.mealType == null)
      return Alert.alert('끼니 형태를 선택해주세요!', '', [
        { text: '확인', onPress: () => console.log() }
      ]);
    if (props.saved.meal_just_taken == {})
      return Alert.alert('끼니 사진을 찍어주세요!', '', [
        { text: '확인', onPress: () => console.log() }
      ]);

    RNS3.put(file, S3_OPTIONS).then(response => {
      if (response.status !== 201)
        throw new Error('Failed to upload image to S3');

      const data = {
        mealType: props.saved.mealType,
        gihoType: props.saved.gihoType,
        picURL: response.body.postResponse.location,
        rating: mealScore,
        created_at: props.saved.timestamp
      };

      let access_token = null,
        refresh_token = null;
      AsyncStorage.multiGet(['@jwt_access_token', '@jwt_refresh_token']).then(
        response => {
          access_token = response[0][1];
          refresh_token = response[1][1];

          if (access_token !== null) {
            const headers = {
              Authorization: `Bearer ${access_token}`
            };

            axios
              .post(SAVE_MEAL_URL, data, { headers })
              .then(response => {
                if (response.status == 201) {
                  console.log('saved meal');
                  dispatch(gihoType(null));
                  setMealImage('');
                  AsyncStorage.removeItem('@mealImage')
                    .then(() => props.navigation.goBack())
                    .catch(err => console.log(err));
                }
                // todo: 201아니면 에러창 띄워주기
              })
              .catch(err => console.log(err));
          }
        }
      );
    });
  };

  const natvigationOptions = {
    headerStyle: {
      backgroundColor: 'white'
    }
  };

  return (
    <View style={{ backgroundColor: '#F2F9F2', flex: 1 }}>
      {/*<NavigationEvents onWillFocus={() => updateMealImage()} />*/}
      <View style={styles.container}>
        {Platform.OS === 'ios' ? null : <View style={styles.topMargin} />}
        <View style={styles.mintbackground} />
        <View style={styles.titleHeader}>
          <Text style={[styles.txtBigTitle, font.eight]}>끼니 제출</Text>
        </View>
        <View>
          {meal_photo_uri !== null ? (
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Camera')}
              activeOpacity={0.6}
              style={mainImg.screen}
            >
              <Image
                style={mainImg.img} // todo: 이미지 사이즈 조절
                source={{ uri: meal_photo_uri }}
                rotate="90deg"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Camera')}
              activeOpacity={0.6}
              style={mainImg.screen}
            >
              <Text style={mainImg.txt}>터치해서 끼니 촬영</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.bottomHalf}>
          <View style={dateTime.container}>
            <Text style={[dateTime.txt, font.eight]}> {date} </Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <DrinkTypeButton />
          </View>
          <View style={{ flex: 2, justifyContent: 'center' }}>
            <MealTypeButton />
          </View>
          <View style={slider.container}>
            <Text style={slider.txtScore}>{String(mealScore)}</Text>
            <Slider
              step={1}
              value={5}
              thumbTintColor={yellow.a}
              minimumValue={0}
              maximumValue={10}
              minimumTrackTintColor={yellow.a}
              maximumTrackTintColor={gray.a}
              onValueChange={onValueChange}
            />
          </View>
        </View>
      </View>

      <View style={styles.submitButton}>
        <TouchableOpacity
          style={styles.submitTouchable}
          onPress={() => photoUpload()}
        >
          <Text style={[styles.txtSubmit, font.seven]}>확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: '16rem',
    paddingRight: '16rem',
    backgroundColor: 'white'
  },
  topMargin: {
    height: '20rem'
  },
  titleHeader: {
    marginBottom: '15rem',
    alignItems: 'center'
  },
  txtBigTitle: {
    fontSize: '23rem',
    color: gray.d,
    lineHeight: '30rem'
  },
  mintbackground: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 0,
    height: (DEVICE_HEIGHT / 9) * 5,
    width: DEVICE_WIDTH,
    paddingTop: 16,
    paddingLeft: 17,
    paddingRight: 17,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: gray.m
  },
  bottomHalf: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    paddingTop: 0
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: DEVICE_HEIGHT / 9,
    width: DEVICE_WIDTH,
    paddingLeft: 10,
    paddingRight: 10,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 40
  },
  //   shadow 때문에 따로 만들어서 적용
  submitTouchable: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: DEVICE_HEIGHT / 9,
    width: DEVICE_WIDTH,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35
  },
  txtSubmit: {
    fontSize: '18rem',
    color: gray.c,
    marginTop: '20rem'
  }
});

const dateTime = EStyleSheet.create({
  container: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txt: {
    fontSize: '12rem',
    color: gray.b
  }
});

const slider = EStyleSheet.create({
  container: {
    flex: 2.2,
    flexDirection: 'column',
    justifyContent: 'center',
    bottom: 0,
    width: '100%'
  },
  txtScore: {
    marginBottom: '10rem',
    fontSize: '40rem',
    fontFamily: 'JosefinSans-Bold',
    color: yellow.b,
    textAlign: 'center',
    lineHeight: '40rem'
  }
});

const mainImg = EStyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    height: (DEVICE_HEIGHT / 100) * 38,
    borderTopLeftRadius: '70rem',
    borderBottomRightRadius: '70rem',
    borderColor: gray.m,
    borderWidth: 10,
    backgroundColor: 'white'
  },
  img: {
    width: '100%',
    height: (DEVICE_HEIGHT / 100) * 38 - 20,
    borderTopLeftRadius: '60rem',
    borderBottomRightRadius: '60rem',
    resizeMode: 'cover'
  },
  txt: {
    color: gray.b,
    fontWeight: '700',
    fontSize: 16
  }
});

Upload.navigationOptions = ({ navigation }) => ({
  title: '',
  headerBackTitle: '',
  headerShown: Platform.OS === 'ios' ? true : false
});

export default connect(state => ({
  meal_just_taken: state.meal.meal_just_taken
}))(Upload);