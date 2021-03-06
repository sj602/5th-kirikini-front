export const mealAction = {
    saga: 'MEAL_SAGA',
    today: 'MEAL_TODAY',
    saveMeal: 'SAVE_MEAL',
    mealType: 'MEAL_TYPE',
    gihoType: 'GIHO_TYPE',
    month_meal: 'MONTH_MEAL',
    meal_rate: 'MEAL_RATE'
};

export const mealSaga = () => ({
    type: mealAction.saga
});

export const mealToday = (meal) => ({
    type: mealAction.today,
    meal: meal
});

export const mealMonth = (meals) => ({
    type: mealAction.month_meal,
    meals: meals
});

export const saveMeal = (file, timestamp) => ({
    type: mealAction.saveMeal,
    file: file,
    timestamp: timestamp
});

export const mealType = (data) => ({
    type: mealAction.mealType,
    mealType: data
});

export const gihoType = (data) => ({
    type: mealAction.gihoType,
    gihoType: data
});

export const mealRate = (meals) => ({
    type: mealAction.meal_rate,
    meals: meals
});