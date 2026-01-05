// src/auth/userInfo.ts
// Step 7：获取用户资料
//
// 这个文件是干嘛的？
// 👉 用 access_token 去 Cognito 拿“当前登录用户的信息”
//
// 什么时候用？
// - 登录成功后
// - 想知道用户是谁（email / name 等）
//
// 不做什么？
// - 不登录
// - 不刷新 token
// - 不存数据（存由 storage.ts 负责）

import { COGNITO_DOMAIN } from "./config";

// Cognito userInfo 接口返回的数据结构
// 这里只列常见字段，其它的先不管
export type CognitoUserInfo = {
  sub?: string;                 // 用户唯一 ID
  email?: string;               // 邮箱
  email_verified?: boolean;     // 邮箱是否验证
  name?: string;                // 显示名
  given_name?: string;          // 名
  family_name?: string;         // 姓
  preferred_username?: string;  // 偏好用户名
  username?: string;            // 用户名
  [k: string]: any;             // 其它字段
};

// 用 access_token 请求用户资料
export async function fetchUserInfo(
  accessToken: string
): Promise<CognitoUserInfo> {
  // 没有 access_token 就不能请求
  if (!accessToken) {
    throw new Error("access_token 不存在：无法获取 userInfo");
  }

  // 向 Cognito userInfo 接口发送请求
  const resp = await fetch(`${COGNITO_DOMAIN}/oauth2/userInfo`, {
    method: "GET",
    headers: {
      // 把 access_token 放进 Authorization
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // 先当成文本读出来
  const text = await resp.text();

  // 尝试转成 JSON
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  // 请求失败就直接报错
  if (!resp.ok) {
    throw new Error(
      `${data?.error || "userInfo_error"}: ${data?.error_description || text}`
    );
  }

  // 返回用户资料
  return data as CognitoUserInfo;
}
