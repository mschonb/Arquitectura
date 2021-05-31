// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();
const escapeHtml = require('escape-html');
const { parse } = require('qs');
const { user } = require('firebase-functions/lib/providers/auth');


    exports.oldAddQuestion = functions.https.onRequest(async (req, res) =>
    {
      /*
      input: question, correct answer, fake answers 1 2 and 3
      */
        const question = req.body.question;
        const answer = req.body.answer;
        const fanswer1 = req.body.fanswer1;
        const fanswer2 = req.body.fanswer2;
        const fanswer3 = req.body.fanswer3;

        const writeResult = await admin.firestore().collection('questions').add({
            answer: answer,
            question: question,
            fanswer1: fanswer1,
            fanswer2: fanswer2,
            fanswer3: fanswer3
        });
        res.json({result: `Message with ID: ${writeResult.id} added.`});
    });

    exports.addUser = functions.https.onRequest(async (req, res)=> {
      /*
      input: user unique identifier ex: email
      */
        const user = req.body.user;
        const userRef = db.collection('users');
        const queryRef = await userRef.where('user', '==', user).get();
        if (queryRef.empty){
            const writeResult = await db.collection('users').add({
                user: user,
                points: 0,
                num_games: 0,
                games: []
                });
            res.json({result: `Message with ID: ${writeResult.id} added.`});
        }
        else{
            res.json({result: `User already exists`});
        }
    });

    exports.setUserPoints = functions.https.onRequest(async (req, res) => {
      /*
      input: user unique identifier ex: email, points
      */
        const points = req.body.points;
        data = {
          points: parseInt(points)
        }
    
        const userdoc = await db.collection('users')
        .where('user', '==', req.body.user).get().then(snapshot => {
          snapshot.forEach(doc => {
            const docid = doc.id;
            db.collection('users').doc(docid).update(data);
          });
        }).catch(err =>{
          res.json({result: `Add points failed`});
        })
        res.json({result: `Message with ID:  added.`});
      });
    
      exports.addUserPoints = functions.https.onRequest(async (req, res) => {
         /*
        input: user unique identifier ex: email, points
         */
        const points = req.body.points;
    
        const userdoc = await db.collection('users')
        .where('user', '==', req.body.user).get().then(snapshot => {
          snapshot.forEach(doc => {
            const docid = doc.id;
            const data = {
              points: parseInt(points) + doc.data().points
            }
            db.collection('users').doc(docid).update(data);
          });
        }).catch(err =>{
          res.json({result: `Add points failed`});
        })
        res.json({result: `Message with ID:  added.`});
      });

      exports.createGame = functions.https.onRequest(async (req, res) =>{
         /*
        input: game name, topic
        */
        const name = req.body.name;
        const topic = req.body.topic;
        const maxplayers = 5;
        const full = false;

        const data = {
            name: name,
            topic: topic,
            max_players: maxplayers,
            isfull: false,
            players: [],
            questions: []
        }
        const writeResult = db.collection('games').add(data);
        res.json({result: `Game with ID: ${writeResult.id} added.`});
      });

      exports.addUser2Game = functions.https.onRequest(async (req, res)=> {
         /*
        input: user ID, game ID
        */
        //user
        userid = req.body.userid;
        const usersRef = db.collection('users').doc(userid);
        //game
        gameid = req.body.gameid;
        const gameRef = db.collection('games').doc(gameid);

        usersRef.get().then((docSnapshot) => {//check if user exists
            if (docSnapshot.exists) {
            usersRef.onSnapshot((doc) => {
              
              usersRef.update({
                games: admin.firestore.FieldValue.arrayUnion(gameid)
              }); //update user

              gameRef.update({
                players: admin.firestore.FieldValue.arrayUnion(userid)
              }); //update game


              res.json({result: 'Player added to game'});
        });
        } else {
            res.json({result: 'user does not exist'})
             // error
        }
      });
    });

    exports.getRandomQuestion = functions.https.onRequest(async (req, res) =>{
      /*
        input: user ID, game ID
      */
      const gameid = req.query.gameid;
      const gameRef = db.collection('games').doc(gameid);
      let question_id = '';
      //checking if game exists
      gameRef.get().then((docSnapshot) => {
        if (docSnapshot.exists){
          gameRef.onSnapshot((doc) => {
            //selection random question ID
            const questions = doc.data().questions;
            const len = doc.data().questions.length;
            const rand_q = Math.floor(Math.random() * len);
            question_id = questions[rand_q];  
            
            //check if question exists
            const questionRef = db.collection('questions').doc(question_id);
            questionRef.get().then((docSnapshot) =>{
              if(docSnapshot.exists){
                questionRef.onSnapshot((doc)=>{
                  res.json(doc.data());
                })
              }else{
                res.json({result:'question does not exists'});
              }
            })
          })
        }else{
          res.json({result: 'game does not exists'});
        }
      });
    });

    exports.getUserByName = functions.https.onRequest(async (req, res)=>{
      /*
        input: username ex:(email) / is unique
      */
      const username = req.query.user;
      const userRef = db.collection('users');

      userRef.where('user', '==', username).get().then(snapshot =>{ 
        snapshot.forEach(doc =>{//should only retrieve a single user
          data = doc.data();
          data.id = doc.id;
          res.json(data);
        })
      })
    });

    exports.getUserByID = functions.https.onRequest(async (req, res)=>{
      const userid = req.query.userid;
      const userRef = db.collection('users').doc(userid);
      
      userRef.get().then((docSnapshot) =>{
        if(docSnapshot.exists){
          userRef.onSnapshot((doc)=>{
            data = doc.data();
            data.id = doc.id;
            res.json(data);
          })
        }else{
          res.json({result:'user does not exist'});
        }
      })

    });



    /*
returns 
[
  {"title" : "game 1 name here", "category": "game category here", "id": "game id here"},
  {"title" : "game 2 name here", "category": "game category here", "id": "game id here"},
  {"title" : "game 3 name here", "category": "game category here", "id": "game id here"},
]
*/
exports.getContests = functions.https.onRequest(async (req, res) => {
  var all_docs = [];
  try{
    const contests = await admin.firestore().collection('games').get();
    contests.docs.forEach(doc => {
      all_docs.push({'title': doc._fieldsProto.title.stringValue, 'category': doc._fieldsProto.category.stringValue, 'id': doc._ref._path.segments[1]});
      // all_docs.push({'title': doc._fieldsProto.title.stringValue, 'id': doc._ref._path.segments[1]});
    });
    return res.status(200).json(all_docs);
  }catch(error){
    return res.status(500).json(error.message);
  }
});


/*
returns
[
  {
    "question": "Mexican year of independence",
    "correct_answer": "1810",
    "incorrect_answers": 
      [
        "1710",
        "1910",
        "2010"
      ]
  },
  {
    "question": "Mexican year of independence",
    "correct_answer": "1810",
    "incorrect_answers": 
      [
        "1710",
        "1910",
        "2010"
      ]
  },
  {
    "question": "Mexican year of independence",
    "correct_answer": "1810",
    "incorrect_answers": 
      [
        "1710",
        "1910",
        "2010"
      ]
  }
]
*/
exports.getQuestions = functions.https.onRequest(async (req, res) => {
  var all_questions = [];
  const cont_id = req.query.contest;
  try{
    const questions = await admin.firestore().collection('questions').where("contest_id", "==", cont_id).get();
    // const questions = await admin.firestore().collection('questions').get();
    
    questions.docs.forEach(doc => {
      var obj = {'question': doc._fieldsProto.question.stringValue,
            'correct_answer': doc._fieldsProto.correct_answer.stringValue};
      var wrong_answers = [];
      doc._fieldsProto.incorrect_answers.arrayValue.values.forEach(elem => {
        wrong_answers.push(elem.stringValue);
      });
      obj.incorrect_answers = wrong_answers;
      all_questions.push(obj);
    });
    
    
    // return res.status(200).json(questions.docs);
    return res.status(200).json({results: all_questions});


    // const questions = await admin.firestore().collection('questions').get();
    // return res.status(200).json(questions.docs);
  }catch(error){
    return res.status(500).json(error.message);
  }
});

exports.addContest = functions.https.onRequest(async (req, res) =>{
  const title = req.query.title;
  const category = req.query.category;
  const writeResult = await admin.firestore().collection('games').add({'title':title, 'category':category});
  res.json({result: `Contest with ID: ${writeResult.id}`});
});

exports.addQuestion = functions.https.onRequest(async (req, res) => {
  const id = req.query.id;
  const question = req.query.question;
  const correct = req.query.correct;
  const answers = req.query.answers.split(",");
  const writeResult = await admin.firestore().collection('questions').add({
    'question': question,
    'correct_answer': correct,
    'incorrect_answers': answers,
    'contest_id': id
  });
  res.json({result: `Created | {"question id": ${writeResult.id}, "contest id": ${id}}`})
});