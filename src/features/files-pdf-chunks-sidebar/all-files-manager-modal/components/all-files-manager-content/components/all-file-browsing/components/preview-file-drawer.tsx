import { Drawer } from '@/components/elements/drawer';
import { WorkspaceFile } from '@/features/files-pdf-chunks-sidebar/types/types';
import { PreviewEntireFile } from '@/features/files-pdf-chunks-sidebar/preview-entire-file';
import CustomSplitter from '@/components/custom-splitter';
import { styled } from 'styled-system/jsx';
import { getFileExtension } from '@/features/files-pdf-chunks-sidebar/files-manager/util/get-file-extension';
import { PreviewEntireMedia } from '@/features/files-pdf-chunks-sidebar/audio-video-viewer/components/preview-entire-media';

interface Props {
  file: WorkspaceFile;
  onClose: VoidFunction;
}

export const PreviewFileDrawer = (props: Drawer.RootProps & Props) => {
  const displayFile = (file?: WorkspaceFile) => {
    const avExtensions = ['youtube', 'webm', 'mp4', 'mp3', 'wav', 'm4a'];
    if (!file) return;
    if (avExtensions.includes(getFileExtension(file.filename))) {
      return <PreviewEntireMedia file={file} onClose={props.onClose} />;
    }
    return <PreviewEntireFile file={file} onClose={props.onClose} />;
  };

  return (
    <Drawer.Root closeOnInteractOutside {...props}>
      <Drawer.Backdrop />
      <Drawer.Positioner w="100%">
        <Drawer.Content w="100%" bgColor="transparent" boxShadow={'none'}>
          <CustomSplitter
            id="custom-splitter-2"
            isToggleable={{ isToggled: true }}
            onLeftPanelClick={props.onClose}
            withOffset={false}>
            <div></div>
            <styled.div bgColor="white">{displayFile(props.file)}</styled.div>
          </CustomSplitter>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
