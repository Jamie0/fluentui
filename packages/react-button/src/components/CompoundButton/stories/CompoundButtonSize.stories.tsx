import * as React from 'react';
import { CalendarMonthRegular } from '@fluentui/react-icons';
import { CompoundButton } from '../../../CompoundButton';

export const Size = () => {
  return (
    <>
      <CompoundButton icon={<CalendarMonthRegular />} secondaryContent="Secondary content" size="small">
        Size: small
      </CompoundButton>
      <CompoundButton icon={<CalendarMonthRegular />} secondaryContent="Secondary content" size="medium">
        Size: medium
      </CompoundButton>
      <CompoundButton icon={<CalendarMonthRegular />} secondaryContent="Secondary content" size="large">
        Size: large
      </CompoundButton>
    </>
  );
};

Size.parameters = {
  docs: {
    description: {
      story: 'A compound button supports `small`, `medium` and `large` size. Default size is `medium`.',
    },
  },
};
