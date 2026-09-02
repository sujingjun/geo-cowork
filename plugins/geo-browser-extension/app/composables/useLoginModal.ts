import { LazyAuthLoginModal } from '#components'

export function useLoginModal() {
  const overlay = useOverlay()
  const modal = overlay.create(LazyAuthLoginModal)

  async function openLoginModal() {
    const instance = modal.open()
    return await instance.result
  }

  return {
    openLoginModal
  }
}
