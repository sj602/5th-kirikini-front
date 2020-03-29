import React, { useState, useEffect } from 'react';
import {
  Platform, StyleSheet, Text,
  View, Image, YellowBox,
  TextInput, Alert, Button,
  TouchableOpacity
} from 'react-native';
import { connect, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import appleAuth, {
  AppleButton,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import KakaoLogins from '@react-native-seoul/kakao-login';
import {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager
} from 'react-native-fbsdk';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { loginSuccess, loginMethod } from '../store/auth/action';
import {
  deviceHeight,
  EMAIL_URL,
  gray,
  KAKAO_URL,
  FB_URL,
  AUTO_URL,
  deviceWidth,
  kiriColor,
  yellow,
  weight
} from '../utils/consts';
import EStyleSheet from 'react-native-extended-stylesheet';

if (!KakaoLogins) {
  console.error('Module is Not Linked');
}

const logCallback = (log, callback) => {
  console.log(log);
  callback;
};

const Login = props => {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    autoLogin();
  }, []);

  const onChangeEmail = _email => {
    setEmail(_email);
  };

  const onChangePassword = _password => {
    setPassword(_password);
  };

  const emailLogin = async () => {
    const data = {
      email,
      password
    };

    const _result = await axios.post(EMAIL_URL, data, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
    if (_result.status === 200) {
      const jwt = _result["data"]
      await AsyncStorage.multiSet([
          ['@jwt_access_token', jwt['jwt_access_token']],
          ['@jwt_refresh_token', jwt['jwt_refresh_token']],
          ['@email', email]
        ]);
      props.navigation.navigate('Home')
    } else {
      console.log(_result.data)
    }
  };

  const autoLogin = async () => {
    await AsyncStorage.multiGet([
      '@jwt_access_token',
      '@jwt_refresh_token',
      '@email'
    ]).then(response => {
      const access_token = response[0][1];
      const refresh_token = response[1][1];
      const email = response[2][1];

      if (access_token !== null) {
        const body = {
          jwt_access_token: access_token,
          jwt_refresh_token: refresh_token,
          email: email
        };

        axios
          .post(AUTO_URL, body)
          .then(response => {
            if (response.status == 200) {
              dispatch(loginSuccess());
              props.navigation.navigate('Home');
            } else if (response.status == 201) {
              AsyncStorage.setItem('@jwt_access_token', response['data']);
              dispatch(loginSuccess());
              props.navigation.navigate('Home');
            } else if (response.status == 401) {
              Alert.alert('소셜로그인을 다시 진행해주세요!');
            } else console.log(response.data);
          })
          .catch(err => console.log(err));
      }
    });
  };

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
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          style={{
            flexDirection: 'row',
            width: deviceWidth,
            justifyContent: 'space-between'
          }}
        >
          <Image style={styles.leaf} source={require('../img/leaf_left.png')} />
          <Image
            style={styles.leaf}
            source={require('../img/leaf_right.png')}
          />
        </View>
        <Text style={styles.txtKiri}>KIRIKINI</Text>

        <Image style={styles.kirini} source={require('../img/kirini1.png')} />
      </View>
      <View style={{width: deviceWidth * 0.7, marginTop: 10}}>
        <Input
          placeholder='이메일'
          leftIcon={
            <Icon
              type='font-awesome'
              name='envelope'
              size={16}
              color='black'
              style={{marginRight: 10}}
            />
          }
          value={email}
          onChangeText={(text) => onChangeEmail(text)}
        />
        <Input
          placeholder='비밀번호'
          secureTextEntry={true}
          leftIcon={
            <Icon
              type='font-awesome'
              name='key'
              size={16}
              color='black'
              style={{marginRight: 10}}
            />
          }
          value={password}
          onChangeText={(text) => onChangePassword(text)}
        />
      </View>
      <TouchableOpacity
        onPress={emailLogin}
        style={styles.loginButton}
      >
        <Text style={styles.txtKakao}>로그인</Text>
      </TouchableOpacity>
      <Text style={styles.textKini}>{error}</Text>

      <View style={{marginTop: 10}}>
          <Button onPress={() => props.navigation.navigate("Register")} title="회원가입"></Button>
      </View>

      <View style={{flexDirection: "row", justifyContent: "center", marginTop: 10}}>
        <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: 'gray', marginLeft: 80}}>
        </View>
        <Text style={{fontSize: 12, marginLeft: 20, marginRight: 20, color: 'gray'}}>
          또는
        </Text>
        <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: 'gray', marginRight: 80}}>
        </View>
      </View>
      
      <TouchableOpacity onPress={kakaoLogin} style={styles.kakaoButton}>
        <Image
          style={styles.kakaoLogo}
          source={require('../img/kakao_logo.png')}
        />
        <Text style={styles.txtKakao}>카카오 계정으로 시작</Text>
      </TouchableOpacity>

      {
        Platform.OS === 'ios'
        ?
        (
          <TouchableOpacity onPress={appleLogin} style={styles.appleButton}>
            <Image
              style={styles.kakaoLogo}
              source={require('../img/apple_logo.png')}
            />
            <Text style={styles.txtApple}>애플 계정으로 시작</Text>
          </TouchableOpacity>
        )
        :
        null
      }
      

      {/*<LoginButton
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
        onLogoutFinished={() => console.log("logout.")}/>*/}
      {/*<TouchableOpacity // 추후 추가
          onPress={fbLogin}
          title="페이스북 로그인"
          style={styles.btnFbLogin} >
            <Image
              source={require('../img/facebook_logo.jpg')}
              style={{width:30, height:30, margin:18}}
            />          
          <Text style={styles.txtFbLogin}>페이스북 로그인</Text>
        </TouchableOpacity>*/}
    </View>
  );
};

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
    height: deviceHeight / 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  appleButton: {
    marginTop: 20,
    flexDirection: 'row',
    width: '250rem',
    backgroundColor: 'black',
    borderRadius: '30rem',
    height: deviceHeight / 13,
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
    height: deviceHeight / 13,
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
    width: (deviceWidth * 1) / 2,
    height: deviceWidth / 4,
    resizeMode: 'contain'
  },
  leaf: {
    width: (deviceWidth * 1) / 3,
    height: deviceWidth / 5,
    resizeMode: 'contain'
  }
});

// todo: tab navigation
Login.navigationOptions = ({ navigation }) => ({
  headerShown: false
});

YellowBox.ignoreWarnings(['source.uri']);
export default connect(state => ({
  auth: state.auth
}))(Login);
