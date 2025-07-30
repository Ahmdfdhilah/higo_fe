'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CustomerResponseDto,
  CreateCustomerDto,
  UpdateCustomerDto,
  customerService
} from '@/services/customer';
import {
  normalizeDeviceBrand,
  normalizeDigitalInterest,
  normalizeLocationType,
  normalizeGender
} from '@/lib/customerUtils';

const customerSchema = z.object({
  number: z.number().min(1, 'Customer number is required'),
  locationName: z.string().min(1, 'Location name is required'),
  date: z.string().min(1, 'Date is required'),
  loginHour: z.string().min(1, 'Login hour is required'),
  userName: z.string().min(1, 'User name is required'),
  birthYear: z.number().min(1900, 'Valid birth year is required').max(new Date().getFullYear(), 'Birth year cannot be in the future'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
  email: z.string().email('Valid email is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  deviceBrand: z.enum(['samsung', 'apple', 'huawei', 'xiaomi', 'oppo', 'vivo', 'other'], { required_error: 'Device brand is required' }),
  digitalInterest: z.enum(['socialMedia', 'gaming', 'shopping', 'news', 'entertainment', 'education', 'health', 'finance', 'travel', 'food', 'other'], { required_error: 'Digital interest is required' }),
  locationType: z.enum(['urban', 'suburban', 'rural'], { required_error: 'Location type is required' }),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
  customer?: CustomerResponseDto | null;
  onSuccess?: () => void;
}

const DEVICE_BRANDS = [
  { value: 'samsung', label: 'Samsung' },
  { value: 'apple', label: 'Apple' },
  { value: 'huawei', label: 'Huawei' },
  { value: 'xiaomi', label: 'Xiaomi' },
  { value: 'oppo', label: 'Oppo' },
  { value: 'vivo', label: 'Vivo' },
  { value: 'other', label: 'Other' },
];

const DIGITAL_INTERESTS = [
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

const LOCATION_TYPES = [
  { value: 'urban', label: 'Urban' },
  { value: 'suburban', label: 'Suburban' },
  { value: 'rural', label: 'Rural' },
];

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];


export function CustomerDialog({
  open,
  onOpenChange,
  mode,
  customer,
  onSuccess
}: CustomerDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      number: 0,
      locationName: '',
      date: '',
      loginHour: '',
      userName: '',
      birthYear: new Date().getFullYear() - 25,
      gender: 'male',
      email: '',
      phoneNumber: '',
      deviceBrand: 'samsung',
      digitalInterest: 'socialMedia',
      locationType: 'urban',
    },
  });

  // Reset form when dialog opens/closes or customer changes
  useEffect(() => {
    if (open) {
      if (customer && (mode === 'edit' || mode === 'view')) {
        const formData = {
          number: customer.number,
          locationName: customer.locationName,
          date: customer.date,
          loginHour: customer.loginHour,
          userName: customer.userName,
          birthYear: customer.birthYear,
          gender: normalizeGender(customer.gender),
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          deviceBrand: normalizeDeviceBrand(customer.deviceBrand),
          digitalInterest: normalizeDigitalInterest(customer.digitalInterest),
          locationType: normalizeLocationType(customer.locationType),
        };
        form.reset(formData);
        setSelectedDate(new Date(customer.date));
      } else if (mode === 'create') {
        const defaultData = {
          number: 0,
          locationName: '',
          date: '',
          loginHour: '',
          userName: '',
          birthYear: new Date().getFullYear() - 25,
          gender: 'male' as const,
          email: '',
          phoneNumber: '',
          deviceBrand: 'samsung' as const,
          digitalInterest: 'socialMedia' as const,
          locationType: 'urban' as const,
        };
        form.reset(defaultData);
        setSelectedDate(undefined);
      }
    }
  }, [open, customer, mode, form]);

  const onSubmit = async (data: CustomerFormData) => {
    if (mode === 'view') return;

    setIsLoading(true);
    try {
      if (mode === 'create') {
        const createData: CreateCustomerDto = {
          number: data.number,
          locationName: data.locationName,
          date: data.date,
          loginHour: data.loginHour,
          userName: data.userName,
          birthYear: data.birthYear,
          gender: data.gender,
          email: data.email,
          phoneNumber: data.phoneNumber,
          deviceBrand: data.deviceBrand,
          digitalInterest: data.digitalInterest,
          locationType: data.locationType,
        };
        
        const response = await customerService.createCustomer(createData);
        if (response.success) {
          onSuccess?.();
          onOpenChange(false);
        }
      } else if (mode === 'edit' && customer) {
        const updateData: UpdateCustomerDto = {
          locationName: data.locationName,
          date: data.date,
          loginHour: data.loginHour,
          userName: data.userName,
          birthYear: data.birthYear,
          gender: data.gender,
          email: data.email,
          phoneNumber: data.phoneNumber,
          deviceBrand: data.deviceBrand,
          digitalInterest: data.digitalInterest,
          locationType: data.locationType,
        };
        
        const response = await customerService.updateCustomer(customer._id, updateData);
        if (response.success) {
          onSuccess?.();
          onOpenChange(false);
        }
      }
    } catch (error) {
      console.error('Error saving customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'create': return 'Add New Customer';
      case 'edit': return 'Edit Customer';
      case 'view': return 'Customer Details';
      default: return 'Customer';
    }
  };

  const getDialogDescription = () => {
    switch (mode) {
      case 'create': return 'Fill in the customer information below.';
      case 'edit': return 'Update the customer information below.';
      case 'view': return 'View customer information.';
      default: return '';
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Number */}
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* User Name */}
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth Year */}
              <FormField
                control={form.control}
                name="birthYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || new Date().getFullYear())}
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GENDERS.map((gender) => (
                          <SelectItem key={gender.value} value={gender.value}>
                            {gender.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Name */}
              <FormField
                control={form.control}
                name="locationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Type */}
              <FormField
                control={form.control}
                name="locationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LOCATION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Device Brand */}
              <FormField
                control={form.control}
                name="deviceBrand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Brand</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select device brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEVICE_BRANDS.map((brand) => (
                          <SelectItem key={brand.value} value={brand.value}>
                            {brand.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Digital Interest */}
              <FormField
                control={form.control}
                name="digitalInterest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Digital Interest</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select digital interest" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DIGITAL_INTERESTS.map((interest) => (
                          <SelectItem key={interest.value} value={interest.value}>
                            {interest.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isReadOnly}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Login Hour */}
              <FormField
                control={form.control}
                name="loginHour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Login Hour</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., 14:30"
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {mode === 'view' ? 'Close' : 'Cancel'}
              </Button>
              {mode !== 'view' && (
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {mode === 'create' ? 'Create Customer' : 'Update Customer'}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}