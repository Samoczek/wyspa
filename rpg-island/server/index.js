const PORT = 8000;
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const uri =
  "mongodb+srv://TTRPG:TTRPG@ttrpg.41ndrag.mongodb.net/TTRPG?retryWrites=true&w=majority";

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

// Sign up to the Database
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
      return res.status(409).send("User already exists. Please login");
    }

    const sanitizedEmail = email.toLowerCase();

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword,
    };

    const insertedUser = await users.insertOne(data);

    const token = jwt.sign(insertedUser, sanitizedEmail, {
      expiresIn: 60 * 24,
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

    // Usuń ogłoszenie
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

// Endpoint do danych jednego ogłoszenia
app.get("/onePost/:id", async (req, res) => {
  const client = new MongoClient(uri);
  const postId = req.params.id;
  console.log(postId)

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

// Dodatkowo, dodaj kod do obsługi błędów, jeśli nie jest jeszcze dodany
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Dodatkowo, dodaj kod do obsługi błędów, jeśli nie jest jeszcze dodany
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Log in to the Database
app.post("/login", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const user = await users.findOne({ email });
    const correctPassword = await bcrypt.compare(
      password,
      user.hashed_password
    );

    if (user && correctPassword) {
      const token = jwt.sign(user, email, {
        expiresIn: 60 * 24,
      });
      res.status(201).json({ token, userId: user.user_id });
    }

    res.status(400).json("Invalid Credentials");
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

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

// Get all Users by userIds in the Database
app.get("/users", async (req, res) => {
  const client = new MongoClient(uri);
  //const userIds = JSON.parse(req.query.userIds)

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    //const pipeline =
    //    [
    //        {
    //            '$match': {
    //                'user_id': {
    //                    '$in': userIds
    //                }
    //            }
    //        }
    //    ]

    const foundUsers = await users.find().toArray();

    res.json(foundUsers);
  } finally {
    await client.close();
  }
});

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

app.put("/post", async (req, res) => {
  const client = new MongoClient(uri);
  const formData2 = req.body.formData2;

  try {
    await client.connect();
    const database = client.db("app-data");
    const posts = database.collection("post");

    // Usuń puste pola z obiektu `updateDocument`
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

    // Generuj nowe generatedPostId tylko dla nowych postów
    updateDocument.generatedPostId = formData2.generatedPostId || uuidv4();

    const result = await posts.insertOne(updateDocument);

    res.json(result);
  } finally {
    await client.close();
  }
});

app.get("/posts", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const posts = database.collection("post");

    // Pobierz ogłoszenia, posortowane według daty_dodania w malejącej kolejności
    const sortedPosts = await posts.find().sort({ data_dodania: -1 }).toArray();

    res.json(sortedPosts);
  } finally {
    await client.close();
  }
});

app.get("/myposts", async (req, res) => {
  const userId = req.cookies.UserId;

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const posts = database.collection("post");

    // Pobierz ogłoszenia tylko dla danego użytkownika
    const userPosts = await posts
      .find({ user_id: userId })
      .sort({ data_dodania: -1 })
      .toArray();

    res.json(userPosts);
  } finally {
    await client.close();
  }
});

///// nowe

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

    // console.log(myApplications)

    res.json(myApplications);
  } finally {
    await client.close();
  }
});

app.get("/myapplicatedpost/:postId", async (req, res) => {
  const postId = req.params.postId;

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const posts = database.collection("post");

    // Pobierz ogłoszenia tylko dla danego użytkownika
    const userPosts = await posts.find({ _id: new ObjectId(postId) }).toArray();

    res.json(userPosts);
  } finally {
    await client.close();
  }
});

//// nowe

// Get Messages by from_userId and to_userId
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

// Add a Message to our Database
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

app.get("/profile", async (req, res) => {
  const client = new MongoClient(uri);
  const userIds = JSON.parse(req.query.userIds);

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const pipeline = [
      {
        $match: {
          user_id: {
            $in: userIds,
          },
        },
      },
    ];

    const foundUsers = await users.aggregate(pipeline).toArray();

    res.json(foundUsers);
  } finally {
    await client.close();
  }
});

///////////////////////////////////////////////////////////

// Endpoint do zapisywania użytkownika do ogłoszenia
app.post("/apply", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const applications = database.collection("applications");

    const { postId, userId, postname, postUserId } = req.body;

    // Sprawdź, czy użytkownik już jest zapisany do tego ogłoszenia
    const existingApplication = await applications.findOne({ postId, userId });

    if (existingApplication) {
      return res
        .status(409)
        .json({ message: "Użytkownik już zapisany do tego ogłoszenia." });
    }

    // Zapisz użytkownika do ogłoszenia
    await applications.insertOne({ postId, userId, postname, postUserId });

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

    // Pobierz zapisanych użytkowników dla danego ogłoszenia
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

    // Sprawdź, czy postId jest poprawnym ObjectId
    if (!ObjectId.isValid(postId)) {
      console.log("Nieprawidłowy ObjectId.");
      return res.status(400).json({ message: "Nieprawidłowy ObjectId." });
    }

    // Znajdź ogłoszenie o danym ID
    const post = await database
      .collection("post")
      .findOne({ _id: new ObjectId(postId) });

    if (!post) {
      console.log("Ogłoszenie nie zostało znalezione.");
      return res
        .status(404)
        .json({ message: "Ogłoszenie nie zostało znalezione." });
    }

    // Pobierz zgłoszenia użytkowników
    const applicants = await applicantsCollection
      .find({ postId: post._id.toString() })
      .toArray();

    // Pobierz zgłoszenia z identycznym userId z kolekcji users
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

app.listen(PORT, () => console.log("server running on PORT " + PORT));
