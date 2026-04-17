export const ORDER_STATUS_VALUES = [
  "pending",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export const ORDER_PAYMENT_STATUS_VALUES = [
  "unpaid",
  "partiallyPaid",
  "paid",
  "refunded",
] as const;

export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number];
export type OrderPaymentStatus = (typeof ORDER_PAYMENT_STATUS_VALUES)[number];

export type OrderDiscoverySource = string;

export type OrderMoney = {
  amount: number;
  currency: string;
};

export type OrderLocalizedText = {
  en: string;
  vi: string;
  cn: string;
};

export type OrderGallerySnapshot = {
  id: string;
  name: string | OrderLocalizedText;
};

export type OrderPackageSnapshot = {
  id: string;
  name: string | OrderLocalizedText;
  bestFor?: string | OrderLocalizedText;
  duration?: number;
  photoCount?: number;
  pricing?: OrderMoney | null;
};

export type PackageOrderItem = {
  type: "package";
  galleryId: string;
  gallerySnapshot: OrderGallerySnapshot;
  packageId: string | null;
  packageSnapshot: OrderPackageSnapshot | null;
  pricing: OrderMoney | null;
  budget: null;
  createdAt: string;
  updatedAt: string;
};

export type CustomOrderItem = {
  type: "custom";
  galleryId: string;
  gallerySnapshot: OrderGallerySnapshot;
  packageId: null;
  packageSnapshot: null;
  pricing: null;
  budget: OrderMoney | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderItemRecord = PackageOrderItem | CustomOrderItem;

export type OrderCustomerInfo = {
  name: string;
  email: string;
  countryCode: string;
  phoneNumber: string | null;
};

export type OrderRecord = {
  id: string;
  requestDraftId: string;
  orderNumber: string;
  userId: string | null;
  customerInfo: OrderCustomerInfo;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  discoverySource: OrderDiscoverySource;
  personalStory: string;
  items: OrderItemRecord[];
  createdAt: string;
  updatedAt: string;
};

export type OrderDetailRecord = OrderRecord;

export type OrdersListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type OrdersListResult = {
  items: OrderRecord[];
  meta: OrdersListMeta;
};

export type OrderListQuery = {
  page: number;
  limit: number;
  keyword: string;
  status: OrderStatus | "";
  paymentStatus: OrderPaymentStatus | "";
  discoverySource: string;
};

export type PublicOrderGalleryOption = {
  id: string;
  name: string;
};

export type PublicOrderPackageOption = {
  id: string;
  name: string;
  bestFor: string;
  duration: number;
  photoCount: number;
  pricing: OrderMoney;
};
