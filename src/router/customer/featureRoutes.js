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
  },
  {
    path: "/customer/profile",
    name: "FeatureProfile",
    component: ProfileFeature,
  },
  {
    path: "/customer/address-book",
    name: "FeatureAddressBook",
    component: AddressBookFeature,
  },
  {
    path: "/customer/catalog",
    name: "FeatureCatalog",
    component: CatalogFeature,
  },
  {
    path: "/customer/product-detail",
    name: "FeatureProductDetail",
    component: ProductDetailFeature,
  },
  {
    path: "/customer/wishlist",
    name: "FeatureWishlist",
    component: WishlistFeature,
  },
  {
    path: "/customer/cart",
    name: "FeatureCart",
    component: CartFeature,
  },
  {
    path: "/customer/checkout",
    name: "FeatureCheckout",
    component: CheckoutFeature,
  },
  {
    path: "/customer/orders",
    name: "FeatureOrders",
    component: OrdersFeature,
  },
  {
    path: "/customer/payment",
    name: "FeaturePayment",
    component: PaymentFeature,
  },
  {
    path: "/customer/shipment",
    name: "FeatureShipment",
    component: ShipmentFeature,
  },
  {
    path: "/customer/reviews",
    name: "FeatureReviews",
    component: ReviewsFeature,
  },
  {
    path: "/customer/after-sales",
    name: "FeatureAfterSales",
    component: AfterSalesFeature,
  },
  {
    path: "/customer/coupons",
    name: "FeatureCoupons",
    component: CouponsFeature,
  },
  {
    path: "/customer/notifications",
    name: "FeatureNotifications",
    component: NotificationsFeature,
  },
  {
    path: "/customer/support",
    name: "FeatureSupport",
    component: SupportFeature,
  },
];

export default customerFeatureRoutes;
