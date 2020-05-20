import React, { useState, useEffect } from 'react';
import {
 Text, Image, YellowBox,
  TextInput, Alert, Button,
  TouchableOpacity
} from 'react-native';
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  DEVICE_HEIGHT, gray,
  DEVICE_WIDTH, kiriColor,
  yellow, weight
} from '../../utils/consts';

const AppleLogin = () => {
  const appleLogin = async () => {
    if(appleAuth.isSupported) {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
      });
      console.log(456)
    
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
      console.log(789)
      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        console.log(101010)
        console.log(credentialState)
      }
    } else {
      Alert.alert('애플 로그인은 iOS 13 이상부터 가능합니다')
    }
  }

  return (
    <TouchableOpacity onPress={appleLogin} style={styles.appleButton}>
      <Image
        style={styles.kakaoLogo}
        source={require('../../../assets/img/apple_logo.png')}
      />
      <Text style={styles.txtApple}>애플 계정으로 시작</Text>
    </TouchableOpacity>
  )
}


const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: '40rem',
    alignItems: 'center',
    backgroundColor: kiriColor
  },
  content: {
    alignItems: 'center'
  },
  txtKiri: {
    fontSize: '60rem',
    fontFamily: 'Digitalt',
    color: yellow.a,
    top: '-40rem'
  },
  textKini: {
    fontSize: '15rem',
    color: gray.d,
    textAlign: 'center'
  },
  button: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 30
  },
  btnKakaoLogin: {
    height: 48,
    width: 240,
    alignSelf: 'center',
    backgroundColor: '#F8E71C',
    borderRadius: 0,
    borderWidth: 0
  },
  loginButton: {
    marginTop: '20rem',
    flexDirection: 'row',
    width: '250rem',
    backgroundColor: 'lightgreen',
    borderRadius: '30rem',
    height: DEVICE_HEIGHT / 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  appleButton: {
    marginTop: 20,
    flexDirection: 'row',
    width: '250rem',
    backgroundColor: 'black',
    borderRadius: '30rem',
    height: DEVICE_HEIGHT / 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtApple: {
    fontSize: '16rem',
    color: 'white',
    textAlign: 'center',
    fontWeight: weight.seven
  },
  kakaoButton: {
    marginTop: 20,
    flexDirection: 'row',
    width: '250rem',
    backgroundColor: yellow.a,
    borderRadius: '30rem',
    height: DEVICE_HEIGHT / 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  kakaoLogo: {
    width: '20rem',
    height: '20rem',
    marginRight: '20rem',
    resizeMode: 'contain'
  },
  txtKakao: {
    fontSize: '16rem',
    color: gray.d,
    textAlign: 'center',
    fontWeight: weight.seven
  },
  txtKakaoLogin: {
    fontSize: 16,
    color: '#3d3d3d'
  },
  btnFbLogin: {
    height: 49,
    width: 300,
    backgroundColor: '#3A589E',
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 7
  },
  txtFbLogin: {
    fontSize: 16,
    color: 'white',
    paddingLeft: 50
  },
  kirini: {
    width: (DEVICE_WIDTH * 1) / 2,
    height: DEVICE_WIDTH / 4,
    resizeMode: 'contain'
  },
  leaf: {
    width: (DEVICE_WIDTH * 1) / 3,
    height: DEVICE_WIDTH / 5,
    resizeMode: 'contain'
  }
});

export default AppleLogin