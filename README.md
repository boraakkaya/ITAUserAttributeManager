## ita-user-attribute-manager

This is where you include your WebPart documentation.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO

### Reference Links
Graph API Direct Reports
Request URL : https://graph.microsoft.com/v1.0/me/directReports
Returns Object: {
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#directoryObjects",
    "value": [
        {
            "@odata.type": "#microsoft.graph.user",
            "id": "eb3b7afb-4913-4b7b-9cc1-a1a8cdcd8616",
            "businessPhones": [
                "+1 111-222-3344"
            ],
            "displayName": "John Doe",
            "givenName": "John",
            "jobTitle": "SharePoint Tester",
            "mail": "johndoe@boraakkaya.onmicrosoft.com",
            "mobilePhone": null,
            "officeLocation": "12100",
            "preferredLanguage": "en-US",
            "surname": "Doe",
            "userPrincipalName": "johndoe@boraakkaya.onmicrosoft.com"
        }
    ]
}
