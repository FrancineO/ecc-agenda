import { redirect } from 'next/navigation';
import { MultiDayConferenceService } from '../../../services/MultiDayConferenceService';

// Generate static params for all regions
export async function generateStaticParams() {
  const regions = MultiDayConferenceService.getRegionsList();
  return regions.map((region) => ({
    region: region.key,
  }));
}

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

export default async function RegionPage({ params }: RegionPageProps) {
  const { region } = await params;
  
  // Get regions list
  const regions = MultiDayConferenceService.getRegionsList();
  
  // Validate region parameter
  const isValidRegion = regions.some(r => r.key === region);

  if (!isValidRegion) {
    redirect('/');
  }

  // Get the current conference day based on today's date
  const currentDay = MultiDayConferenceService.getCurrentConferenceDay();
  const allDays = MultiDayConferenceService.getAllDays(region);
  
  // If current day exists in the agenda, redirect to it
  if (currentDay && Object.keys(allDays).includes(currentDay)) {
    redirect(`/${region}/${currentDay}`);
  }
  
  // Fallback: redirect to the first available day
  const firstDay = Object.keys(allDays)[0];
  if (firstDay) {
    redirect(`/${region}/${firstDay}`);
  }

  // Final fallback redirect to home
  redirect('/');
}
