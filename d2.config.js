/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
    type: 'app',
    id: 'a572f49c-55d2-4427-8d4c-a84975f61781',
    name: 'scoped-data-sharing',
    title: 'Scoped Data Sharing',
    description:
        "Share a defined slice of aggregate data with someone outside your organisation, in a controlled way you can track and revoke. Export it as a CSV, or create a read-only account with a private dashboard, then revoke access from one registry when it is no longer needed.",

    minDHIS2Version: '2.40',

    entryPoints: {
        app: './src/App.tsx',
    },

    dataStoreNamespace: 'dataShareHub',

    direction: 'auto',
}

module.exports = config
