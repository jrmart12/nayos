import { supabase } from './supabase';
import { CartItem } from '@/contexts/CartContext';

export interface OrderData {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: string;
  subtotal: number;
  deliveryPrice: number;
  total: number;
  items: CartItem[];
  notes?: string;
  transferImageUrl?: string;
}

export async function saveOrder(data: OrderData): Promise<void> {
  // Deduplication: skip if the same phone + total was saved within the last 12 hours
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('customer_phone', data.customerPhone)
    .eq('total', data.total)
    .gte('created_at', twelveHoursAgo)
    .limit(1);

  if (existing && existing.length > 0) {
    // Duplicate detected — skip insert
    return;
  }

  const { error } = await supabase.from('orders').insert([
    {
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      customer_address: data.customerAddress || null,
      delivery_method: data.deliveryMethod,
      payment_method: data.paymentMethod,
      subtotal: data.subtotal,
      delivery_price: data.deliveryPrice,
      total: data.total,
      items: data.items,
      notes: data.notes || null,
      transfer_image_url: data.transferImageUrl || null,
    },
  ]);

  if (error) {
    console.error('Error saving order to Supabase:', error);
  }
}
