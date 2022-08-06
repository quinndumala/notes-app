const functions = require("firebase-functions");
const app = require("express")();

const {
  getAllNotes,
  createNewNote,
  deleteNote,
  editNote,
  getNote
} = require("./APIs/notes");
const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails
} = require("./APIs/users");
const auth = require("./util/auth");

app.get("/notes", auth, getAllNotes);
app.get("/note/:noteId", auth, getNote);
app.post("/addNote", auth, createNewNote);
app.delete("/deleteNote/:noteId", auth, deleteNote);
app.put("/updateNote/:noteId", auth, editNote);

app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.post("/user/image", auth, uploadProfilePhoto);
app.get("/user", auth, getUserDetail);
app.post("/user", auth, updateUserDetails);

exports.api = functions.https.onRequest(app);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!!!!!!");
// });
