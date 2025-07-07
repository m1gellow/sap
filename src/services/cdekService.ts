
import { type CalculateDeliveryParams, type CdekCity, type CdekDeliveryPoint, type CdekOrder } from './../types/cdek';

const CDEK_API_URL = 'https://iixstmihupsjzubekbpl.supabase.co/functions/v1/cdek-api';

export const checkCdekEnv = async () => {
  const response = await fetch(`${CDEK_API_URL}/env-check`);
  return await response.json();
};

export const calculateDelivery = async (params: CalculateDeliveryParams) => {
  const response = await fetch(`${CDEK_API_URL}/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return await response.json();
};

export const getCdekCities = async (params?: {
  country_codes?: string[];
  region_code?: number;
  fias_guid?: string;
  postal_code?: string;
  size?: number;
  page?: number;
  lang?: string;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v));
      } else if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
  }
  
  const response = await fetch(`${CDEK_API_URL}/cities?${queryParams.toString()}`);
  return await response.json() as CdekCity[];
};

export const getDeliveryPoints = async (params?: {
  postal_code?: string;
  city_code?: number;
  type?: string;
  country_code?: string;
  region_code?: number;
  have_cashless?: boolean;
  have_cash?: boolean;
  allowed_cod?: boolean;
  is_dressing_room?: boolean;
  weight_max?: number;
  weight_min?: number;
  size?: number;
  page?: number;
  lang?: string;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
  }
  
  const response = await fetch(`${CDEK_API_URL}/delivery-points?${queryParams.toString()}`);
  return await response.json() as CdekDeliveryPoint[];
};

export const createCdekOrder = async (orderData: CdekOrder) => {
  const response = await fetch(`${CDEK_API_URL}/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  return await response.json();
};