import { parseISO, formatDistanceToNow } from "date-fns";

const TimeAgo =({timestamp}) =>{
    let timeAgo =''
    const date = parseISO(timestamp);
    const timeperiod = formatDistanceToNow(date);

    timeAgo=`${timeperiod} ago`
    return (
        <span title={timestamp}>
            &nbsp; <i>{timeAgo}</i>
        </span>
    )
}

export default TimeAgo;