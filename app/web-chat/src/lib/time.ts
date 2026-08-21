/**
 * Returns a dynamic greeting based on the user's local time.
 * This function relies on the built-in Date object, which naturally adapts 
 * to the user's local timezone (e.g., America vs India).
 */
export function getDynamicGreeting(): string {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    const greetings = [
      "Good morning", 
      "Rise and shine", 
      "Ready for the day?",
      "Early bird chat?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  } else if (currentHour >= 12 && currentHour < 17) {
    const greetings = [
      "Good afternoon", 
      "How's your day going?", 
      "Afternoon chat?",
      "Having a good day?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  } else if (currentHour >= 17 && currentHour < 21) {
    const greetings = [
      "Good evening", 
      "Winding down?", 
      "Evening reflections?",
      "Hope you had a great day"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  } else {
    // 21 (9 PM) to 4 AM
    const greetings = [
      "Moonlit chat?", 
      "Late night thoughts?", 
      "Midnight musings?",
      "Burning the midnight oil?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
}
