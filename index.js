const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db/db.connect");
const app = express();
const Hotel = require("./models/hotel.models");
app.use(express.json());
initializeDatabase();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

async function createHotel(newHotel){
    try {
        const hotel = new Hotel(newHotel);
        const saveHotel = await hotel.save();
        return saveHotel;
    } catch (error) {
        console.error('Error creating hotel', error);
    }
}

app.post("/hotels", async (req, res) =>{
    try{
        const savedHotel = await createHotel(req.body);
        res.status(201).json({message: "hotel added successfully", hotel: savedHotel});

    } catch(error){
        res.status(500).json({error: "Failed to fetch hotel"});
    }
})

// read all hotels from the database
async function allHotels() {
   try{
     const Hotels = await Hotel.find();
     return Hotels; 
   } catch(error){
    throw error
   }
}

app.get("/hotels", async (req, res) => {
    try{
      const hotels = await allHotels();
      if(hotels.length > 0){
        res.json(hotels)
      } else{
        res.status(404).json({error: "No hotels found"});
      }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch hotels"});
    }
});

// read a hotel by its name
async function hotelByName(hotelName){
    try{
      const hotel = await Hotel.findOne({name: hotelName})
      return hotel;
    } catch(error) {
        throw error
    }
}

app.get("/hotels/:hotelName", async (req, res) => {
    try{
        const hotel = await hotelByName(req.params.hotelName);
        if(hotel){
            res.json(hotel);
        } else {
            res.status(404).json({error: "No hotel found"});
        }

    } catch (error) {
        res.status(500).json({error: "Failed to fetch hotels"});
    }
})

// read all hotels which offers parking space
async function allHotels1(parkingAvailable){
    try{
     const hotels = await Hotel.find({isParkingAvailable: parkingAvailable });
     return hotels;
    }catch(error){
        throw error
    }
}
// allHotels1(true);


// read all hotels which has restaurant available
async function restaurantAvailable(isRestaurantAvailable){
    try{
      const restaurant = await Hotel.find({isRestaurantAvailable: isRestaurantAvailable});
      console.log(restaurant);
    } catch (error){
        throw error
    }
}
// restaurantAvailable(true);


// read all hotels by category ("Mid-Range")
async function hotelsByCategory(hotelsCategory){
    try{
      const hotelCategory = await Hotel.find({category: hotelsCategory});
      return hotelCategory;
    } catch(error){
        throw error
    }
}

app.get("/hotels/category/:hotelCategory", async (req, res) => {
    try{
        const hotel = await hotelsByCategory(req.params.hotelCategory);
        if(hotel.length > 0){
            res.json(hotel);
        } else {
            res.status(404).json({error: "No hotels found"});
        }

    } catch(error){
        res.status(500).json({error: "Failed to fetch hotel"});
    }
})

//  read all hotels by price range ("$$$$ (61+)")
async function priceRange(hotelsPrice){
    try{
      const hotelPrice = await Hotel.find({priceRange:hotelsPrice});
      return hotelPrice
    } catch(error) {
        throw error
    }
}
// priceRange("$$$$ (61+)")


//  read all hotels with 4.0 rating
async function hotelRating(hotelsRating){
    try{
      const ratingsHotel = await Hotel.find({rating:hotelsRating});
      return ratingsHotel;
    } catch(error){
        throw error
    }
}

app.get("/hotels/rating/:hotelRating", async (req, res) =>{
    try{
        const hotel = await hotelRating(req.params.hotelRating);
        if(hotel){
            res.json(hotel);
        } else{
            res.status(404).json({error: "No hotel found"});
        }

    } catch (error){
        res.status(500).json({error: "Failed to fetch hotel"})
    }
})

//  read a hotel by phone number ("+1299655890")
async function hotelByPhoneNumber(phoneNumber){
    try{
      const hotelNumber = await Hotel.findOne({phoneNumber: phoneNumber});
      return hotelNumber;
    } catch(error){
        throw error
    }
}

app.get("/hotels/directory/:phoneNumber", async (req, res) => {
    try{
        const hotel = await hotelByPhoneNumber(req.params.phoneNumber);
        if(hotel){
            res.json(hotel);
        } else {
            res.status(404).json({error: "No hotel found"});
        }

    } catch (error){
        res.status(500).json({error: "Failed to fetch hotel"});
    }
})

async function deleteHotel(hotelId){
    try{
      const deleteHotel = await Hotel.findByIdAndDelete(hotelId);
      return deleteHotel;
    } catch (error){
        throw error
    }
}

app.delete("/hotels/:hotelId", async (req, res) =>{
    try{
      const deletedHotel = await Hotel.findByIdAndDelete(req.params.hotelId);
      res.status(200).json({message: "hotel deleted successfully"});
    } catch (error){
      res.status(500).json({error: "Failed to delete hotel"});
    }
})

async function updateHotel(hotelId, dataToUpdate){
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, {new: true});
        return updatedHotel;

    }catch(error){
        console.log("Error in updating hotel rating");
    }
}
// updateHotel("6a4d2c428f68e6cad44e4015", {rating: 4.8})

app.post("/hotels/:hotelId", async (req, res) =>{
    try{
        const updatedHotel = await updateHotel(req.params.hotelId, req.body);
        if(updatedHotel){
            res.status(200).json({message: "Hotel updated Successfully"});
        } else{
            res.status(404).json({error: "Hotel not found"});
        }

    } catch(error){
        res.status(500).json({error: "Failed to update hotel"});
    }
})

const PORT = 5000
app.listen(PORT, () => {
    console.log("Server is running on", PORT);
})