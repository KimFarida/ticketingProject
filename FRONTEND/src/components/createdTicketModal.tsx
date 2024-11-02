import React from 'react';
import { Clock, Mail, Tag, User, CreditCard, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {TicketCreationModalProps} from "@/types/types.ts";

const TicketCreationModal: React.FC<TicketCreationModalProps> = ({
  isOpen,
  onClose,
  ticketData
}) => {
  if (!ticketData) return null;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto"> {/* Add max-height and overflow */}
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Ticket Created Successfully</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              <CheckCircle className="inline-block w-4 h-4 mr-1" />
              Valid
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Success Message */}
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription>{ticketData.message}</AlertDescription>
          </Alert>

          {/* Ticket Details */}
          {ticketData.tickets.map((ticket) => (
            <div key={ticket.id} className="space-y-4">
              {/* Basic Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Ticket Code</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {ticket.ticket_code}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    {ticket.buyer_name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    {ticket.buyer_contact}
                  </div>
                </div>
              </div>

              {/* Ticket Type Info */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold">{ticketData.ticket_type_info.name}</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  {ticketData.ticket_type_info.description}
                </p>
              </div>

              {/* Validity Period */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold">Validity Period</span>
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  <p>Valid until: {formatDate(ticket.valid_until)}</p>
                  <p>Created at: {formatDate(ticket.created_at)}</p>
                </div>
              </div>

              {/* Agent Info */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold">Agent Information</span>
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  <p>Name: {ticketData.agent_info.name}</p>
                  <p>ID: {ticketData.agent_info.login_id}</p>
                </div>
              </div>

              {/* Cost Information */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold">Payment Details</span>
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  <p>Total Cost: {formatCurrency(ticketData.total_cost)}</p>
                  <p>Voucher Balance: {formatCurrency(ticketData.voucher_balance)}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => window.print()}
              type="button"
            >
              Print Ticket
            </Button>
            <Button
              onClick={onClose}
              type="button"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  );
};

export default TicketCreationModal;