import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    const snapshot = await admin.database().ref('/messages').push({original: original});
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref.toString());
  });


  exports.userCreated = functions.auth.user().onCreate((user) => {
    const db = admin.firestore();
    const docReff = db.collection("users").doc(user.uid);
    docReff.get().then(function (doc) {
        if (!doc.exists) {
            db.collection("emails").add({
                uid: user.uid,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                email:user.email,
                emailType:'welcome'
            })
                .then(function (docRef) {
                // Great.
                console.log("Document written with ID: ", docRef.id);
                // send email notificatiin.
                // const mailOptions = {
                //     from: `<noreply@trenday-pay.com>`,
                //     to: user.email,
                //     subject: "Welcome to Trendy-pal",
                //     html: "hello world"
                // };
                //  mailTransport.sendMail(mailOptions);
                return null;
            })
                .catch(function (error) {
                // why like this :(
                console.error("Error adding document: ", error);
                return null;
            });
            return null;
        }
        else {
            // doc.data() will be undefined in this case
            console.log("Already Exist");
            return null;
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
        return null;
    });
    return null;
});

