export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    role?: string;
    login_id: string;
}

export interface Merchant {
    id: string;
    user: User;
}

export interface UserDetails extends User {
    gender: string;
}

export interface FetchedVoucher {
    id: string;
    voucher_code: string;
    amount: string;
    created_at: string;
    processed: boolean;
    owner: UserDetails;
}

export interface VoucherDetail extends FetchedVoucher {
    updated_at: string;
    seller?: UserDetails;
}

export interface CreatedVoucher extends FetchedVoucher {
    seller: User;
    updated_at: string;
}

export interface TicketType{
    id: string;
    name: string;
    unit_price?: string;
    description: string;
    expiration_date?: string;
}

export interface Agent {
    name: string;
    login_id: string;
}

export interface Ticket {
    id: string;
    ticket_code: string;
    buyer_name: string;
    buyer_contact: string;
    ticket_type: TicketType;
    agent: Agent;
    valid_until: string;
    created_at: string;
    updated_at: string;
    valid: boolean;
}

export interface CreateTicketFormData {
    buyer_name: string;
    buyer_contact: string;
    quantity: number;
    ticket_type: string;
}

export interface TicketTypeFormData {
    name: string;
    unit_price: string;
    description: string;
    expiration_date: string;
    date: string;
    time: string;
}

export interface TicketInfo {
    ticket_code: string;
    buyer_name: string;
    buyer_contact: string;
    ticket_type: TicketType;
    agent: Agent;
    valid_until: string;
    created_at: string;
    updated_at: string;
}

export interface ValidateTicketInfo {
    message: string
    valid : boolean,
    ticket_info: TicketInfo
}

export interface TicketCreationResponse {
  message: string;
  tickets: Ticket[];
  total_cost: number;
  voucher_balance: number;
  ticket_type_info: {
    name: string;
    description: string;
  };
  agent_info: {
    login_id: string;
    name: string;
  };
}


export interface TicketCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketData: TicketCreationResponse | null;
}

export interface PayoutDetails{
    amount: string;
    requested_at: string;
    status:string;
    payment_id:string;
    user: User;

}
export interface PayoutResponse {
    message: string;
    data: PayoutDetails;
}

export interface PayoutList {
  amount: string;
  requested_at: string;
  status: string;
  payment_id: string;
  user: {
    role: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
  };
}

