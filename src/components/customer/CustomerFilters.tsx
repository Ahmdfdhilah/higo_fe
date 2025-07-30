'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  X, 
  Search,
  Calendar,
  MapPin,
  User,
  Smartphone,
  Heart
} from 'lucide-react';
import { CustomerFilters as CustomerFiltersType } from '@/services/customer';

interface CustomerFiltersProps {
  filters: CustomerFiltersType;
  onFiltersChange: (filters: CustomerFiltersType) => void;
  onSearch: (search: string) => void;
  searchQuery: string;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const locationTypeOptions = [
  { value: 'urban', label: 'Urban' },
  { value: 'suburban', label: 'Suburban' },
  { value: 'rural', label: 'Rural' },
];

const deviceBrandOptions = [
  { value: 'samsung', label: 'Samsung' },
  { value: 'apple', label: 'Apple' },
  { value: 'huawei', label: 'Huawei' },
  { value: 'xiaomi', label: 'Xiaomi' },
  { value: 'oppo', label: 'Oppo' },
  { value: 'vivo', label: 'Vivo' },
  { value: 'other', label: 'Other' },
];

const digitalInterestOptions = [
  { value: 'socialMedia', label: 'Social Media' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'news', label: 'News' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'education', label: 'Education' },
  { value: 'health', label: 'Health' },
  { value: 'finance', label: 'Finance' },
  { value: 'travel', label: 'Travel' },
  { value: 'food', label: 'Food' },
  { value: 'other', label: 'Other' },
];

export function CustomerFilters({
  filters,
  onFiltersChange,
  onSearch,
  searchQuery
}: CustomerFiltersProps) {
  const [localFilters, setLocalFilters] = useState<CustomerFiltersType>(filters);
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof CustomerFiltersType, value: any) => {
    const newFilters = { ...localFilters };
    if (value === '' || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    setIsOpen(false);
  };

  const removeFilter = (key: keyof CustomerFiltersType) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).length;
  };

  const getFilterLabel = (key: keyof CustomerFiltersType, value: any) => {
    switch (key) {
      case 'gender':
        return genderOptions.find(opt => opt.value === value)?.label || value;
      case 'locationType':
        return locationTypeOptions.find(opt => opt.value === value)?.label || value;
      case 'deviceBrand':
        return deviceBrandOptions.find(opt => opt.value === value)?.label || value;
      case 'digitalInterest':
        return digitalInterestOptions.find(opt => opt.value === value)?.label || value;
      case 'minAge':
        return `Min Age: ${value}`;
      case 'maxAge':
        return `Max Age: ${value}`;
      case 'locationName':
        return `Location: ${value}`;
      case 'startDate':
        return `From: ${value}`;
      case 'endDate':
        return `To: ${value}`;
      default:
        return value;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {/* Filter Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Filter Customers</SheetTitle>
              <SheetDescription>
                Apply filters to narrow down your customer list.
              </SheetDescription>
            </SheetHeader>
            
            <div className="grid gap-6 py-6">
              {/* Demographics */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <Label className="text-sm font-semibold">Demographics</Label>
                </div>
                
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="gender" className="text-sm">Gender</Label>
                    <Select
                      value={localFilters.gender || ''}
                      onValueChange={(value) => updateFilter('gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="minAge" className="text-sm">Min Age</Label>
                      <Input
                        id="minAge"
                        type="number"
                        placeholder="Min"
                        value={localFilters.minAge || ''}
                        onChange={(e) => updateFilter('minAge', parseInt(e.target.value) || undefined)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxAge" className="text-sm">Max Age</Label>
                      <Input
                        id="maxAge"
                        type="number"
                        placeholder="Max"
                        value={localFilters.maxAge || ''}
                        onChange={(e) => updateFilter('maxAge', parseInt(e.target.value) || undefined)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <Label className="text-sm font-semibold">Location</Label>
                </div>
                
                <div className="grid gap-3">
                  <div>
                    <Label htmlFor="locationName" className="text-sm">Location Name</Label>
                    <Input
                      id="locationName"
                      placeholder="Enter location name"
                      value={localFilters.locationName || ''}
                      onChange={(e) => updateFilter('locationName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="locationType" className="text-sm">Location Type</Label>
                    <Select
                      value={localFilters.locationType || ''}
                      onValueChange={(value) => updateFilter('locationType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location type" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Device */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <Label className="text-sm font-semibold">Device</Label>
                </div>
                
                <div>
                  <Label htmlFor="deviceBrand" className="text-sm">Device Brand</Label>
                  <Select
                    value={localFilters.deviceBrand || ''}
                    onValueChange={(value) => updateFilter('deviceBrand', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select device brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceBrandOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Interest */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <Label className="text-sm font-semibold">Interest</Label>
                </div>
                
                <div>
                  <Label htmlFor="digitalInterest" className="text-sm">Digital Interest</Label>
                  <Select
                    value={localFilters.digitalInterest || ''}
                    onValueChange={(value) => updateFilter('digitalInterest', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select digital interest" />
                    </SelectTrigger>
                    <SelectContent>
                      {digitalInterestOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <Label className="text-sm font-semibold">Date Range</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="startDate" className="text-sm">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={localFilters.startDate || ''}
                      onChange={(e) => updateFilter('startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="text-sm">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={localFilters.endDate || ''}
                      onChange={(e) => updateFilter('endDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={applyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => (
            <Badge key={key} variant="secondary" className="gap-1">
              {getFilterLabel(key as keyof CustomerFiltersType, value)}
              <button
                onClick={() => removeFilter(key as keyof CustomerFiltersType)}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}