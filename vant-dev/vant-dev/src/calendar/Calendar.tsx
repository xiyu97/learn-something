import {
  ref,
  watch,
  reactive,
  computed,
  PropType,
  TeleportProps,
  defineComponent,
  ExtractPropTypes,
} from 'vue';

// Utils
import { pick, isDate, truthProp, getScrollTop } from '../utils';
import {
  t,
  bem,
  name,
  getToday,
  cloneDate,
  cloneDates,
  getPrevDay,
  getNextDay,
  compareDay,
  calcDateNum,
  compareMonth,
  getDayByOffset,
} from './utils';

// Composables
import { raf, useRect, onMountedOrActivated } from '@vant/use';
import { useRefs } from '../composables/use-refs';
import { useExpose } from '../composables/use-expose';

// Components
import { Popup, PopupPosition } from '../popup';
import { Button } from '../button';
import { Toast } from '../toast';
import CalendarMonth from './CalendarMonth';
import CalendarHeader from './CalendarHeader';

// Types
import type {
  CalendarType,
  CalendarExpose,
  CalendarDayItem,
  CalendarMonthInstance,
} from './types';

const props = {
  show: Boolean,
  title: String,
  color: String,
  round: truthProp,
  readonly: Boolean,
  poppable: truthProp,
  teleport: [String, Object] as PropType<TeleportProps['to']>,
  showMark: truthProp,
  showTitle: truthProp,
  formatter: Function as PropType<(item: CalendarDayItem) => CalendarDayItem>,
  rowHeight: [Number, String],
  confirmText: String,
  rangePrompt: String,
  lazyRender: truthProp,
  showConfirm: truthProp,
  // TODO: remove any
  // see: https://github.com/vuejs/vue-next/issues/2668
  defaultDate: [Date, Array] as any,
  allowSameDay: Boolean,
  showSubtitle: truthProp,
  closeOnPopstate: truthProp,
  confirmDisabledText: String,
  closeOnClickOverlay: truthProp,
  safeAreaInsetBottom: truthProp,
  type: {
    type: String as PropType<CalendarType>,
    default: 'single',
  },
  position: {
    type: String as PropType<PopupPosition>,
    default: 'bottom',
  },
  maxRange: {
    type: [Number, String],
    default: null,
  },
  minDate: {
    type: Date,
    validator: isDate,
    default: getToday,
  },
  maxDate: {
    type: Date,
    validator: isDate,
    default: () => {
      const now = getToday();
      return new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
    },
  },
  firstDayOfWeek: {
    type: [Number, String],
    default: 0,
    validator: (val: number) => val >= 0 && val <= 6,
  },
  showRangePrompt: {
    type: Boolean,
    default: true,
  },
};

export type CalendarProps = ExtractPropTypes<typeof props>;

export default defineComponent({
  name,

  props,

  emits: [
    'select',
    'confirm',
    'unselect',
    'month-show',
    'over-range',
    'update:show',
    'click-subtitle',
  ],

  setup(props, { emit, slots }) {
    const limitDateRange = (
      date: Date,
      minDate = props.minDate,
      maxDate = props.maxDate
    ) => {
      if (compareDay(date, minDate) === -1) {
        return minDate;
      }
      if (compareDay(date, maxDate) === 1) {
        return maxDate;
      }
      return date;
    };

    const getInitialDate = (defaultDate = props.defaultDate) => {
      const { type, minDate, maxDate } = props;

      if (defaultDate === null) {
        return defaultDate;
      }

      const now = getToday();

      if (type === 'range') {
        if (!Array.isArray(defaultDate)) {
          defaultDate = [];
        }
        const start = limitDateRange(
          defaultDate[0] || now,
          minDate,
          getPrevDay(maxDate)
        );
        const end = limitDateRange(defaultDate[1] || now, getNextDay(minDate));
        return [start, end];
      }

      if (type === 'multiple') {
        if (Array.isArray(defaultDate)) {
          return defaultDate.map((date) => limitDateRange(date));
        }
        return [limitDateRange(now)];
      }

      if (!defaultDate || Array.isArray(defaultDate)) {
        defaultDate = now;
      }
      return limitDateRange(defaultDate);
    };

    let bodyHeight: number;

    const bodyRef = ref<HTMLElement>();

    const state = reactive({
      subtitle: '',
      currentDate: getInitialDate(),
    });

    const [monthRefs, setMonthRefs] = useRefs<CalendarMonthInstance>();

    const dayOffset = computed(() =>
      props.firstDayOfWeek ? +props.firstDayOfWeek % 7 : 0
    );

    const months = computed(() => {
      const months = [];
      const cursor = new Date(props.minDate);

      cursor.setDate(1);

      do {
        months.push(new Date(cursor));
        cursor.setMonth(cursor.getMonth() + 1);
      } while (compareMonth(cursor, props.maxDate) !== 1);

      return months;
    });

    const buttonDisabled = computed(() => {
      const { currentDate } = state;

      if (currentDate) {
        if (props.type === 'range') {
          return !(currentDate as Date[])[0] || !(currentDate as Date[])[1];
        }
        if (props.type === 'multiple') {
          return !(currentDate as Date[]).length;
        }
      }

      return !currentDate;
    });

    // calculate the position of the elements
    // and find the elements that needs to be rendered
    const onScroll = () => {
      const top = getScrollTop(bodyRef.value!);
      const bottom = top + bodyHeight;

      const heights = months.value.map((item, index) =>
        monthRefs.value[index].getHeight()
      );
      const heightSum = heights.reduce((a, b) => a + b, 0);

      // iOS scroll bounce may exceed the range
      if (bottom > heightSum && top > 0) {
        return;
      }

      let height = 0;
      let currentMonth;
      const visibleRange = [-1, -1];

      for (let i = 0; i < months.value.length; i++) {
        const month = monthRefs.value[i];
        const visible = height <= bottom && height + heights[i] >= top;

        if (visible) {
          visibleRange[1] = i;

          if (!currentMonth) {
            currentMonth = month;
            visibleRange[0] = i;
          }

          if (!monthRefs.value[i].showed) {
            monthRefs.value[i].showed = true;
            emit('month-show', {
              date: month.date,
              title: month.getTitle(),
            });
          }
        }

        height += heights[i];
      }

      months.value.forEach((month, index) => {
        const visible =
          index >= visibleRange[0] - 1 && index <= visibleRange[1] + 1;
        monthRefs.value[index].setVisible(visible);
      });

      /* istanbul ignore else */
      if (currentMonth) {
        state.subtitle = currentMonth.getTitle();
      }
    };

    const scrollToDate = (targetDate: Date) => {
      raf(() => {
        months.value.some((month, index) => {
          if (compareMonth(month, targetDate) === 0) {
            if (bodyRef.value) {
              monthRefs.value[index].scrollIntoView(bodyRef.value);
            }
            return true;
          }

          return false;
        });

        onScroll();
      });
    };

    // scroll to current month
    const scrollIntoView = () => {
      if (props.poppable && !props.show) {
        return;
      }

      const { currentDate } = state;
      if (currentDate) {
        const targetDate =
          props.type === 'single' ? currentDate : (currentDate as Date[])[0];
        scrollToDate(targetDate);
      } else {
        raf(onScroll);
      }
    };

    const init = () => {
      if (props.poppable && !props.show) {
        return;
      }

      raf(() => {
        // add Math.floor to avoid decimal height issues
        // https://github.com/youzan/vant/issues/5640
        bodyHeight = Math.floor(useRect(bodyRef).height);
        scrollIntoView();
      });
    };

    const reset = (date = getInitialDate()) => {
      state.currentDate = date;
      scrollIntoView();
    };

    const checkRange = (date: [Date, Date]) => {
      const { maxRange, rangePrompt, showRangePrompt } = props;

      if (maxRange && calcDateNum(date) > maxRange) {
        if (showRangePrompt) {
          Toast(rangePrompt || t('rangePrompt', maxRange));
        }
        emit('over-range');
        return false;
      }

      return true;
    };

    const onConfirm = () => emit('confirm', cloneDates(state.currentDate));

    const select = (date: Date | Date[], complete?: boolean) => {
      const setCurrentDate = (date: Date | Date[]) => {
        state.currentDate = date;
        emit('select', cloneDates(state.currentDate));
      };

      if (complete && props.type === 'range') {
        const valid = checkRange(date as [Date, Date]);

        if (!valid) {
          // auto selected to max range if showConfirm
          if (props.showConfirm) {
            setCurrentDate([
              (date as Date[])[0],
              getDayByOffset((date as Date[])[0], +props.maxRange - 1),
            ]);
          } else {
            setCurrentDate(date);
          }
          return;
        }
      }

      setCurrentDate(date);

      if (complete && !props.showConfirm) {
        onConfirm();
      }
    };

    const onClickDay = (item: CalendarDayItem) => {
      if (props.readonly || !item.date) {
        return;
      }

      const { date } = item;
      const { type } = props;
      const { currentDate } = state;

      if (type === 'range') {
        if (!currentDate) {
          select([date]);
          return;
        }

        const [startDay, endDay] = currentDate;

        if (startDay && !endDay) {
          const compareToStart = compareDay(date, startDay);

          if (compareToStart === 1) {
            select([startDay, date], true);
          } else if (compareToStart === -1) {
            select([date]);
          } else if (props.allowSameDay) {
            select([date, date], true);
          }
        } else {
          select([date]);
        }
      } else if (type === 'multiple') {
        if (!currentDate) {
          select([date]);
          return;
        }

        let selectedIndex;
        const selected = state.currentDate.some(
          (dateItem: Date, index: number) => {
            const equal = compareDay(dateItem, date) === 0;
            if (equal) {
              selectedIndex = index;
            }
            return equal;
          }
        );

        if (selected) {
          const [unselectedDate] = currentDate.splice(selectedIndex, 1);
          emit('unselect', cloneDate(unselectedDate));
        } else if (props.maxRange && currentDate.length >= props.maxRange) {
          Toast(props.rangePrompt || t('rangePrompt', props.maxRange));
        } else {
          select([...currentDate, date]);
        }
      } else {
        select(date, true);
      }
    };

    const updateShow = (value: boolean) => emit('update:show', value);

    const renderMonth = (date: Date, index: number) => {
      const showMonthTitle = index !== 0 || !props.showSubtitle;
      return (
        <CalendarMonth
          v-slots={pick(slots, ['top-info', 'bottom-info'])}
          ref={setMonthRefs(index)}
          date={date}
          currentDate={state.currentDate}
          showMonthTitle={showMonthTitle}
          firstDayOfWeek={dayOffset.value}
          {...pick(props, [
            'type',
            'color',
            'minDate',
            'maxDate',
            'showMark',
            'formatter',
            'rowHeight',
            'lazyRender',
            'showSubtitle',
            'allowSameDay',
          ])}
          onClick={onClickDay}
        />
      );
    };

    const renderFooterButton = () => {
      if (slots.footer) {
        return slots.footer();
      }

      if (props.showConfirm) {
        const text = buttonDisabled.value
          ? props.confirmDisabledText
          : props.confirmText;

        return (
          <Button
            round
            block
            type="danger"
            color={props.color}
            class={bem('confirm')}
            disabled={buttonDisabled.value}
            nativeType="button"
            onClick={onConfirm}
          >
            {text || t('confirm')}
          </Button>
        );
      }
    };

    const renderFooter = () => (
      <div
        class={[
          bem('footer'),
          { 'van-safe-area-bottom': props.safeAreaInsetBottom },
        ]}
      >
        {renderFooterButton()}
      </div>
    );

    const renderCalendar = () => (
      <div class={bem()}>
        <CalendarHeader
          v-slots={pick(slots, ['title', 'subtitle'])}
          title={props.title}
          subtitle={state.subtitle}
          showTitle={props.showTitle}
          showSubtitle={props.showSubtitle}
          firstDayOfWeek={dayOffset.value}
          onClick-subtitle={(event: MouseEvent) => {
            emit('click-subtitle', event);
          }}
        />
        <div ref={bodyRef} class={bem('body')} onScroll={onScroll}>
          {months.value.map(renderMonth)}
        </div>
        {renderFooter()}
      </div>
    );

    watch(() => props.show, init);
    watch(
      () => [props.type, props.minDate, props.maxDate],
      () => {
        reset(getInitialDate(state.currentDate));
      }
    );
    watch(
      () => props.defaultDate,
      (value) => {
        state.currentDate = value;
        scrollIntoView();
      }
    );

    useExpose<CalendarExpose>({
      reset,
      scrollToDate,
    });

    onMountedOrActivated(init);

    return () => {
      if (props.poppable) {
        return (
          <Popup
            show={props.show}
            class={bem('popup')}
            round={props.round}
            position={props.position}
            closeable={props.showTitle || props.showSubtitle}
            teleport={props.teleport}
            closeOnPopstate={props.closeOnPopstate}
            closeOnClickOverlay={props.closeOnClickOverlay}
            {...{ 'onUpdate:show': updateShow }}
          >
            {renderCalendar()}
          </Popup>
        );
      }

      return renderCalendar();
    };
  },
});
