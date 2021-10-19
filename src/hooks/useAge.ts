import { useMemo, useState, useEffect } from "react";

export const useAge = (year,month,date) => {
  const [ age,setAge ] = useState(null);
  const getAge = useMemo(()=>{(birthday){
      const today = new Date();
      const thisYearsBirthday = new Date(today.getFullYear(), birthday.month-1, birthday.date);
      const age = today.getFullYear() - birthday.year;
      if(today < thisYearsBirthday){
          age--;
      }
      return age;
  },[]);
  useEffect(()=>{
    setAge({
      year: year,
      month: month,
      date: date
    });
  },[year,month,date]);
  return {year,month,dateage};
};
