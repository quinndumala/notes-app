const { db } = require("../util/admin");

exports.getAllNotes = (request, response) => {
  db.collection("notes")
    .where("username", "==", request.user.username)
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let notes = [];
      data.forEach((doc) => {
        notes.push({
          noteId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          createdAt: doc.data().createdAt
        });
      });
      return response.json(notes);
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).json({ error: error.code });
    });
};

exports.getNote = (request, response) => {
  db.doc(`notes/${request.params.noteId}`)
    .get()
    .then((data) => {
      return response.json(data);
    })
    .catch((error) => {
      console.error(error);
      return response
        .status(500)
        .json({ message: "Something went wrong. Could not find record." });
    });
};

exports.createNewNote = (request, response) => {
  if (request.body.body.trim() === "") {
    return response.status(400).json({ body: "Must not be empty" });
  }

  if (request.body.title.trim() === "") {
    return response.status(400).json({ title: "Must not be empty" });
  }

  const newNote = {
    title: request.body.title,
    body: request.body.body,
    username: request.user.username,
    createdAt: new Date().toISOString()
  };

  db.collection("notes")
    .add(newNote)
    .then((doc) => {
      const responseNewNote = newNote;
      responseNewNote.id = doc.id;
      return response.json(responseNewNote);
    })
    .catch((error) => {
      response.status(500).json({ error: "Something went wrong." });
      console.error(error);
    });
};

exports.deleteNote = (request, response) => {
  const document = db.doc(`/notes/${request.params.noteId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        console.log("request.params.noteId: ", request.params.noteID);
        return response.status(404).json({ error: "Record not found" });
      }
      if (doc.data().username !== request.user.username) {
        return response.status(403).json({ error: "UnAuthorized" });
      }
      return document.delete();
    })
    .then(() => {
      response.json({ message: "Successfully Deleted!" });
    })
    .catch((error) => {
      console.error(error);
      return response
        .status(500)
        .json({ error: `Something went wrong: ${error.code}` });
    });
};

exports.editNote = (request, response) => {
  if (request.body.noteId || request.body.createdAt) {
    response.status(403).json({ message: "Not allowed to edit record." });
  }

  let document = db.collection("notes").doc(`${request.params.noteId}`);

  document
    .update(request.body)
    .then(() => {
      response.json({ message: "Successfully Updated" });
    })
    .catch((error) => {
      console.error(error);
      return response
        .status(500)
        .json({ error: `Something went wrong: ${error.code}` });
    });
};
