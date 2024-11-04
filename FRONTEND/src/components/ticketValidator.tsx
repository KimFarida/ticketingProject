import { useState } from 'react';
import { Search,  X} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '../api/axios';
import { ValidateTicketInfo} from '../types/types';

const TicketValidator = () => {
  const [ticketCode, setTicketCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [ticketData, setTicketData] = useState<ValidateTicketInfo | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketCode.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await api.get<ValidateTicketInfo>(`/api/ticket/check-ticket/${ticketCode.trim()}/`);
      console.log((response.data))
      const data = response.data;

      setTicketData(data);
      setShowDetails(true);
    } catch (err: any) {
      if (err.status === 410)
        setError('Invalid Ticket : Deleted Ticket Type')
      else{
        setError('Failed to validate ticket. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Ticket Validator</h2>
          <p className="text-gray-500">Enter ticket code to verify validity</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value)}
            placeholder="Enter ticket code"
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Checking...' : <Search className="h-4 w-4" />}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <AlertDialog open={showDetails} onOpenChange={setShowDetails}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader className="relative">
            {/* Title and Validity Status */}
            <div className="flex items-center justify-between space-x-2">
              <AlertDialogTitle className="text-lg font-semibold">Ticket Details</AlertDialogTitle>
              <span className={`px-2 py-1 rounded text-sm ${
                ticketData?.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {ticketData?.valid ? 'Valid' : 'Invalid'}
              </span>
            </div>

            {/* Close button positioned in the top right */}
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </AlertDialogHeader>

          {ticketData?.ticket_info && (
            <div className="space-y-4">
              <div className="grid gap-y-4">
                <div className="border-b pb-2">
                  <p className="text-sm font-medium text-gray-500">Ticket Code</p>
                  <p className="font-medium">{ticketData.ticket_info.ticket_code}</p>
                </div>

                <div className="border-b pb-2">
                  <p className="text-sm font-medium text-gray-500">Buyer Information</p>
                  <p className="font-medium">{ticketData.ticket_info.buyer_name}</p>
                  <p className="text-sm text-gray-600">{ticketData.ticket_info.buyer_contact}</p>
                </div>

                <div className="border-b pb-2">
                  <p className="text-sm font-medium text-gray-500">Ticket Type</p>
                  <p className="font-medium">{ticketData.ticket_info.ticket_type.name}</p>
                  <p className="text-sm text-gray-600">{ticketData.ticket_info.ticket_type.description}</p>
                </div>

                <div className="border-b pb-2">
                  <p className="text-sm font-medium text-gray-500">Agent Details</p>
                  <p className="font-medium">{ticketData.ticket_info.agent.name}</p>
                  <p className="text-sm text-gray-600">ID: {ticketData.ticket_info.agent.login_id}</p>
                </div>

                <div className="border-b pb-2">
                  <p className="text-sm font-medium text-gray-500">Validity Period</p>
                  <p className="font-medium">Until {formatDate(ticketData.ticket_info.valid_until)}</p>
                  <p className="text-sm text-gray-600">Created: {formatDate(ticketData.ticket_info.created_at)}</p>
                </div>
              </div>

              {!ticketData.valid && (
                <Alert variant="destructive">
                  <AlertDescription>{ticketData.message}</AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TicketValidator;
