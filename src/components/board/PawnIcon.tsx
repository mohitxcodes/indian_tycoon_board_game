import React from 'react';
import Svg, { Defs, RadialGradient, Stop, Path, Ellipse, Circle } from 'react-native-svg';

interface PawnIconProps {
  color: string;
  size?: number;
}

export const PawnIcon: React.FC<PawnIconProps> = ({ color, size = 40 }) => {
  return (
    <Svg width={size} height={size * 1.5} viewBox="0 0 100 150">
      <Defs>
        {/* Main 3D plastic material gradient */}
        <RadialGradient id="bodyGrad" cx="35%" cy="30%" rx="60%" ry="60%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <Stop offset="20%" stopColor={color} stopOpacity="0.9" />
          <Stop offset="100%" stopColor={color} stopOpacity="1" />
        </RadialGradient>

        {/* Darker gradient for the base to give depth */}
        <RadialGradient id="baseGrad" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0%" stopColor={color} stopOpacity="1" />
          <Stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </RadialGradient>
      </Defs>

      {/* Shadow under the pawn */}
      <Ellipse cx="50" cy="140" rx="30" ry="8" fill="rgba(0,0,0,0.4)" />

      {/* The base of the map pin / pawn */}
      <Ellipse cx="50" cy="130" rx="25" ry="10" fill="url(#baseGrad)" />
      <Ellipse cx="50" cy="126" rx="25" ry="10" fill="url(#bodyGrad)" />

      {/* The neck / cone */}
      <Path
        d="M 35 126 C 45 80 42 60 42 50 L 58 50 C 58 60 55 80 65 126 Z"
        fill="url(#bodyGrad)"
      />

      {/* The collar */}
      <Ellipse cx="50" cy="55" rx="16" ry="6" fill="url(#baseGrad)" />
      <Ellipse cx="50" cy="53" rx="16" ry="6" fill="url(#bodyGrad)" />

      {/* The spherical head */}
      <Circle cx="50" cy="35" r="24" fill="url(#bodyGrad)" />
      
      {/* Glossy highlight on the head */}
      <Circle cx="42" cy="25" r="8" fill="#FFFFFF" opacity="0.6" />
    </Svg>
  );
};
