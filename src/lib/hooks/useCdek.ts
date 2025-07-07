// src/hooks/useCdek.ts
import { useState } from 'react';
import * as cdekService from '../../services/cdekService';
import { type CalculateDeliveryParams, type CdekCity, type CdekDeliveryPoint, type CdekOrder } from '../../types/cdek';

export const useCdek = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDelivery = async (params: CalculateDeliveryParams) => {
    setLoading(true);
    setError(null);
    try {
      return await cdekService.calculateDelivery(params);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCities = async (params?: {
    country_codes?: string[];
    region_code?: number;
    fias_guid?: string;
    postal_code?: string;
    size?: number;
    page?: number;
    lang?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      return await cdekService.getCdekCities(params);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryPoints = async (params?: {
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
    setLoading(true);
    setError(null);
    try {
      return await cdekService.getDeliveryPoints(params);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: CdekOrder) => {
    setLoading(true);
    setError(null);
    try {
      return await cdekService.createCdekOrder(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    calculateDelivery,
    getCities,
    getDeliveryPoints,
    createOrder,
  };
};