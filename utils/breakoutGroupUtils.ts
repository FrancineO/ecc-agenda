// Utility functions for breakout group display names
// This can be used on both client and server side

export function getBreakoutGroupDisplayName(breakoutGroup: string): string {
  switch (breakoutGroup) {
    case 'delivery-circle-1': return 'Slavia';
    case 'delivery-circle-2': return 'Sparta';
    case 'delivery-circle-3': return 'Viktoria';
    case 'management': return 'Management';
    default: return breakoutGroup; // fallback to original if unknown
  }
}

export function getBreakoutGroupRoute(teamName: string): string {
  const teamNameLower = teamName.toLowerCase();
  switch (teamNameLower) {
    case 'slavia': return 'delivery-circle-1';
    case 'sparta': return 'delivery-circle-2';
    case 'viktoria': return 'delivery-circle-3';
    case 'ajax': return 'delivery-circle-3'; // legacy support
    case 'management': return 'management';
    default: return 'management'; // fallback
  }
}