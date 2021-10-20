import { useMemo } from "react";

export const useAge = (year:number,month:number,date:number) => {
  const age : number = useMemo( () => {
      const birthday = {
        year: year,
        month: month,
        date: date
      };
      const today = new Date();
      const thisYearsBirthday = new Date(today.getFullYear(), birthday.month-1, birthday.date);
      let userAge = today.getFullYear() - birthday.year;
      if(today < thisYearsBirthday){
          userAge--;
      }
      return userAge;
  },[year, month, date]);
  return [age];
};
