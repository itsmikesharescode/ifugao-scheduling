<script lang="ts" module>
  import { Uppy, type UppyFile } from '@uppy/core';
  import Dashboard from '@uppy/dashboard';
  import ImageEditor from '@uppy/image-editor';

  import '@uppy/core/dist/style.min.css';
  import '@uppy/dashboard/dist/style.min.css';
  import '@uppy/image-editor/dist/style.min.css';

  interface Props {
    onFileChanges: (file: Blob | File) => void;
    size?: number;
    dimensions?: {
      height?: number;
      width?: string;
    };
  }
</script>

<script lang="ts">
  const { onFileChanges, size = 5, dimensions = { height: 650, width: '100%' } }: Props = $props();

  let dashboardDOM = $state<HTMLDivElement>();
  let uppy = $state<Uppy>();

  $effect(() => {
    if (dashboardDOM) {
      uppy = new Uppy({
        debug: true,
        autoProceed: false,
        allowMultipleUploadBatches: false,
        restrictions: {
          maxFileSize: 5000000,
          maxNumberOfFiles: 1,
          allowedFileTypes: ['image/*']
        }
      });

      return () => {
        if (uppy) {
          uppy.destroy();
        }
      };
    }
  });

  //init uppy configs
  $effect(() => {
    if (uppy) {
      uppy
        .use(Dashboard, {
          target: dashboardDOM,
          inline: true,
          height: dimensions?.height || size,
          width: dimensions?.width || size,
          showProgressDetails: true,
          proudlyDisplayPoweredByUppy: false,
          hideUploadButton: true,
          replaceTargetContent: true,
          locale: {
            pluralize: (n) => (n === 1 ? 0 : 1),
            strings: {
              dropPasteFiles: 'Drop or paste your profile photo here or click %{browseFiles}',
              browseFiles: 'Browse files'
            }
          }
        })
        .use(ImageEditor, {
          cropperOptions: {
            viewMode: 1,
            aspectRatio: 1,
            background: false
          },
          actions: {
            revert: true,
            rotate: true,
            granularRotate: true,
            flip: true,
            zoomIn: true,
            zoomOut: true,
            cropSquare: true,
            cropWidescreen: true,
            cropWidescreenVertical: true
          }
        });

      //changes listeners
      uppy.on('file-added', (file) => {
        onFileChanges(file.data);
      });

      uppy.on('file-editor:complete', (file) => {
        onFileChanges(file.data);
      });
    }
  });
</script>

<div bind:this={dashboardDOM} class="w-full"></div>
