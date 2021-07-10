const settings = {
    //"botOwner": ["216037365829992448", "388157815136452609", "562086061153583122", "679145795714416661", "436565164674908170"],
    //"defaultPrefix": ">",
    'whitelistedGuilds': ['731520035717251142', '778333835967594517'],
    'errorLogChannel': '789637133878296576',
    'welcomeChannel': '731523552636829697',
    'verificationLogs': '742414095957098631',
    'primaryColor': '#2CA0D3',
    'APIPort': 3909,
    'currency': 'Fur',
    'coinDropProbability': { '10': 2, '9': 4, '8': 5, '7': 7, '6': 9, '5': 11, '4': 13, '3': 15, '2': 16, '1': 18 },
    'prefix': ">",
    'devs': [
        '216037365829992448',
        '388157815136452609',
        '562086061153583122',
        '852070153804972043',
        '436565164674908170',
        '811393103881306123'
    ],
    'owner': '852070153804972043'
};
export const __prod__ = process.env.NODE_ENV === 'production'
export default settings;
