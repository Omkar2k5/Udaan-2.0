import type React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        url?: string;
        class?: string;
        style?: React.CSSProperties;
        'loading-anim'?: string;
        'events-target'?: string;
      }, HTMLElement>;
    }
  }
} 