import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: keyof typeof theme.colors;
  weight?: keyof typeof theme.typography.weights;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'text',
  weight = 'regular',
  align = 'left',
  style,
  children,
  ...props
}) => {
  const getFontSize = () => {
    switch (variant) {
      case 'h1': return theme.typography.sizes.xxxl;
      case 'h2': return theme.typography.sizes.xxl;
      case 'h3': return theme.typography.sizes.xl;
      case 'label': return theme.typography.sizes.sm;
      case 'caption': return theme.typography.sizes.xs;
      case 'body':
      default:
        return theme.typography.sizes.md;
    }
  };

  return (
    <Text
      style={[
        {
          fontSize: getFontSize(),
          color: theme.colors[color],
          fontWeight: theme.typography.weights[weight],
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
