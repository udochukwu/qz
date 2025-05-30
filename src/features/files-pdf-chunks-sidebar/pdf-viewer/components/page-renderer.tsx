import { RenderPageProps } from '@react-pdf-viewer/core';
import { DocumentChunkProps } from '@/types';

export const PageRenderer = (chunks?: DocumentChunkProps[]) => {
  const RenderPageComponent = (props: RenderPageProps) => {
    const page_height_after_zoom = props.height;

    const currentPageIndex = props.pageIndex;
    //get the first chunk in the current page
    const chunk = chunks?.find(chunk => chunk.page_number === currentPageIndex);
    var scaled_chunk = chunk;
    if (chunk) {
      const page_height_from_mathpix = chunk.page_height;
      const mathpix_scale = page_height_after_zoom / page_height_from_mathpix;
      scaled_chunk = {
        ...chunk,
        coordinates: {
          top_left_x: chunk.coordinates.top_left_x * mathpix_scale,
          top_left_y: chunk.coordinates.top_left_y * mathpix_scale,
          width: chunk.coordinates.width * mathpix_scale,
          height: chunk.coordinates.height * mathpix_scale,
        },
        page_number: chunk.page_number,
        page_height: page_height_after_zoom,
      };
    }

    return (
      <>
        {props.canvasLayer.children}

        {scaled_chunk && (
          <div
            style={{
              position: 'absolute',
              left: `${scaled_chunk.coordinates.top_left_x}px`,
              top: `${scaled_chunk.coordinates.top_left_y}px`,
              width: `${scaled_chunk.coordinates.width}px`,
              height: `${scaled_chunk.coordinates.height}px`,
              backgroundColor: '#abf1f7',
              opacity: 0.3,
            }}
          />
        )}

        {props.annotationLayer.children}
        {props.textLayer.children}
      </>
    );
  };

  // Assign a display name to the component for debugging purposes
  RenderPageComponent.displayName = 'CustomRenderPageComponent';

  return RenderPageComponent;
};
