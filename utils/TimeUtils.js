

const months = [
  { number: 1, name: "January" },
  { number: 2, name: "February" },
  { number: 3, name: "March" },
  { number: 4, name: "April" },
  { number: 5, name: "May" },
  { number: 6, name: "June" },
  { number: 7, name: "July" },
  { number: 8, name: "August" },
  { number: 9, name: "September" },
  { number: 10, name: "October" },
  { number: 11, name: "November" },
  { number: 12, name: "December" },
];

export  const getTotalDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

export const countPresentDays = (data) => {
  return data?.filter(item => item.status === "PRESENT" || item.status === "LATE").length;
};

export const countAbsentDays = (data) => {
  return data?.filter(item => item.status === "ABSENT").length;
};

export const calculateTotalOvertime = (data) => {
  return data?.reduce((total, item) => total + (item.overTime), 0) / 60;
}


export function formatMinutesToHHMM(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}


export function calculateHoursManual(checkin, checkout) {
    if (!checkin || !checkout) return "00:00"; // fallback when data not ready

    function parseTime(timeStr) {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        
        let hour24 = hours;
        if (period.toLowerCase() === 'pm' && hours !== 12) {
            hour24 += 12;
        } else if (period.toLowerCase() === 'am' && hours === 12) {
            hour24 = 0;
        }
        
        return hour24 * 60 + minutes; // total minutes
    }
    
    const checkinMinutes = parseTime(checkin);
    const checkoutMinutes = parseTime(checkout);

    let diffMinutes = checkoutMinutes - checkinMinutes;

    if (diffMinutes < 0) diffMinutes += 24 * 60; // overnight shift

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}



export function formatDay(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()].name;
  return `${day} ${month}`;
}

export function formatTime(dateString) {
  if (!dateString) return "—";

  // Remove Z so JS doesn’t convert
  const localString = dateString.replace("Z", "");
  const date = new Date(localString);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  let h = hours % 12 || 12;
  let m = minutes.toString().padStart(2, "0");
  const ampm = hours < 12 ? "AM" : "PM";

  return `${h}:${m} ${ampm}`;
}

export function calculateTotalHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return "0h";
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffMs = end - start;
  if (diffMs <= 0) return "0h";
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

export function convertOvertime(minutes) {
  if (!minutes || minutes === 0) return "0h";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}