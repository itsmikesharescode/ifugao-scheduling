<script lang="ts">
  import Upload from 'lucide-svelte/icons/upload';

  interface Props {
    photo: File;
    name: string;
  }

  let { photo = $bindable(), name }: Props = $props();

  let imgLink = $state('');

  // Handle file selection and image preview
  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        imgLink = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    }
  };
</script>

<div
  class="flex items-center justify-center border-2 border-dashed border-primary/50 bg-background p-4"
>
  <label
    for="profile_upload"
    class="relative flex size-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-secondary"
  >
    <Upload class="size-14" />
    <span class="text-xs text-muted-foreground">Click to upload image</span>

    {#if imgLink}
      <div class="absolute inset-0 rounded-lg bg-red-500">
        <img src={imgLink} alt="Uploaded preview" class="size-full rounded-lg object-cover" />
      </div>
    {/if}

    <input
      {name}
      type="file"
      id="profile_upload"
      class="hidden"
      accept="image/*"
      multiple={false}
      onchange={handleFileUpload}
      oninput={(e) => (photo = e.currentTarget.files?.item(0))}
    />
  </label>
</div>
