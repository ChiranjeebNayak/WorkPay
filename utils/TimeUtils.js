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