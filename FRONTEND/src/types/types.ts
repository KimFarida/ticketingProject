export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
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
