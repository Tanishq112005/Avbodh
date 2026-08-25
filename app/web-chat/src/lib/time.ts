export function getDynamicGreeting(): string {
  const hr = new Date().getHours();

  const greetings =
    hr >= 5 && hr < 12
      ? [
          'Good morning',
          'Rise and shine',
          'Ready for the day?',
          'Early bird chat?',
        ]
      : hr >= 12 && hr < 17
        ? [
            'Good afternoon',
            "How's your day going?",
            'Afternoon chat?',
            'Having a good day?',
          ]
        : hr >= 17 && hr < 21
          ? [
              'Good evening',
              'Winding down?',
              'Evening reflections?',
              'Hope you had a great day',
            ]
          : [
              'Moonlit chat?',
              'Late night thoughts?',
              'Midnight musings?',
              'Burning the midnight oil?',
            ];

  return greetings[Math.floor(Math.random() * greetings.length)];
}
