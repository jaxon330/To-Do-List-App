const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');
const ejs = require("ejs");



const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

// mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true});
// 'mongodb+srv://admin:Test123@cluster0.8pkbafi.mongodb.net/ToDoList-APP'
mongoose.connect('mongodb+srv://admin:Test123@cluster0.8pkbafi.mongodb.net/ToDoList-APP', {useNewUrlParser: true});

const itemstSchema = new mongoose.Schema ({
  name: String
});

const Item = mongoose.model("Item", itemstSchema);

const item1 = new Item({
  name: "Welcome!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item"
});

const item3 = new Item({
  name: "<--- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3];


const listSchema = {
  name: String,
  items: [itemstSchema]
};

const List = mongoose.model('List', listSchema);



app.get("/", function(req, res) {
  Item.find({}, function(err, result) {
    if (result.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err)
        } else {
          console.log('Succesfully saved default items to DB.')
        }
      });
      res.redirect('/');
    } else {
      res.render("list", {listTitle: "Today", newListItems: result});
    }
  });

});

app.get('/:customListName', function(req, res) {
  let customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName}, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        //create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        }); 
      
        list.save();
        res.redirect('/'+ customListName)
      
      } else {
        // Show an existing list
        res.render('list', {listTitle: foundList.name, newListItems: foundList.items})
      }
    }
  })


});



app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item ({
    name: itemName
  });

  if (listName === 'Today') {
    newItem.save();
    res.redirect('/');
  } else {
    List.findOne({name: listName}, function(err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect('/'+ listName);
    });
  }

});

app.post('/delete', function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === 'Today') {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (err) {
        console.log(err)
      } else {
        console.log('Succesfully the document deleterd.')
        res.redirect('/')
      }
    });

  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if(!err) {
        res.redirect('/' + listName);
      }
    });
  }

});


app.get("/work", function(req, res) {
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});




























// const express = require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
//
// var items = ["Buy food", "Cook food", "Eat food"];
//
// const app = express();
//
// app.use(bodyParser.urlencoded({extended: true}));
// app.set('view engine', 'ejs');
//
// app.get("/", function(req, res) {
//
// var today = new Date();
// var options = {
//   weekday: "long",
//   day: "numeric",
//   month: "long"
// };
//
// var day = today.toLocaleDateString("en-US", options);
//
//   res.render("list", {kindOfDay: day, newListItems: items});
// });
//
// app.post("/", function(req, res) {
//   var item = req.body.newItem;
//   items.push(item);
//   res.redirect("/");
// });
//
//
//
// app.listen(3000, function() {
//   console.log("Server run on port 3000");
// });

// if (currentDay===6 || currentDay===0) {
//   day = "weekend";
// } else {
//   day = "weekday";
// }

 // ---------------------------------------
// var today = new Date();
// var currentDay = today.getDay();
// var day = "";

// switch (currentDay) {
//   case 0:
//     day = "Sunday";
//     break;
//
//     case 1:
//       day = "Monday";
//       break;
//
//       case 2:
//         day = "Tuesday";
//         break;
//         case 3:
//           day = "Wednesday";
//           break;
//           case 4:
//             day = "Thursday";
//             break;
//             case 5:
//               day = "Friday";
//               break;
//               case 6:
//                 day = "Saturday";
//                 break;
//   default:
//    console.log("Error: current day is equal to:" + currentDay);
//
// }
