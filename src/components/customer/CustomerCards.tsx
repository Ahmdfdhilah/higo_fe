'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Smartphone,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { CustomerResponseDto } from '@/services/customer';
import {
  getGenderColor,
  getDeviceBrandColor,
  getLocationTypeColor,
  getDeviceBrandLabel,
  getDigitalInterestLabel,
  getLocationTypeLabel,
  getGenderLabel
} from '@/lib/customerUtils';

interface CustomerCardsProps {
  customers: CustomerResponseDto[];
  isLoading?: boolean;
  onView?: (customer: CustomerResponseDto) => void;
  onEdit?: (customer: CustomerResponseDto) => void;
  onDelete?: (customer: CustomerResponseDto) => void;
}


const LoadingCard = () => (
  <Card className="w-full">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
      </div>
    </CardContent>
    <CardFooter className="pt-4">
      <div className="flex justify-between items-center w-full">
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
    </CardFooter>
  </Card>
);

export function CustomerCards({ 
  customers, 
  isLoading = false,
  onView,
  onEdit,
  onDelete 
}: CustomerCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <User className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No customers found
        </h3>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {customers.map((customer) => (
        <Card key={customer._id} className="w-full hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm">
                    {customer.userName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm leading-none">
                    {customer.userName}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    #{customer.number}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {onView && (
                    <DropdownMenuItem onClick={() => onView(customer)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View details
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(customer)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(customer)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center text-xs text-muted-foreground">
                <Mail className="mr-2 h-3 w-3" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Phone className="mr-2 h-3 w-3" />
                <span>{customer.phoneNumber}</span>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <div className="flex items-center text-xs">
                <MapPin className="mr-2 h-3 w-3" />
                <span className="truncate">{customer.locationName}</span>
              </div>
              <Badge 
                variant="secondary" 
                className={`text-xs ${getLocationTypeColor(customer.locationType)}`}
              >
                {getLocationTypeLabel(customer.locationType)}
              </Badge>
            </div>

            {/* Demographics & Device */}
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="secondary" 
                className={`text-xs ${getGenderColor(customer.gender)}`}
              >
                {getGenderLabel(customer.gender)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {customer.actualAge}y
              </Badge>
              <Badge 
                variant="secondary" 
                className={`text-xs ${getDeviceBrandColor(customer.deviceBrand)}`}
              >
                <Smartphone className="mr-1 h-3 w-3" />
                {getDeviceBrandLabel(customer.deviceBrand)}
              </Badge>
            </div>

            {/* Interest */}
            <div>
              <Badge variant="outline" className="text-xs">
                {getDigitalInterestLabel(customer.digitalInterest)}
              </Badge>
            </div>
          </CardContent>

          <CardFooter className="pt-4 border-t">
            <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" />
                {format(new Date(customer.date), 'MMM dd, yyyy')}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {customer.loginHour}
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}