export interface ResponsiveValue {
  default: string;
  sm: string;
  md: string;
}

export interface Theme {
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    static: {
      'space.0': string;
      'space.050': string;
      'space.075': string;
      'space.100': string;
      'space.150': string;
      'space.200': string;
      'space.300': string;
      'space.400': string;
      'space.600': string;
      'space.800': string;
      'space.900': string;
      'space.1200': string;
    };
    responsive: {
      'space.2xs': ResponsiveValue;
      'space.xs': ResponsiveValue;
      'space.sm': ResponsiveValue;
      'space.md': ResponsiveValue;
      'space.lg': ResponsiveValue;
      'space.xl': ResponsiveValue;
      'space.2xl': ResponsiveValue;
    };
  };
  font: {
    size: {
      'f-3': string;
      'f-2': string;
      'f-1': string;
      f0: string;
      f1: string;
      f2: string;
      f3: string;
      f4: string;
      f5: string;
      f6: string;
    };
    family: {
      brand: string;
      sans: string;
      mono: string;
    };
    weight: {
      light: string;
      regular: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  'letter-spacing': {
    tight: string;
    comfortable: string;
    spacious: string;
  };
  'line-height': {
    sm: string;
    md: string;
    lg: string;
  };
  'text-transform': {
    uppercase: string;
  };
  opacity: {
    '25': string;
    '50': string;
    '75': string;
    '100': string;
    transparent: string;
  };
  grid: {
    columns: {
      default: string;
      sm: string;
    };
    gutter: {
      default: string;
      sm: string;
      lg: string;
    };
    margin: {
      default: string;
      sm: string;
      lg: string;
    };
  };
  'border-radius': {
    none: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  color: {
    white: string;
    black: string;
    neutral: {
      '05': string;
      '10': string;
      '20': string;
      '30': string;
      '40': string;
      '50': string;
      '60': string;
      '70': string;
      '80': string;
    };
    pink: {
      '10': string;
      '20': string;
      '30': string;
      '40': string;
      '50': string;
      '60': string;
      '70': string;
    };
    yellow: {
      '10': string;
      '20': string;
      '30': string;
      '40': string;
      '50': string;
      '60': string;
      '70': string;
    };
    blue: {
      '10': string;
      '20': string;
      '30': string;
      '40': string;
      '50': string;
      '60': string;
      '70': string;
    };
    indigo: {
      '10': string;
      '20': string;
      '30': string;
      '40': string;
      '50': string;
      '60': string;
      '70': string;
    };
    teal: {
      '10': string;
      '20': string;
      '30': string;
      '40': string;
      '50': string;
      '60': string;
      '70': string;
    };
    orange: {
      '10': string;
      '20': string;
      '30': string;
      '40': string;
      '50': string;
      '60': string;
      '70': string;
    };
    green: {
      '10': string;
      '20': string;
      '30': string;
      '40': string;
      '50': string;
      '60': string;
      '70': string;
    };
    ui: {
      blue: {
        '10': string;
        '40': string;
        '60': string;
      };
      green: {
        '10': string;
        '40': string;
        '60': string;
      };
      grey: {
        '10': string;
        '40': string;
        '60': string;
      };
      yellow: {
        '10': string;
        '40': string;
        '60': string;
      };
      red: {
        '10': string;
        '40': string;
        '60': string;
      };
    };
    disabled: {
      light: string;
      mid: string;
      dark: string;
    };
    information: {
      light: string;
      mid: string;
      dark: string;
    };
    success: {
      light: string;
      mid: string;
      dark: string;
    };
    warning: {
      light: string;
      mid: string;
      dark: string;
    };
    error: {
      light: string;
      mid: string;
      dark: string;
    };
    collection: {
      'neutral-cool': {
        '200': string;
        '300': string;
        '400': string;
        '500': string;
        '600': string;
        '700': string;
        '1000': string;
      };
      'neutral-warm': {
        '200': string;
        '300': string;
        '400': string;
      };
      yellow: {
        '200': string;
        '500': string;
        '700': string;
      };
      green: {
        '200': string;
        '500': string;
        '700': string;
      };
      blue: {
        '200': string;
        '700': string;
      };
      turquoise: {
        '200': string;
        '700': string;
      };
      salmon: {
        '200': string;
        '700': string;
      };
      purple: {
        '200': string;
        '700': string;
      };
      ui: {
        'validation-green': string;
        'validation-red': string;
        'focus-yellow': string;
      };
    };
    legacy: {
      black: string;
      white: string;
      amber: {
        '05': string;
        '10': string;
        '20': string;
        '30': string;
        '40': string;
        '50': string;
        '60': string;
        '70': string;
        '80': string;
        '90': string;
      };
      blue: {
        '05': string;
        '10': string;
        '20': string;
        '30': string;
        '40': string;
        '50': string;
        '60': string;
        '70': string;
        '80': string;
        '90': string;
      };
      cyan: {
        '05': string;
        '10': string;
        '20': string;
        '30': string;
        '40': string;
        '50': string;
        '60': string;
        '70': string;
        '80': string;
        '90': string;
      };
      green: {
        '05': string;
        '10': string;
        '20': string;
        '30': string;
        '40': string;
        '50': string;
        '60': string;
        '70': string;
        '80': string;
        '90': string;
      };
      grey: {
        '05': string;
        '10': string;
        '20': string;
        '30': string;
        '40': string;
        '50': string;
        '60': string;
        '70': string;
        '80': string;
        '90': string;
      };
      orange: {
        '05': string;
        '10': string;
        '20': string;
        '30': string;
        '40': string;
        '50': string;
        '60': string;
        '70': string;
        '80': string;
        '90': string;
      };
      red: {
        '05': string;
        '10': string;
        '20': string;
        '30': string;
        '40': string;
        '50': string;
        '60': string;
        '70': string;
        '80': string;
        '90': string;
      };
      yellow: {
        '05': string;
        '10': string;
        '20': string;
        '30': string;
        '40': string;
        '50': string;
        '60': string;
        '70': string;
        '80': string;
        '90': string;
      };
    };
  };
}

export const theme: Theme;
