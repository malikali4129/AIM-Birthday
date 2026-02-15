
export const calculateDaysUntil = (birthdayStr: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const birthDate = new Date(birthdayStr);
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }
  
  const diffTime = Math.abs(nextBirthday.getTime() - today.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatBirthday = (dateStr: string): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

export const isToday = (dateStr: string): boolean => {
  const today = new Date();
  const birthDate = new Date(dateStr);
  return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate();
};

export const getAge = (dateStr: string): number => {
  const today = new Date();
  const birthDate = new Date(dateStr);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age + 1; // Age they are turning
};
