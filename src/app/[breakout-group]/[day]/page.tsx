import { MultiDayConferenceService } from '../../../../services/MultiDayConferenceService';
import RegionDayClient from './RegionDayClient';

// Generate static params for all breakout-group/day combinations
export async function generateStaticParams() {
  const breakoutGroups = MultiDayConferenceService.getBreakoutGroupsList();
  const params = [];
  
  for (const breakoutGroup of breakoutGroups) {
    const allDays = MultiDayConferenceService.getAllDays(breakoutGroup.key);
    const dayKeys = Object.keys(allDays);
    
    for (const day of dayKeys) {
      params.push({
        'breakout-group': breakoutGroup.key,
        day: day
      });
    }
  }
  
  return params;
}

interface BreakoutGroupDayPageProps {
  params: Promise<{ 'breakout-group': string; day: string }>;
}

export default async function BreakoutGroupDayPage({ params }: BreakoutGroupDayPageProps) {
  const { 'breakout-group': breakoutGroup, day } = await params;
  
  return <RegionDayClient region={breakoutGroup} day={day} />;
}