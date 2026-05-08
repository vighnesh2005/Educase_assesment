//index.js
//importing necessary modules and setting up the environment variables
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './databaseSetup.js';

dotenv.config();

// initialize express app
const app = express();

// middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.get('/', (req, res) => {
    res.send('everything is working correctly');
});

/*
Add School API:
Endpoint: /addSchool
Method: POST
Payload: Includes name, address, latitude, and longitude.
Functionality: Validates the input data and adds a new school to the schools table.
Validation: Ensure all fields are properly validated before insertion (e.g., non-empty, correct data types).
*/
app.post('/addSchool', async(req,res)=>{
    const {name,address,latitude, longitude} = req.body;
    //validating input data
    if(!name || !address || latitude === undefined || longitude === undefined){
        return res.status(400).json({ error: 'All fields are required' });
    }
    if(typeof name !== 'string' || typeof address !== 'string' ||
        typeof latitude !== 'number' || typeof longitude !== 'number'){
        return res.status(400).json({ error: 'Invalid data types for one or more fields' });
    }

    try{
        let query = `
            SELECT * FROM Schools WHERE name = ? AND address = ?
        `
        const [existingSchool] = await db.query(query, [name, address]);
        if(existingSchool.length > 0){
            return res.status(400).json({ error: 'School with the same name and address already exists' });
        }
        query = `
            INSERT INTO Schools (name, address , latitude , longitude) VALUES (?,?,?,?)
        `;

        await db.query(query,[name, address, latitude, longitude]);
        res.status(201).json({ message: 'School added successfully' ,
            school: { name, address, latitude, longitude } });
    }
    catch(error){
        console.error('Error adding school:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

/*
List Schools API:
Endpoint: /listSchools
Method: GET
Parameters: User's latitude and longitude.
Functionality: Fetches all schools from the database, sorts them based on proximity to the user's location, and returns the sorted list.
Sorting Mechanism: Calculate and sort by the geographical distance between the user's coordinates and each school's coordinates.
*/
app.get('/listSchools', async (req,res) => {
    const { latitude , longitude } = req.query;
    if(latitude === undefined || longitude === undefined){
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    let lat = parseFloat(latitude);
    let lon = parseFloat(longitude);    
    if(isNaN(lat) || isNaN(lon)){
        return res.status(400).json({ error: 'Latitude and longitude must be valid numbers' });
    }
    if(lat < -90 || lat > 90){
    return res.status(400).json({
        error: "Invalid latitude"
    });
    }

    if(lon < -180 || lon > 180){
    return res.status(400).json({
        error: "Invalid longitude"
    });
    }

    try{
        // Haversine formula to calculate distance between two points on the Earth
        // formula = 6371 * acos( cos( radians(lat1) ) * cos( radians(lat2) )
        //  * cos( radians(lon2) - radians(lon1) ) + sin( radians(lat1) ) * sin( radians(lat2) ) )
        const query = `
            SELECT *, 
            ( 6371 * acos( cos( radians(?) ) * cos( radians(latitude) ) * cos( radians(longitude) - radians(?) ) + sin( radians(?) ) * sin( radians(latitude) ) ) ) AS distance 
            FROM Schools
            ORDER BY distance ASC
        `;
        const [schools] = await db.query(query, [lat, lon, lat]);

        res.status(200).json({ schools });
    }
    catch(error){
        console.error('Error listing schools:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

const port = process.env.PORT || 3000;


//starting the server abd creating the Schools table if it not exists
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await db.query(
        `
        CREATE TABLE IF NOT EXISTS Schools(
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(500) NOT NULL,
            latitude FLOAT NOT NULL,
            longitude FLOAT NOT NULL
        )      `
    )
    console.log('Database connected and Schools table created');
});