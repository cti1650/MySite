import cc from 'classcat';
import type { FC } from 'react';

type TitleBoxPropsType = {
  title?: string;
  subTitle?: string;
  size?: 'small' | 'middle' | 'big';
  color?: 'black' | 'white' | 'blue' | 'red';
};

const getOptionSize = (size: 'small' | 'middle' | 'big') => {
  const SizeList = {
    small: {
      panelSize: 'w-2/3 px-2 py-3',
      title: 'text-sm py-4',
      subtitle: 'text-xs pb-4',
      barwidth: 'w-2.5',
      barheight: 'h-0.5',
    },
    middle: {
      panelSize: 'w-2/3 px-2 py-4',
      title: 'text-xl py-4',
      subtitle: 'text-sm pb-4',
      barwidth: 'w-4',
      barheight: 'h-0.5',
    },
    big: {
      panelSize: 'w-4/5 px-2.5 py-6',
      title: 'text-4xl py-4',
      subtitle: 'text-sm pb-4',
      barwidth: 'w-6',
      barheight: 'h-1',
    },
  };
  return SizeList[size];
};
const getOptionColor = (color: 'black' | 'white' | 'blue' | 'red') => {
  const ColorList = {
    black: {
      panelColor: '',
      textColor: 'text-black',
      barColor: 'bg-black',
    },
    white: {
      panelColor: '',
      textColor: 'text-gray-50',
      barColor: 'bg-gray-50',
    },
    blue: {
      panelColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      barColor: 'bg-blue-700',
    },
    red: {
      panelColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      barColor: 'bg-red-600',
    },
  };
  return ColorList[color];
};

export const TitleBox: FC<TitleBoxPropsType> = ({
  title = 'Title',
  subTitle = '',
  size = 'middle',
  color = 'blue',
}) => {
  const sizeOption = getOptionSize(size);
  const colorOption = getOptionColor(color);
  return (
    <div
      className={cc([
        'flex flex-col h-auto',
        colorOption.panelColor,
        sizeOption.panelSize,
      ])}
    >
      <div
        className={cc([
          'h-full w-full flex flex-row tracking-wider',
          colorOption.textColor,
          sizeOption.title,
        ])}
      >
        <p
          className={cc([
            'flex-none my-auto mr-3',
            colorOption.barColor,
            sizeOption.barwidth,
            sizeOption.barheight,
          ])}
        ></p>
        <p className="flex-grow mx-0 my-auto whitespace-pre-wrap break-all">
          {title}
        </p>
      </div>
      {subTitle && (
        <div
          className={cc([
            'h-full w-full flex flex-row tracking-wider',
            colorOption.textColor,
            sizeOption.subtitle,
          ])}
        >
          <p
            className={cc(['flex-none my-auto mr-3', sizeOption.barwidth])}
          ></p>
          <p className="flex-grow mx-0 my-auto whitespace-pre-wrap break-all">
            {subTitle}
          </p>
        </div>
      )}
    </div>
  );
};
