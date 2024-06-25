const PORT = 8000;
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const uri = process.env.URI

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

// Default
app.get("/", (req, res) => {
  res.json("Hello to my app");
});

// Endpoint do rejestracji nowego użytkownika
app.post("/signup", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  const generatedUserId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(409).send("Użytkownik o takich danych już istnieje. Zaloguj się!");
    }

    const sanitizedEmail = email.toLowerCase();

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword,
    };

    const insertedUser = await users.insertOne(data);

    const token = jwt.sign(insertedUser, sanitizedEmail, {
      expiresIn: '1d', // Token wygasa po 1 dniu
    });
    res.status(201).json({ token, userId: generatedUserId });
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

// Endpoint do usuwania ogłoszenia
app.delete("/post/:id", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    const postId = req.params.id;
    await client.connect();
    const database = client.db("app-data");
    const post = database.collection("post");

    await post.deleteOne({ _id: new ObjectId(postId) });

    res.status(200).json({ message: "Ogłoszenie zostało usunięte pomyślnie." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Wystąpił błąd podczas usuwania ogłoszenia." });
  } finally {
    await client.close();
  }
});

// Endpoint do odczytywania danych jednego ogłoszenia
app.get("/onePost/:id", async (req, res) => {
  const client = new MongoClient(uri);
  const postId = req.params.id;

  try {
    await client.connect();
    const database = client.db("app-data");
    const post = database.collection("post");

    const onePost = await post.findOne({ _id: new ObjectId(postId) });

    res.send(onePost);
  } finally {
    await client.close();
  }
});


// Endpoint do logowania
app.post("/login", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const normalizedEmail = email.toLowerCase();
    
    const user = await users.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json("Nieprawidłowe dane uwierzytelniające");
    }

    if (user.blocked) {
      return res.json({ blocked: true });
    }    

    const correctPassword = await bcrypt.compare(password, user.hashed_password);

    if (correctPassword) {
      const token = jwt.sign({ user_id: user.user_id }, normalizedEmail, {
        expiresIn: '1d', // Token wygasa po 1 dniu
    });
    
      res.status(201).json({ token, userId: user.user_id });
    } else {
      res.status(400).json("Nieprawidłowe dane uwierzytelniające");
    }
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

// Endpoint do pobrania danych użytkownika z bazy
app.get("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.query.userId;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: userId };
    const user = await users.findOne(query);
    res.send(user);
  } finally {
    await client.close();
  }
});

// Endpoint do pobrania danych użytkowników z bazy
app.get("/users", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const foundUsers = await users.find().toArray();

    res.json(foundUsers);
  } finally {
    await client.close();
  }
});

// Endpoint do dodawania/edycji danych profilu użytkownika
app.put("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const formData = req.body.formData;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: formData.user_id };

    // Usuń puste pola z obiektu `updateDocument`
    const updateDocument = {};
    for (const field in formData) {
      if (
        formData[field] !== undefined &&
        formData[field] !== null &&
        formData[field] !== ""
      ) {
        updateDocument[field] = formData[field];
      }
    }

    const result = await users.updateOne(query, { $set: updateDocument });

    res.json(result);
  } finally {
    await client.close();
  }
});

// Endpoint do usuwania użytkownika
app.delete("/user/:userId", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const userId = req.params.userId;

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Nieprawidłowy format identyfikatora użytkownika." });
    }

    const existingUser = await users.findOne({ _id: new ObjectId(userId) });
    if (!existingUser) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony." });
    }

    const deletionResult = await users.deleteOne({ _id: new ObjectId(userId) });

    if (deletionResult.deletedCount === 1) {
      res.json({ message: "Użytkownik został pomyślnie usunięty." });
    } else {
      res.status(500).json({ message: "Wystąpił problem podczas usuwania użytkownika." });
    }
  } finally {
    await client.close();
  }
});

// Endpoint do blokowania kont użytkowników
app.patch("/toggleblock/:userId", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const userId = req.params.userId;

    const existingUser = await users.findOne({ _id: new ObjectId(userId) });
    if (!existingUser) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony." });
    }

    const newBlockStatus = !existingUser.blocked;
    await users.updateOne({ _id: new ObjectId(userId) }, { $set: { blocked: newBlockStatus } });

    const actionMessage = newBlockStatus ? "zablokowany" : "odblokowany";
    res.json({ message: `Użytkownik został ${actionMessage} pomyślnie.` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Wystąpił problem podczas zmiany statusu blokady użytkownika." });
  } finally {
    await client.close();
  }
});

// Endpoint do dodawania ogłoszenia
app.put("/post", async (req, res) => {
  const client = new MongoClient(uri);
  const formData2 = req.body.formData2;

  try {
    await client.connect();
    const database = client.db("app-data");
    const posts = database.collection("post");

    const updateDocument = {};
    for (const field in formData2) {
      if (
        formData2[field] !== undefined &&
        formData2[field] !== null &&
        formData2[field] !== ""
      ) {
        updateDocument[field] = formData2[field];
      }
    }

    updateDocument.generatedPostId = formData2.generatedPostId || uuidv4();

    const result = await posts.insertOne(updateDocument);

    res.json(result);
  } finally {
    await client.close();
  }
});

// Endpoint do aktualizowania ogłoszenia
app.put("/postedit/:postId", async (req, res) => {
  const client = new MongoClient(uri);
  const postId = req.params.postId;
  const formData2 = req.body.formData2;

  try {
    await client.connect();
    const database = client.db("app-data");
    const posts = database.collection("post");

    const existingPost = await posts.findOne({ _id: new ObjectId(postId) });

    if (existingPost) {
      const updateDocument = {};
      for (const field in formData2) {
        if (
          formData2[field] !== undefined &&
          formData2[field] !== null &&
          formData2[field] !== ""
        ) {
          updateDocument[field] = formData2[field];
        }
      }

      const result = await posts.updateOne({ _id: new ObjectId(postId) }, { $set: updateDocument });
      res.json(result);
    } else {
      res.status(400).json({ error: "Post o podanym Id nie istnieje." });
    }

  } finally {
    await client.close();
  }
});

// Endpoint do pobierania ogłoszeń z bazy
app.get("/posts", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const posts = database.collection("post");

    const currentDate = new Date();
    const currentDateISO = currentDate.toISOString().split('T')[0];

    const validPosts = await posts.find({ termin_sesji: { $gte: currentDateISO } }).sort({ data_dodania: -1 }).toArray();


    res.json(validPosts);
  } finally {
    await client.close();
  }
});

// Endpoint do pobierania wszystkich ogłoszeń z bazy dla administratora
app.get("/adminposts", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const posts = database.collection("post");

    const validPosts = await posts.find().sort({ data_dodania: -1 }).toArray();


    res.json(validPosts);
  } finally {
    await client.close();
  }
});

// Endpoint do pobierania postów danego użytkownika
app.get("/myposts", async (req, res) => {
  const userId = req.cookies.UserId;

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const posts = database.collection("post");

    const userPosts = await posts
      .find({ user_id: userId })
      .sort({ data_dodania: -1 })
      .toArray();

    res.json(userPosts);
  } finally {
    await client.close();
  }
});

// Endpoint do pobierania zgłoszeń użytkownika
app.get("/myapplications", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.cookies.UserId;

  try {
    await client.connect();
    const database = client.db("app-data");
    const applications = database.collection("applications");

    const myApplications = await applications
      .find({ userId: userId })
      .toArray();


    res.json(myApplications);
  } finally {
    await client.close();
  }
});

// Endpoint do pobierania ogłoszeń, do których zgłosił się użytkownik
app.get("/myapplicatedpost/:postId", async (req, res) => {
  const postId = req.params.postId;

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const posts = database.collection("post");

    const userPosts = await posts.find({ _id: new ObjectId(postId) }).toArray();

    res.json(userPosts);
  } finally {
    await client.close();
  }
});

// Endpoint do pobierania wiadomości
app.get("/messages", async (req, res) => {
  const { userId, correspondingUserId } = req.query;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const messages = database.collection("messages");

    const query = {
      $or: [
        { from_userId: userId, to_userId: correspondingUserId },
        { from_userId: correspondingUserId, to_userId: userId },
      ],
    };

    const foundMessages = await messages.find(query).toArray();
    res.send(foundMessages);
  } finally {
    await client.close();
  }
});

// Endpoint do wysyłania wiadomości
app.post("/message", async (req, res) => {
  const client = new MongoClient(uri);
  const message = req.body.message;

  try {
    await client.connect();
    const database = client.db("app-data");
    const messages = database.collection("messages");

    const insertedMessage = await messages.insertOne(message);
    res.send(insertedMessage);
  } finally {
    await client.close();
  }
});

// Endpoint do zapisywania użytkownika do ogłoszenia
app.post("/apply", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const applications = database.collection("applications");

    const { postId, userId, postname, postUserId, postscenario, postdate } = req.body;

    const existingApplication = await applications.findOne({ postId, userId });

    if (existingApplication) {
      return res
        .status(409)
        .json({ message: "Użytkownik już zapisany do tego ogłoszenia." });
    }

    await applications.insertOne({ postId, userId, postname, postUserId, postscenario, postdate });

    res
      .status(201)
      .json({ message: "Zapisano użytkownika do ogłoszenia pomyślnie." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Wystąpił błąd podczas zapisywania użytkownika do ogłoszenia.",
    });
  } finally {
    await client.close();
  }
});

// Endpoint do pobierania zapisanych użytkowników dla danego ogłoszenia
app.get("/applications", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const applications = database.collection("applications");

    const { postId } = req.query;

    const savedUsers = await applications.find({ postId }).toArray();

    res.status(200).json(savedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Wystąpił błąd podczas pobierania zapisanych użytkowników.",
    });
  } finally {
    await client.close();
  }
});

// Endpoint do pobierania zgłoszeń użytkowników dla danego ogłoszenia
app.get("/applicants/:postId", async (req, res) => {
  const client = new MongoClient(uri);
  const postId = req.params.postId;

  try {
    await client.connect();

    const database = client.db("app-data");
    const applicantsCollection = database.collection("applications");

    if (!ObjectId.isValid(postId)) {
      console.log("Nieprawidłowy ObjectId.");
      return res.status(400).json({ message: "Nieprawidłowy Id." });
    }

    const post = await database
      .collection("post")
      .findOne({ _id: new ObjectId(postId) });

    if (!post) {
      console.log("Ogłoszenie nie zostało znalezione.");
      return res
        .status(404)
        .json({ message: "Ogłoszenie nie zostało znalezione." });
    }

    const applicants = await applicantsCollection
      .find({ postId: post._id.toString() })
      .toArray();

    const users = [];
    for (const applicant of applicants) {
      const user = await database
        .collection("users")
        .findOne({ user_id: applicant.userId });
      if (user) {
        users.push(user);
      }
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Wystąpił błąd:", error);
    res.status(500).json({
      message: "Wystąpił błąd podczas pobierania zgłoszeń użytkowników.",
    });
  } finally {
    await client.close();
  }
});

// Endpoint do usuwania aplikacji
app.delete('/deleteApplication/:id', async (req, res) => {
  const client = new MongoClient(uri);
  const idToDelete = req.params.id;

  try {
    await client.connect();
    const database = client.db("app-data");
    const applications = database.collection("applications");

    await applications.deleteOne({ _id: new ObjectId(idToDelete) });

    res.status(200).json({ message: "Aplikacja została pomyślnie usunięta." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas usuwania ogłoszenia." });
  } finally {
    await client.close();
  }
});


app.listen(PORT, () => console.log("server running on PORT " + PORT));
