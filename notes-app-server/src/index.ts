import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// app.get("/api/notes", async (req, res) => {
//   const notes = await prisma.note.findMany();

//   res.json(notes);
// });

app.get("/api/notes", async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        status: 'Active',
      },
    });
    res.json(notes);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});


app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send("title and content fields required");
  }

  try {
    const note = await prisma.note.create({
      data: { title, content },
    });
    res.json(note);
  } catch (error) {
    res.status(500).send("Oops something went wrong");
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if (!title || !content) {
    return res.status(400).send("title and content fields required");
  }

  if (!id || isNaN(id)) {
    return res.status(400).send("ID must be a valid number");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("oops, something went wrong");
  }
});

// app.delete("/api/notes/:id", async (req, res) => {
//   const id = parseInt(req.params.id);

//   if (!id || isNaN(id)) {
//     return res.status(400).send("ID field required");
//   }

//   try {
//     await prisma.note.delete({
//       where: { id },
//     });
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).send("oops, something went wrong");
//   }
// });

app.delete("/api/notes/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).send("ID field required");
  }

  try {
    await prisma.note.update({
      where: { id },
      data: { status: "Inactive" },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

app.get("/api/notes/deleted", async (req, res) => {
  try {
    const deletedNotes = await prisma.note.findMany({
      where: {
        status: "Inactive",
      },
    });
    res.json(deletedNotes);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

// Restore a deleted note by setting its status back to 'Active'
app.put("/api/notes/restore/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (!id || isNaN(id)) {
    return res.status(400).send("ID field required and must be a valid number");
  }

  try {
    const restoredNote = await prisma.note.update({
      where: { id },
      data: { status: "Active" },
    });

    res.json(restoredNote);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});



app.listen(5050, () => {
  console.log("server running on localhost:5050");
});
