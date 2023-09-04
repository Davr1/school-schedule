/**
 * Simple date serialization (YYYY/MM/DD)
 * @param date The date to serialize
 */
function serializeDate(date: Date) {
    return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
}

export default serializeDate;
