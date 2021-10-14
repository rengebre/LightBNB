SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating
FROM reservations
JOIN property_reviews ON reservations.id = reservation_id 
JOIN properties ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = 1
GROUP BY properties.id, reservations.id
HAVING end_date < now()::date
ORDER BY start_date
LIMIT 10;