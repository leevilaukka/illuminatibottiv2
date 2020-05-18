const formatDate = date => {
    let newDate = new Date(date * 1000);
    // Hours part from the timestamp
    let hours = newDate.getHours() + 3;
    // Minutes part from the timestamp
    let minutes = "0" + newDate.getMinutes();
    // Seconds part from the timestamp
    let seconds = "0" + newDate.getSeconds();

    // Will display time in 10:30:23 format
    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
};

module.exports = formatDate;