/**
 * @file foodService.js
 * Cloud-backed service module for managing food items in AWS DynamoDB via API client.
 */

import { apiClient } from './apiClient';

/**
 * Get all foods from DynamoDB database for the authenticated user.
 * @returns {Promise<Array<{ id: string, foodId: string, name: string, mealType: string, ingredients: string[], calories?: number, protein?: string, carbs?: string, fat?: string }>>}
 */
export async function getFoods() {
  try {
    const response = await apiClient.get('/foods');
    return response.data || [];
  } catch (err) {
    console.error('[foodService.getFoods] API Error:', err);
    throw err;
  }
}

/**
 * Get single food item by ID.
 * @param {string} id 
 * @returns {Promise<Object|null>}
 */
export async function getFoodById(id) {
  const foods = await getFoods();
  return foods.find((f) => f.id === id || f.foodId === id) || null;
}

/**
 * Get foods grouped or filtered by meal type.
 * @param {string} mealType 
 * @returns {Promise<Array>}
 */
export async function getFoodsByMealType(mealType) {
  const foods = await getFoods();
  if (!mealType) return foods;
  return foods.filter((f) => f.mealType && f.mealType.toLowerCase() === mealType.toLowerCase());
}

/**
 * Add a new food item to AWS DynamoDB.
 * @param {{ name: string, mealType: string, ingredients: string[]|string, calories?: number, protein?: string, carbs?: string, fat?: string }} foodData 
 * @returns {Promise<Object>} The newly created food item
 */
export async function addFood(foodData) {
  try {
    const response = await apiClient.post('/foods', foodData);
    return response.data;
  } catch (err) {
    console.error('[foodService.addFood] API Error:', err);
    throw err;
  }
}

/**
 * Update an existing food item in AWS DynamoDB.
 * @param {string} id 
 * @param {Object} updatedFields 
 * @returns {Promise<Object>} Updated food item
 */
export async function updateFood(id, updatedFields) {
  try {
    const response = await apiClient.put(`/foods/${id}`, updatedFields);
    return response.data;
  } catch (err) {
    console.error('[foodService.updateFood] API Error:', err);
    throw err;
  }
}

/**
 * Delete a food item by ID from AWS DynamoDB.
 * @param {string} id 
 * @returns {Promise<boolean>} True if deleted
 */
export async function deleteFood(id) {
  try {
    await apiClient.delete(`/foods/${id}`);
    return true;
  } catch (err) {
    console.error('[foodService.deleteFood] API Error:', err);
    throw err;
  }
}
