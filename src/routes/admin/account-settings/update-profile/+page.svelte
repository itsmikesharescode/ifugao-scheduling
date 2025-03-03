<script lang="ts">
  import UploadProfile from './components/upload-profile.svelte';

  const { data } = $props();
</script>

<div class="max-w-xs">
  <UploadProfile updateProfileForm={data.updateProfileForm} />
</div>
