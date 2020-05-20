import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, Image,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationEvents } from 'react-navigation';
import axios from 'axios';
import HomeCircles from '../components/Home/HomeCircles';
import TouchGuideFade from '../components/Home/TouchGuideFade';
import NavBar from '../components/NavBar';
import {
  LOAD_MEALS_URL, LOAD_YESTERDAY_RATING_URL, LOAD_SINCE_MEAL_INFO_URL,
  DEVICE_WIDTH, gray,
  yellow, kiriColor,
  MENTS, weight, home
} from '../utils/consts';

const Home = ({navigation}) => {
  const [meals, setMeals] = useState([]);
  const [todayScore, setTodayScore] = useState(null);
  const [ment, setMent] = useState('오늘 먹은 끼니를 등록해줘!');
  const [scoreCompare, setScoreCompare] = useState(null);
  const [name, setName] = useState('');
  const [mealSince, setMealSince] = useState('-');
  const [coffeeSince, setCoffeeSince] = useState('-');
  const [drinkSince, setDrinkSince] = useState('-');

  useEffect(() => {
    AsyncStorage.getItem('@email').then(result => {
      const id = result.slice(0, result.indexOf('@'));
      setName(id);
      loadTodayMeals();
    });
  }, []);

  useEffect(() => {
    calculateTodayScore();
    loadSinceMealInfo();
  }, [meals]);

  const calculateTodayScore = () => {
    if (meals.length > 0) {
      let sum = 0;
      meals.map(meal => {
        sum += meal.average_rate;
      });
      sum = (sum / meals.length).toFixed(1);

      setTodayScore(sum);
      onChangeScoreCompare();
      onChangeMent();
    }
  };

  const todayKirini = todayScore < 2 
                    ?
                    require('../../assets/img/kirini1.png')
                    :
                    todayScore < 4
                    ?
                    require('../../assets/img/kirini2.png')
                    :
                    todayScore < 6
                    ?
                    require('../../assets/img/kirini3.png')
                    :
                    todayScore < 8
                    ?
                    require('../../assets/img/kirini4.png')
                    :
                    require('../../assets/img/kirini5.png')

  const onChangeMent = () => {
    const _get_rand = end => Math.floor(Math.random() * end);

    let rand, idx;

    if (todayScore < 1) idx = 0;
    else if (todayScore < 2) idx = 1;
    else if (todayScore < 3) idx = 2;
    else if (todayScore < 4) idx = 3;
    else if (todayScore < 5) idx = 4;
    else if (todayScore < 6) idx = 5;
    else if (todayScore < 7) idx = 6;
    else if (todayScore < 8) idx = 7;
    else if (todayScore < 9) idx = 8;
    else idx = 9;

    rand = _get_rand(MENTS[idx].length);
    setMent(MENTS[idx][rand]);
  };

  const onChangeScoreCompare = () => {
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
            .get(LOAD_YESTERDAY_RATING_URL, { headers })
            .then(response => {
              setScoreCompare(response['data']);
            })
            .catch(err => console.log(err));
        }
      }
    );
  };

  const loadTodayMeals = () => {
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
            .get(LOAD_MEALS_URL, { headers })
            .then(response => {
              setMeals(response['data']);
            })
            .catch(err => console.log(err));
        }
      }
    );
  };

  const loadSinceMealInfo = () => {
    const _calculateSinceTime = seconds => {
      if (seconds < 3600) {
        // 1시간 이내
        const minutes = parseInt(seconds / 60);
        return `${minutes}분`;
      } else if (seconds < 86400) {
        // 24시간 이내
        const hours = parseInt(seconds / 3600);
        const minutes = ((seconds % 3600) / 60).toFixed(0);
        return `${hours}시간 ${minutes}분`;
      } else {
        // 그 외는 '일'로 표시
        const days = parseInt(seconds / 86400);
        return `${days}일`;
      }
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
            .get(LOAD_SINCE_MEAL_INFO_URL, { headers })
            .then(response => {
              if (response.status == 200) {
                const since_data = response.data;
                console.log('sinceinfo:', since_data);

                if (since_data['meal'] > 0) {
                  const since_text = _calculateSinceTime(since_data['meal']);
                  setMealSince(since_text);
                }
                if (since_data['drink'] > 0) {
                  const since_text = _calculateSinceTime(since_data['drink']);
                  setDrinkSince(since_text);
                }
                if (since_data['coffee'] > 0) {
                  const since_text = _calculateSinceTime(since_data['coffee']);
                  setCoffeeSince(since_text);
                }
              }
            })
            .catch(err => console.log(err));
        }
      }
    );
  };

  return (
    <View style={{ backgroundColor: kiriColor, flex: 1 }}>
      <NavigationEvents
        onWillFocus={() => {
          loadTodayMeals();
        }}
      />
      <View style={styles.container}>
        <View style={styles.topMargin} />
        <View style={styles.topHalf}>
          <View style={balloonSt.container}>
            <View style={balloonSt.balloon}>
              <View style={balloonSt.topBar}>
                <Text style={styles.txtBigTitle}>오늘 건강도</Text>

                <Text style={balloonText.todayScore}>
                  {!todayScore ? '-' : todayScore}
                </Text>
              </View>
              <View style={balloonSt.scoreCompareArea}>
                <Text style={balloonText.scoreCompareTri}>
                  {!(todayScore && scoreCompare)
                    ? '-'
                    : todayScore - scoreCompare > 0
                    ? '▲ '
                    : '▼ '}
                </Text>
                <Text style={balloonText.scoreCompare}>
                  {!(todayScore && scoreCompare)
                    ? null
                    : Math.round(Math.abs(todayScore - scoreCompare) * 10) / 10}
                </Text>
              </View>
              <View style={balloonSt.lastMealTimeContainer}>
                <View style={balloonSt.lastMealIconWrapper}>
                  <Text style={balloonText.lastMealTime1}>
                    {mealSince === '-' ? '🍽 입력된 끼니' : '🍽 마지막 끼니'}
                  </Text>
                  <Text style={balloonText.lastMealTime}>
                    {coffeeSince === '-'
                      ? '☕️ 입력된 커피'
                      : '☕️ 마지막 커피'}
                  </Text>
                  <Text style={balloonText.lastMealTime}>
                    {drinkSince === '-' ? '🍺 입력된 음주' : '🍺 마지막 음주'}
                  </Text>
                </View>
                <View style={balloonSt.lastMealTimeWrapper}>
                  {mealSince === '-' ? (
                    <Text style={balloonText.lastMealTime1}>아직 없어요</Text>
                  ) : (
                    <Text style={balloonText.lastMealTime1}>
                      {mealSince} 전
                    </Text>
                  )}
                  {coffeeSince === '-' ? (
                    <Text style={balloonText.lastMealTime}>아직 없어요</Text>
                  ) : (
                    <Text style={balloonText.lastMealTime}>
                      {coffeeSince} 전
                    </Text>
                  )}
                  {drinkSince === '-' ? (
                    <Text style={balloonText.lastMealTime}>아직 없어요</Text>
                  ) : (
                    <Text style={balloonText.lastMealTime}>
                      {drinkSince} 전
                    </Text>
                  )}
                </View>
              </View>

              <View style={balloonSt.feedbackArea}>
                <Text style={balloonText.feedback}>
                  {todayScore == null
                    ? `${name}님,`
                    : `${name}님의 오늘 건강도는 ${todayScore}!`}
                </Text>
                <Text style={balloonText.feedback}>{`${ment}`}</Text>
              </View>
            </View>
            <View style={balloonSt.tailContainer}>
              <View style={balloonSt.tailWhiteArea} />
              <View style={balloonSt.tailKiriColorArea} />
              <TouchGuideFade />
              <TouchableOpacity
                style={balloonSt.kiriniContainer}
                onPress={() => navigation.navigate('Upload')}
              >
                <Image
                  style={balloonSt.kirini}
                  source={todayKirini}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.bottomHalf}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={circles.container}>
              <Image
                style={circles.sun}
                source={require('../../assets/img/iconSunBigYellow.png')}
              />
              {meals && <HomeCircles meals={meals} />}
              <Image
                style={circles.moon}
                source={require('../../assets/img/iconMoonBigYellow.png')}
              />
            </View>
          </ScrollView>
        </View>
      </View>

      <NavBar navigation={navigation} default={true} />
    </View>
  );
};

// 공통적으로 쓰일? View 스타일 (화면 분할 등)
const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    zIndex: 2
  },
  topMargin: {
    height: home.margin,
    backgroundColor: kiriColor
  },
  topHalf: {
    flex: 6,
    flexDirection: 'row'
  },
  bottomHalf: {
    flex: 2
  },
  txtBigTitle: {
    fontSize: '27rem',
    color: gray.d,
    lineHeight: '32rem',
    fontWeight: weight.eight
  }
});

// 하얀 말풍선 속 Text 스타일
const balloonText = EStyleSheet.create({
  todayScore: {
    fontSize: '30rem',
    lineHeight: '32rem',
    fontFamily: 'JosefinSans-Bold',
    color: yellow.b
  },
  scoreCompareTri: {
    fontSize: '10rem',
    color: gray.b,
    fontFamily: 'JosefinSans-Bold',
    lineHeight: '15rem'
  },
  scoreCompare: {
    fontSize: '15rem',
    color: gray.b,
    fontFamily: 'JosefinSans-Bold',
    lineHeight: '15rem'
  },
  lastMealTime1: {
    fontSize: '13.5rem',
    color: gray.c,
    textAlign: 'right',
    fontWeight: weight.eight,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  lastMealTime: {
    fontSize: '13.5rem',
    color: gray.b,
    textAlign: 'right',
    fontWeight: weight.eight,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  noMeal: {
    fontSize: '13.5rem',
    color: 'white',
    textAlign: 'right',
    flexDirection: 'column',
    justifyContent: 'space-around',
    fontWeight: weight.eight
  },
  feedback: {
    fontSize: '16rem',
    color: gray.d,
    textAlign: 'right',
    lineHeight: '27rem',
    fontWeight: weight.six
  },
  touchKirini: {
    fontSize: '15rem',
    color: gray.c,
    alignSelf: 'center',
    right: DEVICE_WIDTH / 3,
    top: '7rem',
    fontWeight: weight.six
  }
});

// 하얀 말풍선 속 View 스타일
const balloonSt = EStyleSheet.create({
  container: {
    flex: 4,
    flexDirection: 'column'
  },
  balloon: {
    flex: 1.8,
    flexDirection: 'column',
    width: DEVICE_WIDTH,
    padding: DEVICE_WIDTH / 10,
    borderTopLeftRadius: '70rem',
    borderBottomRightRadius: '70rem',
    backgroundColor: 'white'
  },
  topBar: {
    flex: 0.65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scoreCompareArea: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row'
  },
  lastMealTimeContainer: {
    flex: 1.25,
    flexDirection: 'row',
    paddingTop: '12rem'
  },
  lastMealIconWrapper: {
    flex: 3,
    justifyContent: 'space-around'
  },
  lastMealTimeWrapper: {
    justifyContent: 'space-around',
    paddingLeft: '10rem',
    alignItems: 'flex-start'
  },
  feedbackArea: {
    top: '5rem',
    flex: 1.7,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  tailContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: DEVICE_WIDTH / 10
  },
  tailWhiteArea: {
    width: DEVICE_WIDTH / 3,
    height: DEVICE_WIDTH / 5,
    backgroundColor: 'white'
  },
  tailKiriColorArea: {
    position: 'absolute',
    width: DEVICE_WIDTH / 3,
    height: DEVICE_WIDTH / 3,
    borderTopLeftRadius: '70rem',
    backgroundColor: kiriColor
  },
  kiriniContainer: {
    position: 'absolute',
    right: DEVICE_WIDTH / 10,
    width: (DEVICE_WIDTH * 3) / 10,
    height: DEVICE_WIDTH / 3.5,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  kirini: {
    position: 'absolute',
    marginLeft: 40,
    width: (DEVICE_WIDTH * 3) / 10,
    height: DEVICE_WIDTH / 3,
    alignSelf: 'center',
    resizeMode: 'contain'
  }
});

const circles = EStyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: '15rem'
  },
  circlesContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  sun: {
    width: '35rem',
    height: '35rem',
    marginRight: '10rem',
    resizeMode: 'cover'
  },
  moon: {
    width: '40rem',
    height: '40rem',

    resizeMode: 'cover'
  }
});

// todo: tab navigation
Home.navigationOptions = ({ navigation }) => ({
  headerShown: false
});

export default connect(state => ({
  today: state.meal.meals.today
}))(Home);
