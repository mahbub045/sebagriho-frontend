export default function Notification() {
  return (
    <button
      type='button'
      className='inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-sm text-foreground transition-colors hover:bg-accent'
      aria-label='Notifications'
    >
      🔔
    </button>
  );
}
