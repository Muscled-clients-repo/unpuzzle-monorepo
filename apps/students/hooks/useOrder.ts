import { useState, useEffect, useCallback } from 'react';
import { useBaseApi } from './useBaseApi';
import { Order, OrderItem, OrderResponse, OrderListResponse } from '@/types/order.types';

export const useOrder = (orderId?: string) => {
  const api = useBaseApi();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch single order by ID
  const fetchOrder = useCallback(async (id?: string) => {
    const orderIdToFetch = id || orderId;
    if (!orderIdToFetch) {
      setError('No order ID provided');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<OrderResponse>(`/orders/${orderIdToFetch}`);
      
      if (response.success && response.data) {
        const orderData = response.data.data || response.data;
        setOrder(orderData);
        return orderData;
      } else {
        setError(response.error || 'Failed to fetch order');
        return null;
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to fetch order');
      return null;
    } finally {
      setLoading(false);
    }
  }, [api, orderId]);

  // Refetch order (force refresh)
  const refetch = useCallback(() => {
    return fetchOrder();
  }, [fetchOrder]);

  // Auto-fetch on mount if orderId is provided
  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, fetchOrder]);

  return {
    order,
    loading,
    error,
    fetchOrder,
    refetch,
  };
};

// Hook for fetching user's orders
export const useOrders = () => {
  const api = useBaseApi();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (params?: { 
    status?: string; 
    page?: number; 
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<OrderListResponse>('/orders', { params });
      
      if (response.success && response.data) {
        const ordersData = response.data.data || [];
        setOrders(ordersData);
        return ordersData;
      } else {
        setError(response.error || 'Failed to fetch orders');
        return [];
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
      return [];
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Create a new order
  const createOrder = useCallback(async (orderData: {
    courseId: string;
    amount: number;
    currency?: string;
    paymentIntentId?: string;
    items?: OrderItem[];
  }) => {
    try {
      const response = await api.post<OrderResponse>('/orders', {
        ...orderData,
        status: 'pending',
        currency: orderData.currency || 'usd'
      });
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create order');
      }
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  }, [api]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
  };
};