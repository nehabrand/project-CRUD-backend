const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/Food_List', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error", err));

const userSchema = new mongoose.Schema({
  Organization: {
    id: Number,
    name: String,
  },
  Item: {
    id: Number,
    type: String,
    
    description: String,
  },
  Pricing: {
    organization_id: String,
    item_id: Number,
    zone: String,
    base_distance_in_km: Number,
    km_price: Number,
    fix_price: Number,
  },
});

const UserModel = mongoose.model("user", userSchema);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/api/users', async (req, res) => {
  const users = await UserModel.find();
  return res.json(users);
});

app.route('/api/users/:id')
  .get(async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  })
  .patch(async (req, res) => {
    await UserModel.findByIdAndUpdate(req.params.id, {
      "Pricing": {
        "organization_id": "005",
        "item_id": "1",
        "zone": "central",
        "base_distance_in_km": "15",
        "km_price": "20.5",
        "fix_price": "10"

      }
     
      
     });
    return res.json({ status: 'changed' });
  })
  .delete(async (req, res) => {
    await UserModel.findByIdAndDelete(req.params.id);
    return res.json({ status: 'Delete' });
  });

app.post('/api/users/', async (req, res) => {
  const body = req.body;
  if (!body || 
    !body.Organization||
     !body.Item || 
     !body.Pricing)
     {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const result = await UserModel.create({
    Organization: body.Organization,
    Item: body.Item,
    Pricing: body.Pricing,
  });

  console.log("result", result);
  return res.status(201).json({ msg: "Success", user: result });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
