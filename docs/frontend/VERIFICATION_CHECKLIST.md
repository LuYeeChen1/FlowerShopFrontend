# Verification Checklist

## 登录
- [ ] 可跳转 Hosted UI
- [ ] 回调成功进入 /app
- [ ] token 存于 sessionStorage

## API
- [ ] /me 调用成功
- [ ] token 可自动刷新
- [ ] 401 可恢复一次

## 登出
- [ ] 清理本地缓存
- [ ] 跳转 Cognito logout
- [ ] 落地 /signed-out
