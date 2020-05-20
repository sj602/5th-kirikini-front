import React, { useState, useEffect } from 'react';
import {
  Platform, StyleSheet, Text,
  View, Image, YellowBox,
  TextInput, Alert, Button,
  TouchableOpacity
} from 'react-native';
import {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager
} from 'react-native-fbsdk';
import { FB_URL } from '../../utils/consts';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  DEVICE_HEIGHT, gray,
  DEVICE_WIDTH, kiriColor,
  yellow, weight
} from '../../utils/consts';

const FBLogin = () => {
  const fbLogin = result => {
    AccessToken.getCurrentAccessToken().then(data => {
      console.log(data.accessToken.toString());
      console.log('fb data: ', data);

      const profileRequestParams = {
        fields: {
          string: 'email'
        }
      };

      const profileRequestConfig = {
        httpMethod: 'GET',
        version: 'v2.5',
        parameters: profileRequestParams,
        accessToken: token.toString()
      };

      const profileRequest = new GraphRequest(
        '/me',
        profileRequestConfig,
        (error, result) => {
          if (error) {
            console.log(error);
          } else {
            console.log('email: ', result);
          }
        }
      );

      new GraphRequestManager().addRequest(profileRequest).start();

      axios
        .post(FB_URL, { access_token: data.accessToken.toString() })
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
        .catch(error => console.log('failed', error));
    });

    LoginManager.logInWithPermissions(['public_profile']).then(
      function(result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString()
          );
        }
      },
      function(error) {
        console.log('Login fail with error: ' + error);
      }
    );

    return (
      <>
        <LoginButton
            publishPermissions={["email"]}
            onLoginFinished={
              (error, result) => {
                if (error) {
                  console.log("login has error: " + result.error);
                } else if (result.isCancelled) {
                  console.log("login is cancelled.");
                } else {
                  fbLogin(result)
                }
              }
            }
          onLogoutFinished={() => console.log("logout.")}/>
        <TouchableOpacity // 추후 추가
          onPress={fbLogin}
          title="페이스북 로그인"
          style={styles.btnFbLogin} >
            {/*<Image
              source={require('../../../assets/img/facebook_logo.png')}
              style={{width:30, height:30, margin:18}}
            />*/}   
          <Text style={styles.txtFbLogin}>페이스북 로그인</Text>
        </TouchableOpacity>
      </>
    )
  }
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

export default FBLogin;