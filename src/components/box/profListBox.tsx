import React from "react";
import cc from "classcat";

type ProfListBoxPropsType = {
  profList?: {
    title: string,
    description: string,
  }[],
  className?: string,
}

export const ProfListBox = ({ profList, className }: ProfListBoxPropsType) => {
  return (
    <>
      <div className={cc(["w-full flex flex-col", className])}>
        {profList && profList.map(item => {
          return (
            <div key={item.title}>
              <div className="text-lg text-gray-800 pt-4">{item.title}</div>
              <div className="pl-12 py-2 text-gray-600">{item.description}</div>
            </div>
          )
        })}
      </div>
    </>
  );
}

ProfListBox.defaultProps = {
  profList: []
}