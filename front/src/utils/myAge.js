export function myAge(dateStr) {
    const today = new Date();
    const birthDay = new Date(dateStr);

    let age = today.getFullYear() - birthDay.getFullYear();
    const month = today.getMonth() - birthDay.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDay.getDate())) {
        age--;
    }

    return age;
}