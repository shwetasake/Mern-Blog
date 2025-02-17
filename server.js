
const express = require('express'); //here we are tellling node to load the express library or the express framework
const app = express();
const {MongoClient} = require("mongodb");
const PORT = process.env.PORT || 8000;




// const articleInfo ={
//     "learn-react":{
//         comments:[],
//     },
//     "learn-node":{
//         comments:[],
//     },
//     "my-thoughts-on-learning-react":{
//         comments:[],
//     }
// }

/*
Initialize middleware
we use to have to install body parser but now it is a built in middleware
function of express. it parses incoming JSON payload
*/

app.use(express.json({extended: false}))

//app.get(path,callback function). req is going to all whenever it receives the http request to this part,and its going to send both req and res info to our function handling this request.
//get request is used to get information from the server such as article content,user info
//post request is used to modify on the server, such as if you want to add a comment to an article or change username

//this is just test routes for now
/*
app.get("/", (req,res) => res.send("hello world")) ;
app.post("/", (req,res) => res.send(`Hello ${req.body.name}`));
app.get("/hello/:name", (req,res) => res.send(`Hello ${req.params.name}`) )
*/



const withDB = async(operations,res) => {
    try {
        const client = await MongoClient.connect("mongodb://localhost:27017/");
        const db = client.db("mernblog");
        await operations(db);
        client.close();

    } catch (error) {
        res.status(500).json({message: "Error connecting database",error});

        
    }
};

app.get("/api/articles/:name", async(req,res) => {
    withDB(async(db) => {
        const articleName = req.params.name;
        const articleInfo = await db.collection("articles").findOne({name: articleName});
        res.status(200).json(articleInfo);
        
    },res );
});


app.post("/api/articles/:name/add-comments", (req,res) => {
    const {username,text} = req.body;
    const articleName  = req.params.name;

    withDB(async(db) => {
        const articleInfo = await db.collection("articles").findOne({name: articleName});
        await db.collection("articles").updateOne(
                {name: articleName},
                {
                    $set:{
                        comments: articleInfo.comments.concat({username,text}),
                    },
                }

        );
        const updateArticleInfo = await db.collection("articles").findOne({name:articleName});
            res.status(200).json(updateArticleInfo)
    },res);
    // articleInfo[articleName].comments.push({username,text})
    // res.status(200).send(articleInfo[articleName])
});

app.listen(PORT, ()=> console.log(`Server started at port ${PORT}`));














// const express = require("express");
// const app = express();
// const { MongoClient } = require("mongodb");
// const PORT = process.env.PORT || 8000;

// // Initialize middleware
// // we use to have to install body parser but now it is a built in middleware
// // function of express. It parses incoming JSON payload
// app.use(express.json({ extended: false }));

// const withDB = async (operations, res) => {
//   try {
//     const client = await MongoClient.connect("mongodb://localhost:27017");
//     const db = client.db("mernblog");
//     await operations(db);
//     client.close();
//   } catch (error) {
//     res.status(500).json({ message: "Error connecting to database", error });
//   }
// };

// app.get("/api/articles/:name", async (req, res) => {
//   withDB(async (db) => {
//     const articleName = req.params.name;
//     const articleInfo = await db
//       .collection("articles")
//       .findOne({ name: articleName });
//     res.status(200).json(articleInfo);
//   }, res);
// });

// app.post("/api/articles/:name/add-comments", (req, res) => {
//   const { username, text } = req.body;
//   const articleName = req.params.name;

//   withDB(async (db) => {
//     const articleInfo = await db
//       .collection("articles")
//       .findOne({ name: articleName });
//     await db.collection("articles").updateOne(
//       { name: articleName },
//       {
//         $set: {
//           comments: articleInfo.comments.concat({ username, text }),
//         },
//       }
//     );
//     const updateAricleInfo = await db
//       .collection("articles")
//       .findOne({ name: articleName });
//     res.status(200).json(updateAricleInfo);
//   }, res);
// });

// app.listen(PORT, () => console.log(`Server started at port ${PORT}`));