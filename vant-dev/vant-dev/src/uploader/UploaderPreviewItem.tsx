import { PropType, defineComponent } from 'vue';

// Utils
import { bem, isImageFile } from './utils';
import {
  isDef,
  extend,
  Interceptor,
  getSizeStyle,
  callInterceptor,
} from '../utils';

// Components
import { Icon } from '../icon';
import { Image, ImageFit } from '../image';
import { Loading } from '../loading';

// Types
import type { UploaderFileListItem } from './types';

export default defineComponent({
  props: {
    name: [Number, String],
    index: Number,
    imageFit: String as PropType<ImageFit>,
    lazyLoad: Boolean,
    deletable: Boolean,
    previewSize: [Number, String],
    beforeDelete: Function as PropType<Interceptor>,
    item: {
      type: Object as PropType<UploaderFileListItem>,
      required: true,
    },
  },

  emits: ['delete', 'preview'],

  setup(props, { emit, slots }) {
    const renderMask = () => {
      const { status, message } = props.item;

      if (status === 'uploading' || status === 'failed') {
        const MaskIcon =
          status === 'failed' ? (
            <Icon name="close" class={bem('mask-icon')} />
          ) : (
            <Loading class={bem('loading')} />
          );

        const showMessage = isDef(message) && message !== '';

        return (
          <div class={bem('mask')}>
            {MaskIcon}
            {showMessage && <div class={bem('mask-message')}>{message}</div>}
          </div>
        );
      }
    };

    const onDelete = (event: MouseEvent) => {
      const { name, item, index, beforeDelete } = props;
      event.stopPropagation();
      callInterceptor({
        interceptor: beforeDelete,
        args: [item, { name, index }],
        done: () => emit('delete'),
      });
    };

    const onPreview = () => emit('preview');

    const renderDeleteIcon = () => {
      if (props.deletable && props.item.status !== 'uploading') {
        return (
          <div class={bem('preview-delete')} onClick={onDelete}>
            <Icon name="cross" class={bem('preview-delete-icon')} />
          </div>
        );
      }
    };

    const renderCover = () => {
      if (slots['preview-cover']) {
        const { index, item } = props;
        return (
          <div class={bem('preview-cover')}>
            {slots['preview-cover'](extend({ index }, item))}
          </div>
        );
      }
    };

    const renderPreview = () => {
      const { item } = props;

      if (isImageFile(item)) {
        return (
          <Image
            fit={props.imageFit}
            src={item.content || item.url}
            class={bem('preview-image')}
            width={props.previewSize}
            height={props.previewSize}
            lazyLoad={props.lazyLoad}
            onClick={onPreview}
          >
            {renderCover()}
          </Image>
        );
      }

      return (
        <div class={bem('file')} style={getSizeStyle(props.previewSize)}>
          <Icon class={bem('file-icon')} name="description" />
          <div class={[bem('file-name'), 'van-ellipsis']}>
            {item.file ? item.file.name : item.url}
          </div>
          {renderCover()}
        </div>
      );
    };

    return () => (
      <div class={bem('preview')}>
        {renderPreview()}
        {renderMask()}
        {renderDeleteIcon()}
      </div>
    );
  },
});
