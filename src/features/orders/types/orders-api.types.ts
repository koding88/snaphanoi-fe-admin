import type {
  OrderDetailRecord,
  OrderMoney,
  OrderPaymentStatus,
  OrderStatus,
} from "@/features/orders/types/orders.types";

export type PublicPackageOrderRequestPayload = {
  name: string;
  email: string;
  countryCode: string;
  galleryId: string;
  packageId: string;
  discoverySource: string;
  personalStory: string;
};

export type PublicCustomOrderRequestPayload = {
  name: string;
  email: string;
  countryCode: string;
  galleryId: string;
  budget: OrderMoney;
  discoverySource: string;
  personalStory: string;
};

export type PublicOrderRequestPayload =
  | PublicPackageOrderRequestPayload
  | PublicCustomOrderRequestPayload;

export type PublicOrderRequestResult = {
  requested: boolean;
};

export type PublicOrderConfirmPayload = {
  token: string;
};

export type OrderUpdatePayload = {
  status?: OrderStatus;
  paymentStatus?: OrderPaymentStatus;
};

export type OrderUpdateResult = OrderDetailRecord;
