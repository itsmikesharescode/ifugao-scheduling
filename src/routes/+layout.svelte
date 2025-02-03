<script>
  import '../app.css';
  import '@fontsource/prompt/100.css';
  import '@fontsource/prompt/200.css';
  import '@fontsource/prompt/300.css';
  import '@fontsource/prompt/400.css';
  import '@fontsource/prompt/500.css';
  import '@fontsource/prompt/600.css';
  import '@fontsource/prompt/700.css';
  import '@fontsource/prompt/800.css';
  import '@fontsource/prompt/900.css';
  import { invalidate } from '$app/navigation';
  import { ModeWatcher } from 'mode-watcher';

  let { data, children } = $props();
  let { session, supabase } = $derived(data);

  $effect(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => data.subscription.unsubscribe();
  });

  import { onNavigate } from '$app/navigation';

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<ModeWatcher />
{@render children()}

<style>
  :global(html) {
    font-family: 'Prompt', sans-serif;
  }
</style>
