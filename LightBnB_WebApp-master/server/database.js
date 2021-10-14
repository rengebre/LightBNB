const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
  .query(`SELECT * FROM users WHERE email=$1`, [email])
  .then((res) => {
    if (res.rows.length < 1) {
      return null;
    }

    return res.rows[0];
  })
  .catch((err) => {
    console.log(err);
  });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
  .query(`SELECT * FROM users WHERE id=$1`, [id])
  .then((res) => {
    if (res.rows.length < 1) {
      return null;
    }

    return res.rows[0];
  })
  .catch((err) => {
    console.log(err);
  });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
  .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`, [user.name, user.email, user.password])
  .then((res) => {
    return res.rows[0];
  })
  .catch((err) => {
    console.log(err);
  });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
  .query(`SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
  FROM reservations
  JOIN property_reviews ON reservations.id = reservation_id 
  JOIN properties ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1
  GROUP BY properties.id, reservations.id
  ORDER BY start_date
  LIMIT $2;`, [guest_id, limit])
  .then(res => {
    return res.rows;
  })
  .catch(err => console.log(err));
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;  

  let whereString = "";
  
  // build up queryString if there are options passed into search
  if (Object.keys(options).length > 0) {
    queryString += `WHERE `;

    if (options.city) {
      queryParams.push(`%${options.city}%`);
      if (whereString !== "") {
        whereString += `AND city LIKE $${queryParams.length} `;
      } else {
        whereString += `city LIKE $${queryParams.length} `;
      }
    }

    if (options.owner_id) {
      queryParams.push(options.owner_id);
      if (whereString !== "") {
        whereString += `AND owner_id = $${queryParams.length} `;
      } else {
        whereString += `owner_id = $${queryParams.length} `;
      }
    }

    if (options.minimum_price_per_night) {
      queryParams.push(options.minimum_price_per_night * 100);
      if (whereString !== "") {
        whereString += `AND cost_per_night >= $${queryParams.length} `;
      } else {
        whereString += `cost_per_night >= $${queryParams.length} `;
      }

    }

    if (options.maximum_price_per_night) {
      queryParams.push(options.maximum_price_per_night * 100);
      if (whereString !== "") {
        whereString += `AND cost_per_night <= $${queryParams.length} `;
      } else {
        whereString += `cost_per_night <= $${queryParams.length} `;
      }
    }
    queryString += whereString;
  }

  queryString += `GROUP BY properties.id`;
  
  //Add HAVING for the minimum rating to make sure we're pulling the average rating and not just a single rating. This was a bug we noticed while adding rating to the WHERE call.

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `
    HAVING AVG(property_reviews.rating) >= $${queryParams.length} `
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length}`;
  

  console.log(queryString, queryParams);
  return pool.query(queryString, queryParams).then((res) => {
    return res.rows});
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
