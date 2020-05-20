import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert, Linking } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import NavBar from '../components/NavBar';
import { logout } from '../store/auth/action';
import EStyleSheet from 'react-native-extended-stylesheet';
import KakaoLogins from '@react-native-seoul/kakao-login';
import appleAuth, {
  AppleAuthRequestOperation,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import InAppBrowser from 'react-native-inappbrowser-reborn'
import {
  DEVICE_WIDTH, PRIVACY_URL,
  gray, kiriColor, weight,
  home
} from '../utils/consts';

const ModalView = (modalVisible, setModalVisible) => {
  return (
    <Modal
      style={{ margin: 80 }}
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity
        onPressOut={() => setModalVisible(false)}
      >
        <WebView source={{ uri: `${PRIVACY_URL}` }} style={{ flex: 1 }} />
      </TouchableOpacity>
    </Modal>
  )
}

// todo: 자동로그인 on/off
const Settings = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  console.log("modalVIsible", modalVisible)
  const appleLogout = async () => {
    // performs logout request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGOUT,
    });
  
    // get current authentication state for user
    const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
  
    // use credentialState response to ensure the user credential's have been revoked
    if (credentialState === AppleAuthCredentialState.REVOKED) {
      // user is unauthenticated
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        '@jwt_access_token',
        '@jwt_refresh_token',
        '@email'
      ]);
      await KakaoLogins.logout();
      // await appleLogout();

      dispatch(logout());
      props.navigation.navigate('Login');
    } catch (e) {
      Alert.alert(e.toString());
    }
  };

  const openUrl = async () => {
    try {
      const url = `${PRIVACY_URL}`
      console.log(1)
      if (await InAppBrowser.isAvailable()) {
        console.log(2)
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'overFullScreen',
          modalTransitionStyle: 'partialCurl',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#6200EE',
          secondaryToolbarColor: 'black',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right'
          },
          headers: {
            'my-custom-header': 'my custom header value'
          }
        })
        Alert.alert(JSON.stringify(result))
      }
      else Linking.openURL(url)
    } catch (error) {
      Alert.alert(error.message)
    }
  }


  return (
    <View style={{ backgroundColor: '#F2F9F2', flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.topMargin} />
        <View style={styles.titleHeader}>
          <Text style={styles.txtBigTitle}>설정</Text>
        </View>
        <View style={content.container}>
          <TouchableOpacity
            onPress={() => handleLogout()}
            style={content.button}
          >
            <Text style={content.txt}>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openUrl()}
            // onPress={() => setModalVisible(!modalVisible)}
            style={content.button}
          >
            <Text style={content.txt}>개인정보처리방침</Text>
          </TouchableOpacity>
        </View>
      </View>

      <NavBar navigation={props.navigation} />
    </View>
  );
};

// todo: tab navigation
Settings.navigationOptions = ({ navigation }) => ({
  headerShown: false
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
    marginBottom: '15rem'
  },
  txtBigTitle: {
    fontSize: '23rem',
    color: gray.d,
    lineHeight: '30rem',
    fontWeight: weight.eight,
    alignSelf: 'center'
  }
});

const content = EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around'
  },
  button: {
    marginTop: '20rem',
    width: '50%',
    height: DEVICE_WIDTH / 6.1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: '30rem'
  },
  txt: {
    textAlign: 'center',
    fontSize: '16rem',
    color: gray.d,
    fontWeight: weight.seven
  }
});

export default connect(state => ({
  auth: state.auth
}))(Settings);
