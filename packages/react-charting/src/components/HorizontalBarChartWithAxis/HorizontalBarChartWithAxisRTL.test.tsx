import { render, screen, fireEvent, act } from '@testing-library/react';
import * as React from 'react';
import { DarkTheme } from '@fluentui/theme-samples';
import { ThemeProvider } from '@fluentui/react';
import { DefaultPalette } from '@fluentui/react/lib/Styling';
import { HorizontalBarChartWithAxis } from './HorizontalBarChartWithAxis';
import { getByClass, getById, testWithWait, testWithoutWait } from '../../utilities/TestUtility.test';
import { HorizontalBarChartWithAxisBase } from './HorizontalBarChartWithAxis.base';
import { IHorizontalBarChartWithAxisDataPoint } from '../../HorizontalBarChart';

const chartPoints: IHorizontalBarChartWithAxisDataPoint[] = [
  {
    x: 10000,
    y: 5000,
    legend: 'Oranges',
    color: DefaultPalette.accent,
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '10%',
  },
  {
    x: 20000,
    y: 50000,
    legend: 'Grapes',
    color: DefaultPalette.blueDark,
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '20%',
  },
  {
    x: 25000,
    y: 30000,
    legend: 'Apples',
    color: DefaultPalette.blueMid,
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '37%',
  },

  {
    x: 40000,
    y: 13000,
    legend: 'Bananas',
    color: DefaultPalette.blueLight,
    yAxisCalloutData: '2020/04/30',
    xAxisCalloutData: '88%',
  },
];

const chartPointsWithStringYAxis: IHorizontalBarChartWithAxisDataPoint[] = [
  {
    y: 'String One',
    x: 1000,
    color: DefaultPalette.accent,
  },
  {
    y: 'String Two',
    x: 5000,
    color: DefaultPalette.blueDark,
  },
  {
    y: 'String Three',
    x: 3000,
    color: DefaultPalette.blueMid,
  },
  {
    y: 'String Four',
    x: 2000,
    color: DefaultPalette.blue,
  },
];

const chartPointsWithAxisToolTip: IHorizontalBarChartWithAxisDataPoint[] = [
  {
    x: 1000,
    y: 1000,
    color: DefaultPalette.accent,
  },
  {
    x: 2000,
    y: 5000,
    color: DefaultPalette.blueDark,
  },
  {
    x: 3000,
    y: 3000,
    color: DefaultPalette.blueMid,
  },
  {
    x: 4000,
    y: 2000,
    color: DefaultPalette.blue,
  },
];

describe('Horizontal bar chart with axis rendering', () => {
  testWithoutWait(
    'Should render the Horizontal bar chart with axis with numaric yaxis data',
    HorizontalBarChartWithAxis,
    { data: chartPoints },
    container => {
      // Assert
      expect(container).toMatchSnapshot();
    },
  );

  testWithoutWait(
    'Should render the Horizontal bar chart with axis with string yaxis data',
    HorizontalBarChartWithAxis,
    { data: chartPointsWithStringYAxis },
    container => {
      // Assert
      expect(container).toMatchSnapshot();
    },
  );
});

describe('Horizontal bar chart with axis - Subcomponent bar', () => {
  testWithWait(
    'Should render the bars with the specified colors',
    HorizontalBarChartWithAxis,
    { data: chartPoints },
    container => {
      // colors mentioned in the data points itself
      // Assert
      const bars = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'rect');
      expect(bars).toHaveLength(4);
      expect(bars[0].getAttribute('fill')).toEqual('#002050');
      expect(bars[1].getAttribute('fill')).toEqual('#00188f');
      expect(bars[2].getAttribute('fill')).toEqual('#00bcf2');
      expect(bars[3].getAttribute('fill')).toEqual('#0078d4');
    },
  );

  testWithWait(
    'Should render the bars with the single color',
    HorizontalBarChartWithAxis,
    { data: chartPoints, useSingleColor: true },
    container => {
      // colors mentioned in the data points itself
      // Assert
      const bars = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'rect');
      expect(bars).toHaveLength(4);
      expect(bars[0].getAttribute('fill')).toEqual('#e3008c');
      expect(bars[1].getAttribute('fill')).toEqual('#e3008c');
      expect(bars[2].getAttribute('fill')).toEqual('#e3008c');
      expect(bars[3].getAttribute('fill')).toEqual('#e3008c');
    },
  );

  testWithWait(
    'Should render the bar with the given height',
    HorizontalBarChartWithAxis,
    { data: chartPoints, barHeight: 50 },
    container => {
      // Assert
      const bars = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'rect');
      expect(bars).toHaveLength(4);
      expect(bars[0].getAttribute('height')).toEqual('50');
      expect(bars[1].getAttribute('height')).toEqual('50');
      expect(bars[2].getAttribute('height')).toEqual('50');
      expect(bars[3].getAttribute('height')).toEqual('50');
    },
  );
});

describe('Horizontal bar chart with axis- Subcomponent Legends', () => {
  testWithoutWait(
    'Should not show any rendered legends when hideLegend is true',
    HorizontalBarChartWithAxis,
    { data: chartPoints, hideLegend: true },
    container => {
      // Assert
      // Legends have 'rect' as a part of their classname
      expect(getByClass(container, /legend/i)).toHaveLength(0);
    },
  );

  testWithWait(
    'Should reduce the opacity of the other bars on mouse over a bar legend',
    HorizontalBarChartWithAxis,
    { data: chartPoints },
    async container => {
      const legends = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'button');
      fireEvent.mouseOver(legends[0]);
      await new Promise(resolve => setTimeout(resolve));
      const bars = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'rect');
      // Assert
      expect(bars).toHaveLength(4);
      expect(bars[0]).toHaveStyle('opacity: 0.1');
      expect(bars[1]).toHaveStyle('opacity: 0.1');
      expect(bars[2]).toHaveStyle('opacity: 0.1');
      expect(bars[3]).not.toHaveAttribute('opacity');
    },
  );

  testWithWait(
    'Should reset the opacity of the bars on mouse leave a bar legend',
    HorizontalBarChartWithAxis,
    { data: chartPoints },
    async container => {
      // Arrange
      const legends = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'button');
      fireEvent.mouseOver(legends![0]);
      await new Promise(resolve => setTimeout(resolve));
      fireEvent.mouseLeave(legends![0]);
      await new Promise(resolve => setTimeout(resolve));
      const bars = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'rect');
      // Assert
      expect(bars[0]).not.toHaveAttribute('opacity');
      expect(bars[1]).not.toHaveAttribute('opacity');
      expect(bars[2]).not.toHaveAttribute('opacity');
      expect(bars[3]).not.toHaveAttribute('opacity');
    },
  );

  testWithWait(
    'Should select legend on single mouse click on legends',
    HorizontalBarChartWithAxis,
    { data: chartPoints },
    container => {
      const legends = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'button');
      fireEvent.click(legends![1]);
      const legendsAfterClickEvent = screen.getAllByText(
        (content, element) => element!.tagName.toLowerCase() === 'button',
      );
      // Assert
      expect(legendsAfterClickEvent[0]).toHaveAttribute('aria-selected', 'false');
      expect(legendsAfterClickEvent[1]).toHaveAttribute('aria-selected', 'true');
      expect(legendsAfterClickEvent[2]).toHaveAttribute('aria-selected', 'false');
      expect(legendsAfterClickEvent[3]).toHaveAttribute('aria-selected', 'false');
    },
  );

  testWithWait(
    'Should deselect legend on double mouse click on legends',
    HorizontalBarChartWithAxis,
    { data: chartPoints },
    container => {
      const legends = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'button');
      fireEvent.click(legends![1]);
      fireEvent.click(legends![1]);
      const legendsAfterClickEvent = screen.getAllByText(
        (content, element) => element!.tagName.toLowerCase() === 'button',
      );
      // Assert
      expect(legendsAfterClickEvent[0]).toHaveAttribute('aria-selected', 'false');
      expect(legendsAfterClickEvent[1]).toHaveAttribute('aria-selected', 'false');
      expect(legendsAfterClickEvent[2]).toHaveAttribute('aria-selected', 'false');
      expect(legendsAfterClickEvent[3]).toHaveAttribute('aria-selected', 'false');
    },
  );
});

describe('Horizontal bar chart with axis - Subcomponent callout', () => {
  testWithWait(
    'Should call the handler on mouse over bar and on mouse leave from bar',
    HorizontalBarChartWithAxis,
    { data: chartPoints, calloutProps: { doNotLayer: true } },
    container => {
      // eslint-disable-next-line
      const handleMouseOver = jest.spyOn(HorizontalBarChartWithAxisBase.prototype as any, '_onBarHover');
      const bars = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'rect');
      // Assert
      expect(bars).toHaveLength(4);
      fireEvent.mouseOver(bars[0]);
      expect(handleMouseOver).toHaveBeenCalled();
    },
  );

  testWithWait(
    'Should show the callout over the bar on mouse over',
    HorizontalBarChartWithAxis,
    { data: chartPoints, calloutProps: { doNotLayer: true } },
    container => {
      // Arrange
      const bars = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'rect');
      fireEvent.mouseOver(bars[0]);
      // Assert
      expect(getById(container, /toolTipcallout/i)).toBeDefined();
      const xAxisCallOutData = getByClass(container, /calloutContentX/i);
      expect(xAxisCallOutData).toBeDefined();
      expect(xAxisCallOutData[0].textContent).toEqual('2020/04/30 ');
    },
  );

  testWithWait(
    'Should show the callout properly when mouse moves from one bar to another bar',
    HorizontalBarChartWithAxis,
    { data: chartPointsWithStringYAxis, calloutProps: { doNotLayer: true } },
    container => {
      // Arrange
      const bars = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'rect');
      fireEvent.mouseOver(bars[0]);
      // Assert
      expect(getById(container, /toolTipcallout/i)).toBeDefined();
      const xAxisCallOutData = getByClass(container, /calloutContentX/i);
      expect(xAxisCallOutData).toBeDefined();
      expect(xAxisCallOutData[0].textContent).toEqual('String One ');
      fireEvent.mouseOver(bars[1]);
      const xAxisCallOutDataFoSecondBar = getByClass(container, /calloutContentX/i);
      expect(xAxisCallOutDataFoSecondBar).toBeDefined();
      expect(xAxisCallOutDataFoSecondBar[0].textContent).toEqual('String Two ');
    },
  );

  testWithWait(
    'Should show the custom callout over the bar on mouse over',
    HorizontalBarChartWithAxis,
    {
      data: chartPoints,
      calloutProps: { doNotLayer: true },
      onRenderCalloutPerDataPoint: (props: IHorizontalBarChartWithAxisDataPoint) =>
        props ? (
          <div className="onRenderCalloutPerDataPoint">
            <p>Custom Callout Content</p>
          </div>
        ) : null,
    },
    container => {
      const bars = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'rect');
      fireEvent.mouseOver(bars[0]);
      // Assert
      expect(getById(container, /toolTipcallout/i)).toBeDefined();
      expect(screen.queryByText('Custom Callout Content')).not.toBeNull();
    },
  );

  testWithWait(
    'Should show the callout with axis tooltip data',
    HorizontalBarChartWithAxis,
    { data: chartPointsWithAxisToolTip, calloutProps: { doNotLayer: true } },
    async container => {
      // Arrange
      const bars = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'rect');
      fireEvent.mouseOver(bars[0]);
      await new Promise(resolve => setTimeout(resolve));
      // Assert
      expect(getById(container, /toolTipcallout/i)).toBeDefined();
      expect(getByClass(container, /calloutDateTimeContainer/i)).toBeDefined();
      const xAxisCallOutData = getByClass(container, /calloutContentX/i);
      expect(xAxisCallOutData).toBeDefined();
      expect(xAxisCallOutData[0].textContent).toEqual('5000 ');
      const yAxisCallOutData = getByClass(container, /calloutContentY/i);
      expect(yAxisCallOutData).toBeDefined();
      expect(yAxisCallOutData[0].textContent).toEqual('2,000');
    },
  );

  testWithWait(
    'Should show the callout with string yaxis tooltip data',
    HorizontalBarChartWithAxis,
    { data: chartPointsWithStringYAxis, calloutProps: { doNotLayer: true } },
    async container => {
      // Arrange
      const bars = screen.getAllByText((content, element) => element!.tagName.toLowerCase() === 'rect');
      fireEvent.mouseOver(bars[0]);
      await new Promise(resolve => setTimeout(resolve));
      // Assert
      expect(getById(container, /toolTipcallout/i)).toBeDefined();
      expect(getByClass(container, /calloutDateTimeContainer/i)).toBeDefined();
      const xAxisCallOutData = getByClass(container, /calloutContentX/i);
      expect(xAxisCallOutData).toBeDefined();
      expect(xAxisCallOutData[0].textContent).toEqual('String One ');
      const yAxisCallOutData = getByClass(container, /calloutContentY/i);
      expect(yAxisCallOutData).toBeDefined();
      expect(yAxisCallOutData[0].textContent).toEqual('1,000');
    },
  );
});

describe('Horizontal bar chart with axis - Subcomponent Labels', () => {
  testWithWait(
    'Should render the bars with labels hidden',
    HorizontalBarChartWithAxis,
    { data: chartPoints, hideLabels: true },
    container => {
      // Assert
      expect(getByClass(container, /barLabel/i)).toHaveLength(0);
    },
  );

  testWithWait(
    'Should show y axis label tooltip when showYAxisLablesTooltip is true',
    HorizontalBarChartWithAxis,
    { data: chartPointsWithStringYAxis, showYAxisLablesTooltip: true },
    async container => {
      await new Promise(resolve => setTimeout(resolve));
      // Assert
      expect(getById(container, /showDots/i)).toHaveLength(4);
      expect(getById(container, /showDots/i)[0]!.textContent!).toEqual('Stri...');
    },
  );

  testWithWait(
    'Should expand y axis label when showYAxisLables is true',
    HorizontalBarChartWithAxis,
    { data: chartPointsWithStringYAxis, showYAxisLables: true },
    async container => {
      await new Promise(resolve => setTimeout(resolve));
      // Assert
      expect(screen.queryByText('String One')).not.toBeNull();
      expect(screen.queryByText('String Two')).not.toBeNull();
    },
  );
});

describe('Horizontal bar chart with axis - Screen resolution', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
  });

  const originalInnerWidth = global.innerWidth;
  const originalInnerHeight = global.innerHeight;
  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
    global.innerWidth = originalInnerWidth;
    global.innerHeight = originalInnerHeight;
    act(() => {
      global.dispatchEvent(new Event('resize'));
    });
  });

  testWithWait(
    'Should remain unchanged on zoom in',
    HorizontalBarChartWithAxis,
    { data: chartPoints, width: 300, height: 300 },
    container => {
      global.innerWidth = window.innerWidth / 2;
      global.innerHeight = window.innerHeight / 2;
      act(() => {
        global.dispatchEvent(new Event('resize'));
      });
      // Assert
      expect(container).toMatchSnapshot();
    },
  );

  testWithWait(
    'Should remain unchanged on zoom out',
    HorizontalBarChartWithAxis,
    { data: chartPoints, width: 300, height: 300 },
    container => {
      global.innerWidth = window.innerWidth * 2;
      global.innerHeight = window.innerHeight * 2;
      act(() => {
        global.dispatchEvent(new Event('resize'));
      });
      // Assert
      expect(container).toMatchSnapshot();
    },
  );
});

describe('Horizontal bar chart with axis - Theme', () => {
  test('Should reflect theme change', () => {
    // Arrange
    const { container } = render(
      <ThemeProvider theme={DarkTheme}>
        <HorizontalBarChartWithAxis culture={window.navigator.language} data={chartPoints} />
      </ThemeProvider>,
    );
    // Assert
    expect(container).toMatchSnapshot();
  });
});
