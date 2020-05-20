import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  Platform
} from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { saveMeal } from '../store/meal/action';
import {
  DEVICE_WIDTH, DEVICE_HEIGHT, gray,
  yellow, weight
} from '../utils/consts';
import EStyleSheet from 'react-native-extended-stylesheet';

const CameraScreen = ({ navigation }) => {
  const [email, setEmail] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    AsyncStorage.getItem('@email')
      .then(data => setEmail(data))
      .catch(err => console.log('get email failed'));
  }, [])

  const takePicture = async () => {
    if (camera) {
      const options = { quality: 0.5 };
      const data = await camera.takePictureAsync(options);

      const timezoneOffset = new Date().getTimezoneOffset() * 60000;
      const timestamp = new Date(Date.now() - timezoneOffset).toISOString();

      const file = {
        uri: data.uri,
        name: `${email}_${timestamp}.jpg`,
        type: 'image/jpg'
      };
      dispatch(saveMeal(file, timestamp));
      navigation.goBack();
    }
  };

  // 사진 앨범 불러오기
  const openAlbum = () => {
    const options = {
      title: '음식 사진을 선택해주세요',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.launchImageLibrary(options, data => {
      if (data.uri) {
        const timezoneOffset = new Date().getTimezoneOffset() * 60000;
        let timestamp = new Date(Date.now() - timezoneOffset).toISOString();

        timestamp = data.timestamp ? data.timestamp : timestamp;
        const file = {
          uri: data.uri,
          name: `${email}_${timestamp}.jpg`,
          type: 'image/jpg'
        };
        dispatch(saveMeal(file, timestamp));
        navigation.goBack();
      }
    });
  };

  const CameraView = () => {
    return (
      <TouchableOpacity onPress={() => takePicture()}>
        <RNCamera
          ref={ref => {
            camera = ref;
          }}
          style={cameraSt.cameraView}
          captureAudio={false}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={cameraSt.container}>
      <CameraView />
      <View style={cameraSt.buttonContainer}>
        <TouchableOpacity onPress={() => openAlbum()} style={cameraSt.button1}>
          <Text style={cameraSt.text1}>앨범에서 불러오기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => takePicture()}
          style={cameraSt.button2}
        >
          <Text style={cameraSt.text2}>촬영</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const cameraSt = EStyleSheet.create({
  container: {
    backgroundColor: gray.m,
    flex: 1,
    alignItems: 'center'
  },
  cameraView: {
    width: DEVICE_WIDTH,
    height: DEVICE_WIDTH
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '20rem',
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button1: {
    bottom: 10,
    width: '160rem',
    height: DEVICE_HEIGHT / 13,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '30rem',
    marginRight: '20rem'
  },
  button2: {
    bottom: 10,
    width: '150rem',
    height: DEVICE_HEIGHT / 13,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: yellow.a,
    borderRadius: '30rem'
  },
  text1: {
    textAlign: 'center',
    fontSize: '15rem',
    color: gray.c,
    fontWeight: weight.eight
  },
  text2: {
    textAlign: 'center',
    fontSize: '15rem',
    color: 'white',
    fontWeight: weight.eight
  }
});

CameraScreen.navigationOptions = ({ navigation }) => ({
  title: '',
  headerBackTitle: '',
  headerShown: Platform.OS === 'ios' ? true : false
});

export default connect(state => ({
  meal: state.meal
}))(CameraScreen);