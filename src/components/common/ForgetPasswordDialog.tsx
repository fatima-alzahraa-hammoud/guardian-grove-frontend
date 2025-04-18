// src/components/ForgotPasswordDialog.tsx
'use client';

import React, { useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { requestApi } from "../../libs/requestApi";
import { requestMethods } from "../../libs/enum/requestMethods";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from "../../components/ui/button";
import { Loader2 } from "lucide-react";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({ open, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      const response = await requestApi({
        route: "/auth/forgot-password",
        method: requestMethods.POST,
        // No body needed since backend will get email from auth token/session
      });

      if (response && response.message) {
        toast.success(response.message);
        onOpenChange(false);
      } else {
        toast.error(response?.message || 'Failed to send reset email');
      }
    } catch (error) {
      toast.error('An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-comic">Reset Password</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600">
            We'll send a password reset link to your registered email address.
          </p>
        </div>

        <DialogFooter>
          <Button 
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleSendEmail}
            disabled={isLoading}
            className="bg-[#3A8EBA] hover:bg-[#326E9F] text-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : 'Send Email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;