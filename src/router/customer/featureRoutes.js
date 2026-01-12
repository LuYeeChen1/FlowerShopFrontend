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
    path: "/account",
    name: "FeatureAccount",
    component: AccountFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/profile",
    name: "FeatureProfile",
    component: ProfileFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/address-book",
    name: "FeatureAddressBook",
    component: AddressBookFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/catalog",
    name: "FeatureCatalog",
    component: CatalogFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/product-detail",
    name: "FeatureProductDetail",
    component: ProductDetailFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/wishlist",
    name: "FeatureWishlist",
    component: WishlistFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/cart",
    name: "FeatureCart",
    component: CartFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/checkout",
    name: "FeatureCheckout",
    component: CheckoutFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/orders",
    name: "FeatureOrders",
    component: OrdersFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/payment",
    name: "FeaturePayment",
    component: PaymentFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/shipment",
    name: "FeatureShipment",
    component: ShipmentFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/reviews",
    name: "FeatureReviews",
    component: ReviewsFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/after-sales",
    name: "FeatureAfterSales",
    component: AfterSalesFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/coupons",
    name: "FeatureCoupons",
    component: CouponsFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/notifications",
    name: "FeatureNotifications",
    component: NotificationsFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
  {
    path: "/support",
    name: "FeatureSupport",
    component: SupportFeature,
    meta: { requiresAuth: true, requiredGroups: ["CUSTOMER", "SELLER"] },
  },
];

export default customerFeatureRoutes;
