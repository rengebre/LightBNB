/* Insert Users */
INSERT INTO users (name, email, password) VALUES ('Russell', 'russell@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), ('Katie', 'k_dogg@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'), ('Sophie', 'sophizzle_ma_nizzle@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

/* Insert properties */
INSERT INTO properties (
  owner_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms,
  country,
  street,
  city,
  province,
  post_code
) VALUES (
  3,
  'Magic Mountain Theme Park',
  'description',
  '<enter url>',
  '<enter url>',
  420,
  69,
  1342,
  4,
  'Canada',
  '123 Fake Street',
  'Abbotsford',
  'British Columbia',
  'V42 1P3'
),
(
  1,
  'The Shanty',
  'description',
  '<enter url>',
  '<enter url>',
  69,
  1,
  0,
  1,
  'Canada',
  '8743 Bradner Rd',
  'Abbotsford',
  'British Columbia',
  'V4X 1M9'
),
(
  1,
  'The smallest house you ever done seen',
  'description',
  '<enter url>',
  '<enter url>',
  2000,
  0,
  0,
  1,
  'Canada',
  '1364 W 13th Ave',
  'Vancouver',
  'British Columbia',
  'V6H 1N8'
);

/* Insert reservations */
INSERT INTO reservations (start_date, end_date, property_id, guest_id) VALUES ('2021-09-01', '2021-09-13', 1, 2), ('2021-08-01', '2021-08-13', 3, 2), ('2021-10-01', '2021-10-08', 2, 2);

/* Insert property_reviews */
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) VALUES (2, 1, 1, 5, 'best theme park I have ever rented 12/5 stars'), (2, 3, 2, 4, 'could have used more moss'), (2, 2, 3, 3, 'my husband suffocated to death. view was nice though.');

