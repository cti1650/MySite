import cc from 'classcat';
import type { FC } from 'react';

type ProfListBoxPropsType = {
  profList?: {
    title: string;
    description: string;
  }[];
  className?: string;
};

export const ProfListBox: FC<ProfListBoxPropsType> = ({
  profList,
  className,
}) => {
  return (
    <div className={cc(['w-full flex flex-col', className])}>
      {profList?.map((item) => {
        return (
          <div key={item.title}>
            <div className="text-lg text-gray-800 pt-4">{item.title}</div>
            <div className="pl-4 sm:pl-12 py-2 text-gray-600">
              {item.description}
            </div>
          </div>
        );
      })}
    </div>
  );
};

ProfListBox.defaultProps = {
  profList: [],
};
