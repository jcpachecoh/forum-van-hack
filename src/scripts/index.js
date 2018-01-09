import * as moment from 'moment';

const formatDateString = 'MMMM Do YYYY, h:mm:ss a';

export function formatDate(val) {
    return moment(val).format(formatDateString);
}