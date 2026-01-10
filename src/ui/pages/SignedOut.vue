<template>
  <main class="min-h-screen bg-slate-950 text-slate-100">
    <section class="mx-auto flex max-w-xl flex-col gap-4 px-6 py-24 text-center">
      <h1 class="text-3xl font-bold">已登出</h1>
      <p class="text-slate-300">本地 token 已清理，可以重新登录。</p>
      <router-link
        class="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
        to="/"
      >
        返回首页
      </router-link>
    </section>
  </main>
</template>
