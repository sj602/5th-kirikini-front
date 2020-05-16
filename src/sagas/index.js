import { all, fork } from 'redux-saga/effects';
import authSaga from './auth';
import mealSaga from './meal';

function* rootSaga() {
    yield all([
        fork(authSaga),
        fork(mealSaga)
    ])
}

export default rootSaga;