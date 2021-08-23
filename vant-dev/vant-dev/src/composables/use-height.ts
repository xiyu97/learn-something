import { useRect } from '@vant/use';
import { Ref, ref, onMounted, nextTick } from 'vue';

export const useHeight = (element: Element | Ref<Element | undefined>) => {
  const height = ref<number>();

  onMounted(() => {
    nextTick(() => {
      height.value = useRect(element).height;
    });
  });

  return height;
};
