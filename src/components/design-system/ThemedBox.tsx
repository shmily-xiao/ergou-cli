import React from 'react';
import { Box } from 'ink';

export function ThemedBox({ children, ...props }: any) {
  return <Box {...props}>{children}</Box>;
}
