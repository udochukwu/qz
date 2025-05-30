import React from 'react';
import { motion } from 'framer-motion';
import { Loader2Icon } from 'lucide-react';

interface SpinningIconProps {
  height?: number;
  width?: number;
  color?: string;
}

export const SpinningIcon = ({ height = 24, width = 24, color }: SpinningIconProps) => {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{
        ease: 'linear',
        duration: 1,
        repeat: Infinity,
      }}
      style={{ display: 'inline-block' }}>
      <Loader2Icon height={height} width={width} color={color} />
    </motion.span>
  );
};
