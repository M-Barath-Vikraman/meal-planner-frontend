import { apiClient } from './apiClient';

/**
 * Send a prompt message and recent chat history to the Gemini AI Assistant via server API.
 * @param {string} userPrompt - User message text
 * @param {Array<{sender: string, text: string}>} history - Recent conversation history turns
 * @returns {Promise<{ id: string, sender: 'ai', text: string, timestamp: string }>}
 */
export async function sendChatMessage(userPrompt, history = []) {
  try {
    const formattedHistory = Array.isArray(history)
      ? history.map((m) => ({ sender: m.sender, text: m.text }))
      : [];

    const response = await apiClient.post('/ai/chat', {
      message: userPrompt,
      history: formattedHistory,
    });

    return {
      id: `ai_msg_${Date.now()}`,
      sender: 'ai',
      text: response.reply,
      timestamp: response.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err) {
    console.error('[aiService.sendChatMessage] Error:', err);
    throw new Error(err.message || "Sorry, I couldn't generate a response right now. Please try again.");
  }
}

/**
 * Simulate food photo recognition AI scan.
 * @param {File|string} photo 
 * @returns {Promise<{ name: string, mealType: string, confidence: number, ingredients: string[], calories: number, protein: string, carbs: string, fat: string, imageUrl: string }>}
 */
export async function analyzeFoodPhoto(photo) {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const sampleScans = [
    {
      name: 'Paneer Tikka Salad with Mint Chutney',
      mealType: 'Dinner',
      confidence: 0.94,
      ingredients: ['Grilled Cottage Cheese (150g)', 'Sliced Bell Peppers', 'Red Onion Rings', 'Mint Yogurt Dressing', 'Chaath Masala'],
      calories: 340,
      protein: '22g',
      carbs: '12g',
      fat: '20g',
      imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Masala Dosa with Sambhar',
      mealType: 'Breakfast',
      confidence: 0.91,
      ingredients: ['Fermented Rice Dosa', 'Spiced Potato Masala', 'Lentil Sambhar', 'Coconut Chutney'],
      calories: 410,
      protein: '10g',
      carbs: '68g',
      fat: '12g',
      imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Chana Masala with Jeera Rice',
      mealType: 'Lunch',
      confidence: 0.96,
      ingredients: ['Chickpeas (Chana)', 'Onion Tomato Gravy', 'Cumin Rice (Jeera Rice)', 'Fresh Coriander'],
      calories: 490,
      protein: '18g',
      carbs: '74g',
      fat: '11g',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
    }
  ];

  const result = sampleScans[Math.floor(Math.random() * sampleScans.length)];
  return result;
}
