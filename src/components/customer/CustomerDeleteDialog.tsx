'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { CustomerResponseDto, customerService } from '@/services/customer';

interface CustomerDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: CustomerResponseDto | null;
  onSuccess?: () => void;
}

export function CustomerDeleteDialog({
  open,
  onOpenChange,
  customer,
  onSuccess
}: CustomerDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!customer) return;

    setIsLoading(true);
    try {
      const response = await customerService.deleteCustomer(customer._id);
      if (response.success) {
        onSuccess?.();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Customer
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{customer?.userName}</strong>?
            <br />
            <span className="text-sm text-muted-foreground">
              Customer ID: {customer?._id.toString().slice(-6)}
            </span>
            <br />
            <br />
            This action cannot be undone. The customer and all associated data will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Customer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}