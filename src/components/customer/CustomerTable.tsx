'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { CustomerResponseDto } from '@/services/customer';

interface CustomerTableProps {
  customers: CustomerResponseDto[];
  isLoading?: boolean;
  onView?: (customer: CustomerResponseDto) => void;
  onEdit?: (customer: CustomerResponseDto) => void;
  onDelete?: (customer: CustomerResponseDto) => void;
}

const getGenderColor = (gender: string) => {
  switch (gender) {
    case 'male': return 'bg-blue-100 text-blue-800';
    case 'female': return 'bg-pink-100 text-pink-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getDeviceBrandColor = (device: string) => {
  switch (device) {
    case 'samsung': return 'bg-blue-100 text-blue-800';
    case 'apple': return 'bg-gray-100 text-gray-800';
    case 'huawei': return 'bg-red-100 text-red-800';
    case 'xiaomi': return 'bg-orange-100 text-orange-800';
    case 'oppo': return 'bg-green-100 text-green-800';
    case 'vivo': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getLocationTypeColor = (locationType: string) => {
  switch (locationType) {
    case 'urban': return 'bg-green-100 text-green-800';
    case 'suburban': return 'bg-yellow-100 text-yellow-800';
    case 'rural': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function CustomerTable({ 
  customers, 
  isLoading = false,
  onView,
  onEdit,
  onDelete 
}: CustomerTableProps) {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Demographics</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Demographics</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Demographics</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Interest</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {customer.number}
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {customer.userName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.userName}</div>
                      <div className="text-xs text-muted-foreground">
                        ID: {customer._id.toString().slice(-6)}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Mail className="mr-1 h-3 w-3" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Phone className="mr-1 h-3 w-3" />
                      {customer.phoneNumber}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <MapPin className="mr-1 h-3 w-3" />
                      {customer.locationName}
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getLocationTypeColor(customer.locationType)}`}
                    >
                      {customer.locationType}
                    </Badge>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getGenderColor(customer.gender)}`}
                    >
                      {customer.gender}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {customer.actualAge} years
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getDeviceBrandColor(customer.deviceBrand)}`}
                  >
                    {customer.deviceBrand}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {customer.digitalInterest}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="text-sm">
                    {format(new Date(customer.date), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {customer.loginHour}
                  </div>
                </TableCell>

                <TableCell>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}