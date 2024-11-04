import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { Ticket} from '../types/types';

interface TicketFilterProps {
  tickets: Ticket[];
  onFilteredTicketsChange: (filteredTickets: Ticket[]) => void;
}

const TicketFilter:React.FC<TicketFilterProps>  = ({ tickets, onFilteredTicketsChange }) => {
  const [dateFilter, setDateFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTicketType, setSelectedTicketType] = useState('all');

  // Get unique ticket types
  const ticketTypes = useMemo(() => {
    const types = new Set(tickets.map(ticket => ticket.ticket_type.name));
    return ['all', ...Array.from(types)];
  }, [tickets]);

  // Filter tickets based on selected criteria
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const ticketDate = new Date(ticket.created_at);
      const today = new Date();
      const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));

      // Date filtering
      let passesDateFilter = true;
      if (dateFilter === 'today') {
        passesDateFilter = ticketDate.toDateString() === new Date().toDateString();
      } else if (dateFilter === 'week') {
        passesDateFilter = ticketDate >= currentWeekStart;
      } else if (dateFilter === 'custom' && startDate && endDate) {
        passesDateFilter = ticketDate >= new Date(startDate) &&
                          ticketDate <= new Date(endDate);
      }

      // Ticket type filtering
      const passesTypeFilter = selectedTicketType === 'all' ||
                              ticket.ticket_type.name === selectedTicketType;

      return passesDateFilter && passesTypeFilter;
    });
  }, [tickets, dateFilter, startDate, endDate, selectedTicketType]);

  // Update parent component when filters change
  React.useEffect(() => {
    onFilteredTicketsChange(filteredTickets);
  }, [filteredTickets, onFilteredTicketsChange]);

  return (
    <Card className="p-4 mb-4 space-y-4">
      <div className="flex flex-wrap gap-4">
        {/* Date Filter */}
        <div className="flex-1 min-w-[200px]">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Range */}
        {dateFilter === 'custom' && (
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border rounded"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border rounded"
            />
          </div>
        )}

        {/* Ticket Type Filter */}
        <div className="flex-1 min-w-[200px]">
          <Select value={selectedTicketType} onValueChange={setSelectedTicketType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by ticket type" />
            </SelectTrigger>
            <SelectContent>
              {ticketTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

export default TicketFilter;