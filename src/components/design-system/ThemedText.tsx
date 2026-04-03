import React from 'react';
import { Text } from 'ink';

export function ThemedText({ children, ...props }: any) {
  return <Text {...props}>{children}</Text>;
}
