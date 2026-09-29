import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect, Path, G } from 'react-native-svg';

export const BoardCenterBg: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  // A sunburst effect with SVG
  // 12 rays radiating from the center
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.max(width, height);

  const numRays = 16;
  const angleStep = (Math.PI * 2) / numRays;

  const rays = Array.from({ length: numRays / 2 }).map((_, i) => {
    // Draw every other slice
    const angle1 = (i * 2) * angleStep;
    const angle2 = (i * 2 + 1) * angleStep;

    const x1 = cx + radius * Math.cos(angle1);
    const y1 = cy + radius * Math.sin(angle1);
    const x2 = cx + radius * Math.cos(angle2);
    const y2 = cy + radius * Math.sin(angle2);

    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%">
        <Defs>
          <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor="#84E12A" stopOpacity="1" />
            <Stop offset="100%" stopColor="#4A9A0F" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        {/* Base Gradient */}
        <Rect width="100%" height="100%" fill="url(#grad)" />
        
        {/* Sunburst Rays */}
        <G fill="#95F532" opacity="0.15">
          {rays.map((d, index) => (
            <Path key={index} d={d} />
          ))}
        </G>
      </Svg>
    </View>
  );
};
