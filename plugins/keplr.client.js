export default async (context) => {
  if (process.browser) {
    await window.addEventListener('keplr_keystorechange', async () => {
      await context.store.dispatch('keplr/init')
      context.store.dispatch(`signIn`, {
        sessionType: `keplr`,
        address: context.store.state.keplr.accounts[0].address,
      })
    })
  }
}
