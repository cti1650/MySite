import { useMemo, useState, useEffect } from "react";

export const useAge = (year,month,date) => {
  const age = useMemo( () => {
      const birthday = {
        year: year,
        month: month,
        date: date
      };
      const today = new Date();
      const thisYearsBirthday = new Date(today.getFullYear(), birthday.month-1, birthday.date);
      const _age = today.getFullYear() - birthday.year;
      if(today < thisYearsBirthday){
          _age--;
      }
      return _age;
  },[year, month, date]);
  return {year, month, date, age};
};
