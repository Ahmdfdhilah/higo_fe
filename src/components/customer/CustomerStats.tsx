'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  TrendingUp, 
  Smartphone,
  User,
  Calendar
} from 'lucide-react';
import { CustomerSummaryDto } from '@/services/customer';

interface CustomerStatsProps {
  summary: CustomerSummaryDto | null;
  isLoading?: boolean;
}

const LoadingCard = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="h-7 w-16 bg-gray-200 rounded animate-pulse mb-1" />
      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
    </CardContent>
  </Card>
);

export function CustomerStats({ summary, isLoading }: CustomerStatsProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <LoadingCard icon={Users} title="Total Customers" />
        <LoadingCard icon={MapPin} title="Unique Locations" />
        <LoadingCard icon={TrendingUp} title="Average Age" />
        <LoadingCard icon={Calendar} title="Date Range" />
      </div>
    );
  }

  const formatDateRange = () => {
    if (!summary.dateRange.earliest || !summary.dateRange.latest) {
      return 'No data';
    }
    
    const earliest = new Date(summary.dateRange.earliest);
    const latest = new Date(summary.dateRange.latest);
    
    return `${earliest.toLocaleDateString()} - ${latest.toLocaleDateString()}`;
  };

  const getTopGender = () => {
    const { male, female, other } = summary.genderDistribution;
    const max = Math.max(male, female, other || 0);
    if (max === male) return { label: 'Male', count: male };
    if (max === female) return { label: 'Female', count: female };
    return { label: 'Other', count: other || 0 };
  };

  const getTopDevice = () => {
    const devices = summary.deviceDistribution;
    const entries = Object.entries(devices);
    const max = entries.reduce((prev, current) => 
      prev[1] > current[1] ? prev : current
    );
    return { label: max[0], count: max[1] };
  };

  const getTopLocation = () => {
    const locations = summary.locationDistribution;
    const entries = Object.entries(locations);
    const max = entries.reduce((prev, current) => 
      prev[1] > current[1] ? prev : current
    );
    return { label: max[0], count: max[1] };
  };

  const getTopInterest = () => {
    const interests = summary.interestDistribution;
    const entries = Object.entries(interests);
    const max = entries.reduce((prev, current) => 
      prev[1] > current[1] ? prev : current
    );
    return { label: max[0], count: max[1] };
  };

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Registered customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.uniqueLocations}</div>
            <p className="text-xs text-muted-foreground">
              Different locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Age</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(summary.avgAge)} years</div>
            <p className="text-xs text-muted-foreground">
              Customer average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{formatDateRange()}</div>
            <p className="text-xs text-muted-foreground">
              Registration period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Top Gender
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{getTopGender().label}</Badge>
                <span className="text-sm font-medium">{getTopGender().count}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Male</span>
                  <span>{summary.genderDistribution.male}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Female</span>
                  <span>{summary.genderDistribution.female}</span>
                </div>
                {summary.genderDistribution.other && (
                  <div className="flex justify-between text-xs">
                    <span>Other</span>
                    <span>{summary.genderDistribution.other}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Top Device
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="capitalize">{getTopDevice().label}</Badge>
                <span className="text-sm font-medium">{getTopDevice().count}</span>
              </div>
              
              <div className="space-y-1">
                {Object.entries(summary.deviceDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([device, count]) => (
                    <div key={device} className="flex justify-between text-xs">
                      <span className="capitalize">{device}</span>
                      <span>{count}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Top Location Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="capitalize">{getTopLocation().label}</Badge>
                <span className="text-sm font-medium">{getTopLocation().count}</span>
              </div>
              
              <div className="space-y-1">
                {Object.entries(summary.locationDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .map(([location, count]) => (
                    <div key={location} className="flex justify-between text-xs">
                      <span className="capitalize">{location}</span>
                      <span>{count}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Interest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="capitalize">{getTopInterest().label}</Badge>
                <span className="text-sm font-medium">{getTopInterest().count}</span>
              </div>
              
              <div className="space-y-1">
                {Object.entries(summary.interestDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 3)
                  .map(([interest, count]) => (
                    <div key={interest} className="flex justify-between text-xs">
                      <span className="capitalize">{interest.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span>{count}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}