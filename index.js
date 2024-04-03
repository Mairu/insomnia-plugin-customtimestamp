const moment = require('moment');

const hideForSpecificParsable = args => args[0].value === 'specific-parsable';
const hideForNonSpecificParsable = args => args[0].value !== 'specific-parsable';
const hideForNonCustom = args => args[11].value !== 'custom';

const getInputDate = (type, years, months, days, hours, minutes, seconds, milliseconds, parsableDateString, parsingFormat, parsingLocale) => {
    let customDate = new Date();
    switch (type) {
        case 'specific-parsable':
            if (parsableDateString && parsableDateString.length) {
                customDate = moment(parsableDateString, parsingFormat, parsingLocale).toDate();
            }
            break;
        case 'specific':
            if (milliseconds) {
                customDate.setMilliseconds(milliseconds);
            }
            if (seconds) {
                customDate.setSeconds(seconds);
            }
            if (minutes) {
                customDate.setMinutes(minutes);
            }
            if (hours) {
                customDate.setHours(hours);
            }
            if (days) {
                customDate.setDate(days);
            }
            if (months) {
                customDate.setMonth((months) - 1);
            }
            if (years) {
                customDate.setFullYear(years);
            }
            break;
        case 'add':
            if (milliseconds) {
                customDate.setMilliseconds(customDate.getMilliseconds() + parseInt(milliseconds));
            }
            if (seconds) {
                customDate.setSeconds(customDate.getSeconds() + parseInt(seconds));
            }
            if (minutes) {
                customDate.setMinutes(customDate.getMinutes() + parseInt(minutes));
            }
            if (hours) {
                customDate.setHours(customDate.getHours() + parseInt(hours));
            }
            if (days) {
                customDate.setDate(customDate.getDate() + parseInt(days));
            }
            if (months) {
                customDate.setMonth(customDate.getMonth() + parseInt(months));
            }
            if (years) {
                customDate.setFullYear(customDate.getFullYear() + parseInt(years));
            }
            break;
    }
    return customDate;
}

const getOutputDate = (date, dateType, formatStr, locale) => {
    switch (dateType) {
        case 'millis':
        case 'ms':
            return date.getTime() + '';
        case 'unix':
        case 'seconds':
        case 's':
            return Math.round(date.getTime() / 1000) + '';
        case 'iso-8601':
            return date.toISOString();
        case 'custom':
            if (locale) {
                moment.locale(locale);
            }
            return moment(date).format(formatStr);
        default:
            throw new Error(`Invalid date type "${dateType}"`);
    }
}

module.exports.templateTags = [
    {
        name: 'customTimestamp',
        displayName: 'Custom Timestamp',
        description: 'Create a custom timestamp in insomnia rest client',
        liveDisplayName: function (args) {
            const type = args[0].value ?? 'specific';
            const years = args[1].value ?? false;
            const months = args[2].value ?? false;
            const days = args[3].value ?? false;
            const hours = args[4].value ?? false;
            const minutes = args[5].value ?? false;
            const seconds = args[6].value ?? false;
            const milliseconds = args[7].value ?? false;
            const parsableDateString = args[8].value ?? '';
            const parsableFormat = args[9].value;
            const parsingLocale = args[10].value ?? 'en_us';
            const dateType = args[11].value ?? 'iso-8601';
            const formatStr = args[12].value ?? '';
            const locale = args[13].value ?? '';

            const date = getInputDate(type, years, months, days, hours, minutes, seconds, milliseconds, parsableDateString, parsableFormat, parsingLocale);

            let visibleDate = getOutputDate(date, dateType, formatStr, locale);
            let ms;
            switch(dateType) {
                case 'millis':
                case 'ms':
                    ms = true;
              // noinspection FallThroughInSwitchStatementJS
                case 'unix':
                case 'seconds':
                case 's':
                    const timestamp = ms ? date.getTime() : Math.round(date.getTime() / 1000);
                    visibleDate = `${date.toISOString()} => ${timestamp}`;
                    break;
            }

            return `Custom Timestamp => ${visibleDate}`;
        },
        args: [
            { // 0
                displayName: 'Type',
                type: 'enum',
                options: [
                    {
                        displayName: 'Specific parsable date (eg. 2018-01-01T00:00:00Z)',
                        value: 'specific-parsable',
                    },
                    {
                        displayName: 'Specific date (eg. 2018/01/01 00:00:00)',
                        value: 'specific',
                    },

                    {
                        displayName: 'Add time to now (eg. +2days 2hours from now)',
                        value: 'add',
                    }],
            },
            { // 1
                displayName: 'Year/s',
                type: 'string',
                hide: hideForSpecificParsable,
            },
            { // 2
                displayName: 'Month/s',
                type: 'string',
                hide: hideForSpecificParsable,
            },
            { // 3
                displayName: 'Day/s',
                type: 'string',
                hide: hideForSpecificParsable,
            },
            { // 4
                displayName: 'Hour/s',
                type: 'string',
                hide: hideForSpecificParsable,
            },
            { // 5
                displayName: 'Minute/s',
                type: 'string',
                hide: hideForSpecificParsable,
            },
            { // 6
                displayName: 'Second/s',
                type: 'string',
                hide: hideForSpecificParsable,
            },
            { // 7
                displayName: 'Millisecond/s',
                type: 'string',
                hide: hideForSpecificParsable,
            },
            { // 8
                help: 'moment.js parsable date string',
                displayName: 'Parseable Date',
                type: 'string',
                hide: hideForNonSpecificParsable,
            },
            { // 9
                help: 'moment.js parsing format string',
                displayName: 'Custom Parsing Format Template',
                type: 'string',
                placeholder: 'MMMM Do YYYY, h:mm:ss a',
                hide: hideForNonSpecificParsable,
            },
            { // 10
                help: 'moment.js parsable date locale',
                displayName: 'Parsing Locale',
                type: 'string',
                placeholder: 'en_us',
                hide: hideForNonSpecificParsable,
            },
            { // 11
                displayName: 'Timestamp Format',
                type: 'enum',
                options: [
                    {
                        displayName: 'ISO-8601',
                        value: 'iso-8601',
                    },
                    {
                        displayName: 'Milliseconds',
                        value: 'millis',
                    },
                    {
                        displayName: 'Unix',
                        value: 'unix',
                    },
                    {
                        displayName: 'Custom Format',
                        value: 'custom',
                    },
                ],
            },
            { // 12
                help: 'moment.js format string',
                displayName: 'Custom Format Template',
                type: 'string',
                placeholder: 'MMMM Do YYYY, h:mm:ss a',
                hide: hideForNonCustom,
            },
            { // 13
                help: 'moment.js locale',
                displayName: 'Custom Format Locale',
                type: 'string',
                placeholder: 'en_us',
                hide: hideForNonCustom,
            },
        ],
        async run (
          context, type = 'specific', years = false, months = false, days = false, hours = false, minutes = false,
          seconds = false, milliseconds = false, parsableDateString = '', parsingFormat = null, parsingLocale = 'en_us', dateType = 'iso-8601', formatStr = '', locale = '') {

            const customDate = getInputDate(type, years, months, days, hours, minutes, seconds, milliseconds, parsableDateString, parsingFormat, parsingLocale);

            if (typeof dateType === 'string') {
                dateType = dateType.toLowerCase();
            }

            return getOutputDate(customDate, dateType, formatStr, locale);
        },
    }];
