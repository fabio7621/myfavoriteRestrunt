<template>
  <footer class="app-footer">
    <span class="app-footer__logo">myfavoriteRestrunt</span>
    <span class="app-footer__copy">© 2026 午餐日記</span>
  </footer>
</template>

<style scoped>
.app-footer {
  padding: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-footer__logo {
  font-family: var(--font-serif);
  font-size: 14px;
  color: var(--fg3);
  letter-spacing: 0.08em;
}

.app-footer__copy {
  font-size: 11px;
  color: var(--fg3);
  letter-spacing: 0.12em;
}

@media (max-width: 768px) {
  .app-footer { padding: 32px 20px; flex-direction: column; gap: 12px; }
}
</style>
