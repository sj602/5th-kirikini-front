import React, { useState, useEffect } from 'react';
import {
  Text, Image,
  TouchableOpacity
} from 'react-native';
import KakaoLogins from '@react-native-seoul/kakao-login';
import { KAKAO_URL } from '../../utils/consts';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  DEVICE_HEIGHT, gray,
  DEVICE_WIDTH, kiriColor,
  yellow, weight
} from '../../utils/consts';

const logCallback = (log, callback) => {
  console.log(log);
  callback;
};

if (!KakaoLogins) {
  console.error('Module is Not Linked');
}

const KakaoLogin = () => {
  const [token, setToken] = useState('');

  const kakaoLogin = () => {
    KakaoLogins.login()
      .then(result => {
        console.log(result);
        setToken(result.accessToken);

        KakaoLogins.getProfile()
          .then(res => {
            setEmail(res.email);

            AsyncStorage.setItem('@email', res.email).then(() => {
              const body = {
                access_token: result.accessToken,
                refresh_token: result.refreshToken
              };

              axios
                .post(KAKAO_URL, body)
                .then(response => response.data)
                .then(jwt => {
                  AsyncStorage.multiSet(
                    [
                      ['@jwt_access_token', jwt['jwt_access_token']],
                      ['@jwt_refresh_token', jwt['jwt_refresh_token']]
                    ],
                    () => autoLogin()
                  );
                })
                .catch(err => {
                  console.log('failed', err);
                });
            });
          })
          .catch(err => {
            logCallback(`Get Profile Failed:${err.code} ${err.message}`);
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <TouchableOpacity onPress={kakaoLogin} style={styles.kakaoButton}>
      <Image
        style={styles.kakaoLogo}
        source={require('../../../assets/img/kakao_logo.png')}
      />
      <Text style={styles.txtKakao}>카카오 계정으로 시작</Text>
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

export default KakaoLogin;