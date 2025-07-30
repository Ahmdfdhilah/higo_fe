// Utility functions for customer data normalization and display

// Type definitions
type DeviceBrand = 'samsung' | 'apple' | 'huawei' | 'xiaomi' | 'oppo' | 'vivo' | 'other';
type DigitalInterest = 'socialMedia' | 'gaming' | 'shopping' | 'news' | 'entertainment' | 'education' | 'health' | 'finance' | 'travel' | 'food' | 'other';
type LocationType = 'urban' | 'suburban' | 'rural';
type Gender = 'male' | 'female' | 'other';

// Helper functions to normalize backend values to frontend values
export const normalizeDeviceBrand = (brand: string): DeviceBrand => {
  const normalized = brand.toLowerCase();
  switch (normalized) {
    case 'samsung':
    case 'apple':
    case 'huawei':
    case 'xiaomi':
    case 'oppo':
    case 'vivo':
      return normalized;
    default:
      return 'other';
  }
};

export const normalizeDigitalInterest = (interest: string): DigitalInterest => {
  const normalized = interest.toLowerCase();
  switch (normalized) {
    case 'social media':
    case 'socialmedia':
      return 'socialMedia';
    case 'gaming':
    case 'shopping':
    case 'news':
    case 'entertainment':
    case 'education':
    case 'health':
    case 'finance':
    case 'travel':
    case 'food':
      return normalized as DigitalInterest;
    default:
      return 'other';
  }
};

export const normalizeLocationType = (type: string): LocationType => {
  const normalized = type.toLowerCase().replace(/[-\s]/g, '');
  switch (normalized) {
    case 'urban':
      return 'urban';
    case 'suburban':
    case 'suburan':
      return 'suburban';
    case 'rural':
      return 'rural';
    default:
      return 'urban';
  }
};

export const normalizeGender = (gender: string): Gender => {
  const normalized = gender.toLowerCase();
  switch (normalized) {
    case 'male':
    case 'female':
      return normalized;
    default:
      return 'other';
  }
};

// Helper functions to get display labels
export const getDeviceBrandLabel = (brand: string): string => {
  const normalized = normalizeDeviceBrand(brand);
  const labels: Record<string, string> = {
    samsung: 'Samsung',
    apple: 'Apple',
    huawei: 'Huawei',
    xiaomi: 'Xiaomi',
    oppo: 'Oppo',
    vivo: 'Vivo',
    other: 'Other'
  };
  return labels[normalized] || 'Other';
};

export const getDigitalInterestLabel = (interest: string): string => {
  const normalized = normalizeDigitalInterest(interest);
  const labels: Record<string, string> = {
    socialMedia: 'Social Media',
    gaming: 'Gaming',
    shopping: 'Shopping',
    news: 'News',
    entertainment: 'Entertainment',
    education: 'Education',
    health: 'Health',
    finance: 'Finance',
    travel: 'Travel',
    food: 'Food',
    other: 'Other'
  };
  return labels[normalized] || 'Other';
};

export const getLocationTypeLabel = (type: string): string => {
  const normalized = normalizeLocationType(type);
  const labels: Record<string, string> = {
    urban: 'Urban',
    suburban: 'Suburban',
    rural: 'Rural'
  };
  return labels[normalized] || 'Urban';
};

export const getGenderLabel = (gender: string): string => {
  const normalized = normalizeGender(gender);
  const labels: Record<string, string> = {
    male: 'Male',
    female: 'Female',
    other: 'Other'
  };
  return labels[normalized] || 'Other';
};

// Color helper functions (moved from components)
export const getGenderColor = (gender: string): string => {
  const normalized = normalizeGender(gender);
  switch (normalized) {
    case 'male': return 'bg-blue-100 text-blue-800';
    case 'female': return 'bg-pink-100 text-pink-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getDeviceBrandColor = (device: string): string => {
  const normalized = normalizeDeviceBrand(device);
  switch (normalized) {
    case 'samsung': return 'bg-blue-100 text-blue-800';
    case 'apple': return 'bg-gray-100 text-gray-800';
    case 'huawei': return 'bg-red-100 text-red-800';
    case 'xiaomi': return 'bg-orange-100 text-orange-800';
    case 'oppo': return 'bg-green-100 text-green-800';
    case 'vivo': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getLocationTypeColor = (locationType: string): string => {
  const normalized = normalizeLocationType(locationType);
  switch (normalized) {
    case 'urban': return 'bg-green-100 text-green-800';
    case 'suburban': return 'bg-yellow-100 text-yellow-800';
    case 'rural': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};