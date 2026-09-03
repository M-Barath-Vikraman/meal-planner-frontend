/**
 * @file mealPlanService.js
 * Cloud-backed service module for meal planning in AWS DynamoDB via API client.
 */

import { apiClient } from './apiClient';
import { getTodayDateString } from '../data/initialMockData';

/**
 * Get planned meals for a specific date (YYYY-MM-DD) from DynamoDB.
 * @param {string} dateStr 
 * @returns {Promise<Array<{ id: string, foodId?: string, name: string, mealType: string, ingredients: string[], calories?: number, completed: boolean }>>}
 */
export async function getPlanByDate(dateStr = getTodayDateString()) {
  try {
    const response = await apiClient.get('/plans', { date: dateStr });
    return response.data || [];
  } catch (err) {
    console.error('[mealPlanService.getPlanByDate] API Error:', err);
    return [];
  }
}

/**
 * Add a meal item to a specific date and meal section in DynamoDB.
 * @param {string} dateStr - Date YYYY-MM-DD
 * @param {{ foodId?: string, name: string, mealType: string, ingredients: string[], calories?: number }} mealItem 
 * @returns {Promise<Object>} Added plan item
 */
export async function addMealToPlan(dateStr, mealItem) {
  try {
    const response = await apiClient.post('/plans', {
      date: dateStr,
      ...mealItem,
    });
    return response.data;
  } catch (err) {
    console.error('[mealPlanService.addMealToPlan] API Error:', err);
    throw err;
  }
}

/**
 * Toggle completed state of a meal item in DynamoDB.
 * @param {string} dateStr 
 * @param {string} planItemId 
 * @returns {Promise<Object>} Updated meal item
 */
export async function toggleMealCompletion(dateStr, planItemId) {
  try {
    const response = await apiClient.patch(`/plans/${planItemId}/complete`, { date: dateStr });
    return response.data;
  } catch (err) {
    console.error('[mealPlanService.toggleMealCompletion] API Error:', err);
    throw err;
  }
}

/**
 * Delete a meal item from a date plan in DynamoDB.
 * @param {string} dateStr 
 * @param {string} planItemId 
 * @returns {Promise<boolean>}
 */
export async function deleteMealFromPlan(dateStr, planItemId) {
  try {
    await apiClient.delete(`/plans/${planItemId}`, { params: { date: dateStr } });
    return true;
  } catch (err) {
    console.error('[mealPlanService.deleteMealFromPlan] API Error:', err);
    throw err;
  }
}

/**
 * Get monthly meal counts map for calendar UI indicators.
 * @param {number} year 
 * @param {number} month - 0 indexed
 * @returns {Promise<Record<string, { count: number, completedCount: number }>>}
 */
export async function getMonthlySummary(year, month) {
  try {
    const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
    const response = await apiClient.get('/plans/summary', { month: monthStr });
    return response.data || {};
  } catch (err) {
    console.error('[mealPlanService.getMonthlySummary] API Error:', err);
    return {};
  }
}
