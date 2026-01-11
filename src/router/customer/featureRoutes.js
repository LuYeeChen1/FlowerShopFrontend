import AccountFeature from "../../ui/pages/features/AccountFeature.vue";
import ProfileFeature from "../../ui/pages/features/ProfileFeature.vue";
import AddressBookFeature from "../../ui/pages/features/AddressBookFeature.vue";
import CatalogFeature from "../../ui/pages/features/CatalogFeature.vue";
import ProductDetailFeature from "../../ui/pages/features/ProductDetailFeature.vue";
import WishlistFeature from "../../ui/pages/features/WishlistFeature.vue";
import CartFeature from "../../ui/pages/features/CartFeature.vue";
import CheckoutFeature from "../../ui/pages/features/CheckoutFeature.vue";
import OrdersFeature from "../../ui/pages/features/OrdersFeature.vue";
import PaymentFeature from "../../ui/pages/features/PaymentFeature.vue";
import ShipmentFeature from "../../ui/pages/features/ShipmentFeature.vue";
import ReviewsFeature from "../../ui/pages/features/ReviewsFeature.vue";
import AfterSalesFeature from "../../ui/pages/features/AfterSalesFeature.vue";
import CouponsFeature from "../../ui/pages/features/CouponsFeature.vue";
import NotificationsFeature from "../../ui/pages/features/NotificationsFeature.vue";
import SupportFeature from "../../ui/pages/features/SupportFeature.vue";

const customerFeatureRoutes = [
  {
    path: "/customer/account",
    name: "FeatureAccount",
    component: AccountFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/profile",
    name: "FeatureProfile",
    component: ProfileFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/address-book",
    name: "FeatureAddressBook",
    component: AddressBookFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/catalog",
    name: "FeatureCatalog",
    component: CatalogFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/product-detail",
    name: "FeatureProductDetail",
    component: ProductDetailFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/wishlist",
    name: "FeatureWishlist",
    component: WishlistFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/cart",
    name: "FeatureCart",
    component: CartFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/checkout",
    name: "FeatureCheckout",
    component: CheckoutFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/orders",
    name: "FeatureOrders",
    component: OrdersFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/payment",
    name: "FeaturePayment",
    component: PaymentFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/shipment",
    name: "FeatureShipment",
    component: ShipmentFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/reviews",
    name: "FeatureReviews",
    component: ReviewsFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/after-sales",
    name: "FeatureAfterSales",
    component: AfterSalesFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/coupons",
    name: "FeatureCoupons",
    component: CouponsFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/notifications",
    name: "FeatureNotifications",
    component: NotificationsFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
  {
    path: "/customer/support",
    name: "FeatureSupport",
    component: SupportFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER"] },
  },
];

export default customerFeatureRoutes;
