
export const getTimeDescFromNow = (msTime?: number | null): string => {
    if (msTime === undefined || msTime === null) {
        return "";
    }
    const nowMsTime = (new Date()).getTime();
    const msDiff = nowMsTime - msTime;
    const hourMsTime = 3600 * 1000;
    const dayMsTime = 24 * 3600 * 1000;
    if (msDiff < dayMsTime) {
        return `${(msDiff / hourMsTime).toFixed(0)}小时前`;
    } else {
        return `${(msDiff / dayMsTime).toFixed(0)}天前`;
    }
}