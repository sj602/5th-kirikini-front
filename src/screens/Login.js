import React, { useState, useEffect } from 'react';
import {
  Platform, Text,
  View, Image, YellowBox,
  Alert, Button,
} from 'react-native';
import { connect, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { loginSuccess, loginMethod } from '../store/auth/action';
import {
  DEVICE_HEIGHT, gray,
  AUTO_URL, DEVICE_WIDTH, kiriColor,
  yellow, weight
} from '../utils/consts';
import EStyleSheet from 'react-native-extended-stylesheet';
import KakaoLogin from '../components/Login/KakaoLogin';
import EmailLogin from '../components/Login/EmailLogin';
import FBLogin from '../components/Login/FBLogin';
import AppleLogin from '../components/Login/AppleLogin';

const Login = props => {
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

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          style={{
            flexDirection: 'row',
            width: DEVICE_WIDTH,
            justifyContent: 'space-between'
          }}
        >
          <Image style={styles.leaf} source={require('../../assets/img/leaf_left.png')} />
          <Image
            style={styles.leaf}
            source={require('../../assets/img/leaf_right.png')}
          />
        </View>
        <Text style={styles.txtKiri}>KIRIKINI</Text>

        <Image style={styles.kirini} source={require('../../assets/img/kirini1.png')} />
      </View>
      <View style={{width: DEVICE_WIDTH * 0.7, marginTop: 10}}>
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
      <Text style={styles.textKini}>{error}</Text>

      <View style={{marginTop: 10}}>
          <Button onPress={() => props.navigation.navigate("Register")} title="회원가입"></Button>
      </View>

      <EmailLogin />

      <View style={{flexDirection: "row", justifyContent: "center", marginTop: 10}}>
        <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: 'gray', marginLeft: 80}}>
        </View>
        <Text style={{fontSize: 12, marginLeft: 20, marginRight: 20, color: 'gray'}}>
          또는
        </Text>
        <View style={{flex: 1, borderBottomWidth: 1, borderBottomColor: 'gray', marginRight: 80}}>
        </View>
      </View>
      
      <KakaoLogin />
      { Platform.OS === 'ios' ? <AppleLogin /> : null }
      {/*<FBLogin />*/}
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

// todo: tab navigation
Login.navigationOptions = ({ navigation }) => ({
  headerShown: false
});

YellowBox.ignoreWarnings(['source.uri']);
export default connect(state => ({
  auth: state.auth
}))(Login);
