/**
 * Mock data definitions for SmartMeal application.
 * Static mock foods and meal plans have been removed so all data is fetched exclusively from AWS DynamoDB.
 */

export const INITIAL_USER = {
  id: 'usr_101',
  name: 'SmartMeal User',
  email: 'user@smartmeal.ai',
  avatarUrl: '',
  dietPreference: 'Healthy Indian',
  dailyCalorieGoal: 2000,
};

export const INITIAL_FOODS = [];

export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_MEAL_PLANS = {};
