import React, { useState } from 'react';
import { Text, View, Keyboard, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-community/async-storage';
import {
  deviceWidth,
  deviceHeight,
  gray,
  kiriColor,
  weight,
  home,
  EMAIL_REGISTER_URL
} from '../utils/consts';
import axios from 'axios';

const Register = props => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const onChangeEmail = (value) => {
        setEmail(value)
    }

    const onChangePassword = (value) => {
        setPassword(value)
    }

    const onChangeConfirmPassword = (value) => {
        setConfirmPassword(value)
    }

    const validate = () => {
        return password == confirmPassword
    }

    const register = async () => {
        if(validate()) {
            console.log(1)
            console.log(EMAIL_REGISTER_URL)
            const data = {
                email,
                password
            }
    
            const _result = await axios.post(EMAIL_REGISTER_URL, data)
            console.log(_result["data"])
            if (_result["status"] == 200) {
                const jwt = _result["data"]
                await AsyncStorage.multiSet(
                    [
                      ['@jwt_access_token', jwt['jwt_access_token']],
                      ['@jwt_refresh_token', jwt['jwt_refresh_token']]
                    ])
                props.navigation.goBack()
            } else if (_result["status"] == 302) {
                Alert.alert("중복된 이메일입니다")
            } else {
                Alert.alert("회원가입에 실패하였습니다")
            }
        }
        else {
            Alert.alert("이메일이나 비밀번호를 확인해주세요")
        }
    }

    return (
        <View style={{ backgroundColor: '#F2F9F2', flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.titleHeader}>
                    <Text style={styles.txtBigTitle}>회원가입</Text>
                </View>
                <View style={{flex: 9}}>
                    <View style={{flex: 1, marginTop: 30}}>
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
                                />}
                            value={password}
                            onChangeText={(text) => onChangePassword(text)}
                            blurOnSubmit={false}
                            onSubmitEditing={()=> Keyboard.dismiss()}
                        />
                        <Input
                            placeholder='비밀번호 재입력'
                            secureTextEntry={true}
                            leftIcon={
                                <Icon
                                    type='font-awesome'
                                    name='key'
                                    size={16}
                                    color='black'
                                    style={{marginRight: 10}}
                                />}
                            value={confirmPassword}
                            onChangeText={(text) => onChangeConfirmPassword(text)}
                            blurOnSubmit={false}
                            onSubmitEditing={()=> Keyboard.dismiss()}
                        />
                    </View>
                    <View style={{marginBottom: 50, alignItems: "center"}}>
                        <TouchableOpacity
                            onPress={register}
                            style={styles.loginButton}
                        >
                            <Text style={styles.txtKakao}>가입</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

// todo: tab navigation
Register.navigationOptions = ({ navigation }) => ({
    headerStyle: {
        backgroundColor: kiriColor,
        borderBottomWidth: 0
    },
});

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: '16rem',
    paddingRight: '16rem',
    backgroundColor: '#F2F9F2'
  },
  topMargin: {
    height: home.margin,
    backgroundColor: kiriColor
  },
  titleHeader: {
        flex: 1,
        marginBottom: '15rem'
  },
  txtBigTitle: {
    fontSize: '23rem',
    color: gray.d,
    lineHeight: '30rem',
    fontWeight: weight.eight,
    alignSelf: 'center'
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
  txtKakao: {
    fontSize: '16rem',
    color: gray.d,
    textAlign: 'center',
    fontWeight: weight.seven
  },
});

export default connect(state => ({
  auth: state.auth
}))(Register);
