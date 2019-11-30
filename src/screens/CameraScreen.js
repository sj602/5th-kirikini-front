import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImagePicker from 'react-native-image-picker';

const gray = {
  m: '#F2F9F2',
  a: '#EAEAEA',
  b: '#B7B7B7',
  c: '#898989',
  d: '#505151'
};

const yellow = {
  a: '#FCDB3A',
  b: '#F9CD15'
};

const meal = {
  a: '#C8BAE5',
  b: '#AFEAA2',
  c: '#AFCAF2',
  d: '#9CD8C8'
};

const deviceWidth = Dimensions.get('window').width;
// const deviceHeight = Dimensions.get('window').height;

const CameraScreen = () => {
  // 촬영 버튼에 적용할 takePicture()
  const takePicture = async () => {
    if (camera) {
      const options = { quality: 0.5 };
      const data = await camera.takePictureAsync(options);
      console.log(data.uri);
    }
  };
  // 넌 뭐하는 애니?
  // const natvigationOptions = {
  //   header: null,
  // };

  // 사진 앨범 불러오기
  const openAlbum = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.launchImageLibrary(options, response => {});
  };

  const CameraView = () => {
    return (
      <TouchableOpacity onPress={() => takePicture()}>
        <RNCamera
          ref={ref => {
            camera = ref;
          }}
          style={cameraSt.cameraView}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {/* <TouchableOpacity onPress={() => takePicture()}>
        <RNCamera
          ref={ref => {
            camera = ref;
          }}
          style={cameraSt.cameraView}
        />
      </TouchableOpacity> */}
      <CameraView />
      <View style={cameraSt.buttonContainer}>
        <TouchableOpacity onPress={() => takePicture()} style={cameraSt.button}>
          <Text style={cameraSt.text}>촬영</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openAlbum()} style={cameraSt.button}>
          <Text style={cameraSt.text}>앨범에서 불러오기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const cameraSt = StyleSheet.create({
  cameraView: {
    width: deviceWidth,
    height: deviceWidth
  },
  buttonContainer: {
    padding: 30,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    marginBottom: 30,
    borderRadius: 100,
    backgroundColor: gray.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 2
  },
  text: {
    fontSize: 15,
    lineHeight: 25,
    fontWeight: '700',
    color: gray.c,
    textAlign: 'center'
  }
});

export default CameraScreen;
