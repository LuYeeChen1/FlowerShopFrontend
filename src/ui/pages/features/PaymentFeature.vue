<template>
  <main class="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16">
    <header class="space-y-3">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
        Customer Feature
      </p>
      <h1 class="text-3xl font-bold sm:text-4xl">支付</h1>
      <p class="text-base text-slate-300">
        发起订单支付并查看支付结果。
      </p>
    </header>

    <section class="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-slate-200">
      <ul class="list-disc space-y-2 pl-5 text-sm text-slate-300">
        <li>支付方式选择</li>
        <li>支付状态与失败提示</li>
        <li>支付完成确认</li>
      </ul>
    </section>

    <router-link
      class="inline-flex w-fit items-center rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-emerald-300 hover:text-emerald-200"
      to="/"
    >
      返回首页
    </router-link>
  </main>
</template>
