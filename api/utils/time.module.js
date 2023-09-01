function convertToUTC(timestampz, seconds) {
    const now = new Date();
    const dateArr = now.toUTCString().split(" ");
    const currentTimestamp = new Date(
        `${dateArr[3]}-${now.getUTCMonth()}-${dateArr[1]} ${
            dateArr[4]
        }:${now.getUTCMilliseconds()}`
    );

    const dateString = timestampz.toUTCString().split(" ");
    const concatTimeStamp = new Date(
        `${dateString[3]}-${timestampz.getUTCMonth()}-${dateString[1]} ${
            dateString[4]
        }:${timestampz.getUTCMilliseconds()}`
    );
    const updated_copy = new Date(concatTimeStamp);
    updated_copy.setSeconds(concatTimeStamp.getSeconds() + seconds);

    return {
        futureTimestamp: updated_copy,
        currentTimestamp: currentTimestamp,
    };
}

module.exports = {
    convertToUTC,
};
