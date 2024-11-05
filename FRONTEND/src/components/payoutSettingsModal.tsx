import React, { useState } from 'react';
import { Settings, DollarSign, Percent, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface PayoutSettings {
  monthly_quota: number;
  full_salary: number;
  partial_salary_percentage: number;
}

interface PayoutSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (settings: PayoutSettings) => Promise<void>;
  currentSettings?: PayoutSettings;
}

const PayoutSettingsModal: React.FC<PayoutSettingsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentSettings
}) => {
  const [settings, setSettings] = useState<PayoutSettings>(currentSettings || {
    monthly_quota: 0,
    full_salary: 0,
    partial_salary_percentage: 0
  });
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(settings);
      setMessage('Settings updated successfully!');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Update Payout Settings
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {/* Monthly Quota */}
            <div className="space-y-2">
              <Label htmlFor="monthly_quota" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Monthly Quota
              </Label>
              <Input
                id="monthly_quota"
                type="number"
                value={settings.monthly_quota}
                onChange={(e) => setSettings({
                  ...settings,
                  monthly_quota: parseInt(e.target.value)
                })}
                min="0"
                required
                className="w-full"
              />
            </div>

            {/* Full Salary */}
            <div className="space-y-2">
              <Label htmlFor="full_salary" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Full Salary Amount
              </Label>
              <Input
                id="full_salary"
                type="number"
                value={settings.full_salary}
                onChange={(e) => setSettings({
                  ...settings,
                  full_salary: parseFloat(e.target.value)
                })}
                min="0"
                step="0.01"
                required
                className="w-full"
              />
            </div>

            {/* Partial Salary Percentage */}
            <div className="space-y-2">
              <Label htmlFor="partial_salary_percentage" className="flex items-center gap-2">
                <Percent className="w-4 h-4" />
                Partial Salary Percentage
              </Label>
              <Input
                id="partial_salary_percentage"
                type="number"
                value={settings.partial_salary_percentage}
                onChange={(e) => setSettings({
                  ...settings,
                  partial_salary_percentage: parseFloat(e.target.value)
                })}
                min="0"
                max="100"
                step="0.1"
                required
                className="w-full"
              />
            </div>
          </div>

          {/* Current Settings Summary */}
          {currentSettings && (
            <Card className="p-4 bg-gray-50">
              <h3 className="font-medium mb-2">Current Settings</h3>
              <div className="text-sm space-y-1 text-gray-600">
                <p>Monthly Quota: {currentSettings.monthly_quota}</p>
                <p>Full Salary: {formatCurrency(currentSettings.full_salary)}</p>
                <p>Partial Salary: {currentSettings.partial_salary_percentage}%</p>
              </div>
            </Card>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-black hover:bg-gray-800"
            >
              {isSubmitting ? 'Updating...' : 'Update Settings'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PayoutSettingsModal;