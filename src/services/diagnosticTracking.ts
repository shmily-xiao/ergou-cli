export const diagnosticTracker = {
  trackError: (error: Error) => console.error('[Diagnostic]', error),
  trackEvent: (event: string, data?: any) => {},
  trackToolUse: (tool: string, duration?: number) => {},
};
