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

  // Get the first day of this region and redirect
  const allDays = MultiDayConferenceService.getAllDays(region);
  const firstDay = Object.keys(allDays)[0];

  if (firstDay) {
    redirect(`/${region}/${firstDay}`);
  }

  // Fallback redirect to home
  redirect('/');
}
