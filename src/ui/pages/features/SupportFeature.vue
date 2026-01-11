<template>
  <main class="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16">
    <header class="space-y-3">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
        Customer Feature
      </p>
      <h1 class="text-3xl font-bold sm:text-4xl">客服工单</h1>
      <p class="text-base text-slate-300">
        创建与跟踪客服工单的进展。
      </p>
    </header>

    <section class="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-slate-200">
      <ul class="list-disc space-y-2 pl-5 text-sm text-slate-300">
        <li>提交新工单</li>
        <li>查看工单历史</li>
        <li>与客服沟通</li>
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
