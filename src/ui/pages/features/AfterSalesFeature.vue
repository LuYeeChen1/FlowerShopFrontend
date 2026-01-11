<template>
  <main class="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16">
    <header class="space-y-3">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
        Customer Feature
      </p>
      <h1 class="text-3xl font-bold sm:text-4xl">售后</h1>
      <p class="text-base text-slate-300">
        提交退款、退货或换货申请并跟踪进度。
      </p>
    </header>

    <section class="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-slate-200">
      <ul class="list-disc space-y-2 pl-5 text-sm text-slate-300">
        <li>发起售后申请</li>
        <li>填写原因与证据材料</li>
        <li>查看售后状态变化</li>
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
