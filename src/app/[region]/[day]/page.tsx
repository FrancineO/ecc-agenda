import { MultiDayConferenceService } from '../../../../services/MultiDayConferenceService';
import RegionDayClient from './RegionDayClient';

// Generate static params for all region/day combinations
export async function generateStaticParams() {
  const regions = MultiDayConferenceService.getRegionsList();
  const params = [];
  
  for (const region of regions) {
    const allDays = MultiDayConferenceService.getAllDays(region.key);
    const dayKeys = Object.keys(allDays);
    
    for (const day of dayKeys) {
      params.push({
        region: region.key,
        day: day
      });
    }
  }
  
  return params;
}

interface RegionDayPageProps {
  params: Promise<{ region: string; day: string }>;
}

export default async function RegionDayPage({ params }: RegionDayPageProps) {
  const { region, day } = await params;
  
  return <RegionDayClient region={region} day={day} />;
}
