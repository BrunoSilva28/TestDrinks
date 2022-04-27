import app from './app';
import createDrink from './endpoints/createDrink';
import deleteDrink from './endpoints/deleteDrink';
import getAllDrinks from './endpoints/getAllDrinks';
import getDrinkById from './endpoints/getDrinkById';
import updateDrinkRating from './endpoints/updateDrinkRating';

app.get("/drink", getAllDrinks);
app.get("/drink/:id", getDrinkById);
app.post("/drink", createDrink);
app.put("/drink/:id", updateDrinkRating);
app.delete("/drink/:id", deleteDrink);