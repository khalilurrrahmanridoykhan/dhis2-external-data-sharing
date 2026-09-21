# External Data Sharing

Share a defined slice of aggregate data with someone outside your organisation, in a controlled way that you can track and revoke.

## What it does

You define what to share: a dataset, data elements, org units, and a date range. Then you choose how to share it:

| Method | What happens | New credential? |
|---|---|---|
| **Export as CSV** | Downloads a CSV of the slice, using your own session. | No |
| **API share** | Creates a read-only DHIS2 account (or attaches the share to an existing one) with read access to the dataset, and builds a private dashboard containing just this data. | Yes: a new account |

Every share is recorded in a registry with its status, so you can see what has been shared, with whom, and revoke it.

## Requirements

- DHIS2 2.40 or later.
- **Export as CSV** needs no extra authority; it runs as you.
- **Creating and revoking API shares** needs the **ALL** or `F_USER_ADD` authority, and you must be able to manage sharing on the dataset. DHIS2 enforces this on the server.
- **Email invites** need email (SMTP) configured on your instance. Otherwise use a one-time temporary password.
- Aggregate datasets only. Tracker and program data are not supported.

## Install

Install from the DHIS2 App Hub, or build the app and upload it:

```bash
yarn install
yarn build        # writes build/bundle/*.zip
```

Then in DHIS2 go to **Apps → App Management → Install app → Upload a ZIP file**.

## Use it

### Export as CSV

1. Choose **Export as CSV**.
2. In the dialog, name the export and pick a **dataset**, the **data elements** to include (or all of them), the **org units**, and a **start and end date**.
3. Choose **Download CSV**.

The file has one row per data value, with the columns `dataElement`, `dataElementName`, `period`, `orgUnit`, `orgUnitName`, `categoryOptionCombo` and `value`. Category option combinations are not summed; each is its own row. Only the org units you select are included, not their children. The export is recorded in the registry.

### Create an API share

1. Choose **API share** (or **Create API share** when the registry is empty).
2. In the dialog, enter a name and optional notes, and define the slice (dataset, data elements, org units, dates) as for a CSV export.
3. Choose the account:
   - **Create a new service account**, delivered either by **email invite** or as a **one-time temporary password**.
   - **Attach to an existing service account** created by this app. No new login is created.
4. Choose **Create share**. For a temporary password, the username and password are shown once and are not saved. **Copy full instructions to send** produces a message for the recipient with the login steps, the dashboard link, and an example API request.

**The recipient has one manual step.** DHIS2 personal access tokens can only be created by the account's own user, so this app cannot create one for them. The recipient logs in, changes the temporary password, opens **Profile → API tokens**, and generates a token. They use it as `Authorization: ApiToken <token>`. When they have done so, open the share and choose **I've done this -- mark Active**. This is a flag you set yourself; the app cannot check whether a token exists.

### Revoke a share

Open the share and choose **Revoke**.

- The account's read access to the dataset is removed, unless another active share on the same account still needs that dataset.
- The share's dashboard is deleted.
- If it was the last active share on the account, you are asked separately whether to disable the account.

**Delete record** removes only the registry entry; it does not change any access. CSV exports have nothing to revoke.

## What an API share grants

- **Read access to the whole dataset** (every data element and period), for the org units the account has, including their children. The data elements and date range you choose do **not** limit what the account can read; they define CSV exports and the recipient's dashboard.
- **New account:** the selected org units are assigned to it, and it gets a role with only the Dashboard and Data Visualizer apps and no data-entry authority.
- **Attached account:** its org units are not changed, so it can only read org units it already has.
- **Dashboard:** private and shared only with that account. It shows a pivot table of the selected data elements (all of the dataset's, if you chose all) for the selected org units over the last 12 months. Data elements that are not numeric are left out, and a share made only of them gets no dashboard.
- A superuser can always see everything, regardless of sharing settings.

The recipient may not be able to open this app from their DHIS2 menu. They do not need to: the dashboard link and instructions are all they use.

## Good to know

- The temporary password is generated in your browser with the Web Crypto API, shown once, and never stored.
- The ALL / `F_USER_ADD` check controls which buttons are shown. The requests themselves are checked by the DHIS2 server.
- The registry is saved as one record, so if two administrators change it at the same moment the last save wins.

## What the app creates on your instance

- Saved shares and one setting, in the data store under the namespace `dataShareHub`.
- For API shares: a user account, a user role named `External Data Sharing - Read Only`, and a dashboard and visualization named `External Data Sharing: <share name>`.

The app makes no calls outside your DHIS2 instance.

## Development

```bash
yarn start        # dev server
yarn test         # unit tests
yarn build        # production bundle
```

Design decisions and the history of how the app reached its current behaviour are in [docs/DEVELOPMENT_NOTES.md](docs/DEVELOPMENT_NOTES.md).

## License

MIT. See [LICENSE](LICENSE).
