import api from "./axios";
import {FetchedVoucher} from "../types/types.ts";
import {Merchant} from "../types/types.ts";
import { AxiosError } from 'axios';

interface ApiError {
    detail?: string;
    message?: string;
}

export const voucherApi = {
    fetchMerchants: async () => {
        try{
            const response = await api.get<Merchant[]>("/api/admin/merchants/");
            return response.data
        }
        catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            console.error('Fetch merchants error:', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                config: axiosError.config
            });
            throw error;
        }


    },

    fetchUserRole: async () => {
        try{
            const response = await api.get("/api/account/get-user/");
            return response.data.role;
        }
        catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            console.error('Fetch user role error:', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                config: axiosError.config
            });
            throw error;
        }

    },

    fetchSoldVouchers: async () => {
        try{
            const userRole = localStorage.getItem('userRole');
            console.log('Current user role:', userRole);

            const response = await api.get<FetchedVoucher[]>("/api/voucher/sold_vouchers/");
            return response.data;
        }
        catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            console.error('Fetch sold vouchers error:', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                config: axiosError.config,
                userRole: localStorage.getItem('userRole')
            });
            throw error;
        }

    },

    fetchBoughtVouchers: async () => {
        try{
            const userRole = localStorage.getItem('userRole');
            console.log('Current user role:', userRole)

            const response = await api.get<FetchedVoucher[]>("/api/voucher/bought_vouchers/");
            return response.data;
        }
        catch (error)
        {
            const axiosError = error as AxiosError<ApiError>;
            console.error('Fetch bought vouchers error:', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                config: axiosError.config,
                userRole: localStorage.getItem('userRole')
            });
            throw error;
        }
    },


    createVoucher: async (voucherData: { amount: string; seller: string }) => {
        const response = await api.post("/api/voucher/create_voucher/", voucherData);
        return response;
    },

    processVoucher: async (voucherCode: string) => {
        const response = await api.post("/api/voucher/process_voucher/", {
            voucher_code: voucherCode,
        });
        return response;
    },

    getVoucherDetails: async (voucherCode: string) => {
        try{
           const response = await api.get(`/api/voucher/get_voucher/?voucher_code=${voucherCode}`);
           return response.data;
        }
        catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            console.error('Search voucher error:', {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                voucherCode
            });
            throw error;
        }
    }

};
