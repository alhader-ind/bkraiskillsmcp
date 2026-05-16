---
name: set_up_firebase
description: Documentation and instructions for the internal set_up_firebase tool behavior.
---

# set_up_firebase

Sets up Firebase for the app. This adds a Firestore database and Firebase Authentication.

Use this tool when any of the following conditions are met:
	- The application requires a database (always prefer this over SQLite unless the app's name or description implies that it expects SQL, such as an app named "SQL Explorer App", or if the user explicitly requests to use SQL, or does not want to use firebase)
	- The project will be used by more than one user, or requires user authentication
	- The project requires a serverless, NoSQL architecture
	- The user explicitly requests Firebase

The Firebase setup process always follows these steps:
	- When Firebase is requested, call this tool with 'userConfirmedTermsAcceptedInUI: false', and STOP THE CONVERSATION immediately. This opens the Firebase setup UI for the user to accept terms. Do NOT assume they will approve.
	- Wait for a message indicating the user accepted or declined the terms
		- If they accept, call this tool again with 'userConfirmedTermsAcceptedInUI: true'
		- If they decline, do not call this tool again or implement Firebase code
	- **CRITICAL**: You must always call this tool first with 'userConfirmedTermsAcceptedInUI: false', then STOP and wait for the accept or decline message, then call it again with 'userConfirmedTermsAcceptedInUI: true'. Failing to follow these steps will breach the user's trust and break the application.

When this tool is called with 'userConfirmedTermsAcceptedInUI: true', this tool will:
	- Create a new Firebase Project (or retrieve the current project)
	- Provision Firestore and Firebase Auth
	- Bootstrap initial Firestore and Firebase Auth code scaffolding
	- Bootstrap firebase-blueprint.json (the database structure) and firestore.rules files
	- If there are any errors, do not bootstrap any Firebase files.
	- When the provisioning is complete, give the user a link to their database in the Firebase console, which is in the format of 'https://console.firebase.google.com/project/<project-id>/firestore/databases/<firestore-database-id>/data' from their firebase-applet-config.json file.

When 'userConfirmedTermsAcceptedInUI: true', the Firebase project will be provisioned in the same Cloud project as the AI Studio app, which is the default behavior. The user may specify a different Firebase project ID to use for provisioning via the 'FirebaseProjectID' argument. The user may specify a cloud region for the Firestore Database via the 'firestoreRegion' argument. The user may specify a database ID for the Firestore Database via the 'databaseId' argument. It is valid to omit all three of these optional arguments. Setting the 'FirebaseProjectID', 'firestoreRegion', or 'databaseId' argument when 'userConfirmedTermsAcceptedInUI: false' has no effect.

This tool can be called multiple times if the user requests it. Calling it again with 'userConfirmedTermsAcceptedInUI: false' will show the Firebase setup UI again, and calling it again with 'userConfirmedTermsAcceptedInUI: true' will re-provision Firebase and rewrite the firebase-applet-config.json file.

## Parameters

- `FirebaseProjectID` (STRING, optional): Optional Firebase project ID to use for the app. Defaults to empty.
- `databaseId` (STRING, optional): Optional. The ID to use for the Firestore database. Only takes effect when 'userConfirmedTermsAcceptedInUI: true'. Defaults to empty.
- `firestoreRegion` (STRING, optional): Optional. The ID of the cloud region to provision the Firestore database in. Only takes effect when 'userConfirmedTermsAcceptedInUI: true'. Defaults to empty.
- `userConfirmedTermsAcceptedInUI` (BOOLEAN, optional): Set to true if the user accepted Firebase terms in the Firebase setup UI. Set to false to show the Firebase setup UI first. Defaults to false.
- `toolAction` (STRING, required): Brief 2-5 word summary of what this tool is doing. Capitalize like a sentence. Some examples: 'Analyzing directory', 'Searching the web', 'Editing file', 'Viewing file', 'Running command', 'Semantic searching'.
- `toolSummary` (STRING, required): Brief 2-5 word noun phrase describing what this tool call is about. Capitalize like a sentence. Some examples: 'Directory analysis', 'Web search', 'File edit', 'Command execution', 'Semantic search'.
