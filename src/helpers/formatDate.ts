const formatDate = (date: number) => {
    let newDate = new Date(date * 1000);
    // Hours part from the timestamp
    let hours = newDate.getHours();
    // Minutes part from the timestamp
    let minutes = "0" + newDate.getMinutes();
    // Seconds part from the timestamp
    let seconds = "0" + newDate.getSeconds();

    // Will display time in 10:30:23 format
    return hours + ':' + minutes.substring(-2) + ':' + seconds.substring(-2);
};

export default formatDate;