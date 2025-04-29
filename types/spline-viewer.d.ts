declare namespace JSX {
  interface IntrinsicElements {
    'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      url?: string;
      'events-target'?: string;
      loading?: 'lazy' | 'eager';
    }, HTMLElement>;
  }
} 