import { useMemo } from "react";

export const useAge = (year,month,date) => {
  const age = useMemo( () => {
      const birthday = {
        year: year,
        month: month,
        date: date
      };
      const today = new Date();
      const thisYearsBirthday = new Date(today.getFullYear(), birthday.month-1, birthday.date);
      const userAge = today.getFullYear() - birthday.year;
      if(today < thisYearsBirthday){
          userAge--;
      }
      return userAge;
  },[year, month, date]);
  return {year, month, date, age};
};
