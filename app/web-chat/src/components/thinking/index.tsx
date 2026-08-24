import React from 'react';
import { BouncingDots } from './bouncing-dots';
import { PulsingSkeleton } from './pulsing-skeleton';
import { Spinner } from './spinner';

export type ThinkingStyle = 'dots' | 'skeleton' | 'spinner';

interface ThinkingIndicatorProps {
  style?: ThinkingStyle;
}

export function ThinkingIndicator({ style = 'dots' }: ThinkingIndicatorProps) {
  switch (style) {
    case 'skeleton':
      return <PulsingSkeleton />;
    case 'spinner':
      return <Spinner />;
    case 'dots':
    default:
      return <BouncingDots />;
  }
}
