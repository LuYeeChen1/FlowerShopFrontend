# Feature to File Mapping

## 启动与路由
- index.html
- src/main.js
- src/App.vue
- src/router/index.js
- src/style.css

## 登录
- src/pages/Auth.vue
- src/auth/login/oauth.ts
- src/auth/login/pkce.ts
- src/auth/storage/tempStorage.ts
- src/auth/config/cognito.ts

## 回调
- src/pages/Callback.vue
- src/auth/callback/handleCallback.ts
- src/auth/callback/tokenExchange.ts
- src/auth/storage/tokenStorage.ts
- src/auth/storage/userInfoStorage.ts
- src/auth/userInfo.ts

## API
- src/auth/request/authFetch.ts
- src/auth/request/refreshToken.ts
- src/auth/config/api.ts

## 布局
- src/layouts/AppLayout.vue
- src/layouts/app/AppHeader.vue
- src/layouts/app/AppMobileNav.vue
- src/layouts/app/useAppLayout.ts
- src/layouts/app/nav.ts
- src/auth/display/userLabel.ts
- src/utils/jwt.ts

## 页面
- src/pages/Me.vue
- src/pages/SignedOut.vue
