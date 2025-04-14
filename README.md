# bookmytrip
Tourism Website with Call Center Support and Vehicle Rental Management Services.

Tech Stack:-

BACKEND:- 
Node.js: Server-side JavaScript runtime
Express.js: Web application framework
MongoDB: NoSQL database

FRONTEND:-
React

List of Endpoints Implemented:- 

Vehicle Rentals Management Microservice:-
1. Vehicle Management

* GET /api/vehicles
Description: List all vehicles. Supports filtering and pagination via query parameters.
Query Parameters (Optional): type, location, minPrice, maxPrice, available, minSeats, search, sort, order, page, limit.

* GET /api/vehicles/:id
Description: Get details for a specific vehicle.
Path Parameter: :id (Vehicle's MongoDB ObjectId).

* GET /api/vehicles/types
Description: Get a distinct list of all available vehicle categories/types (e.g., 'car', 'motorcycle').

* GET /api/vehicles/availability
Description: Search for vehicles available within a specific date range and optionally at a specific location.
Query Parameters: startDate (YYYY-MM-DD), endDate (YYYY-MM-DD), locationId (Optional MongoDB ObjectId).

* GET /api/vehicles/:id/pricing
Description: Get calculated pricing details (daily, weekly, monthly estimates, fees, taxes) for a specific vehicle.
Path Parameter: :id (Vehicle's MongoDB ObjectId).

* POST /api/vehicles/:id/reviews
Description: Add a review (rating and comment) for a specific vehicle. Requires a JSON request body.
Path Parameter: :id (Vehicle's MongoDB ObjectId).

* GET /api/vehicles/:id/reviews
Description: Get all reviews for a specific vehicle.
Path Parameter: :id (Vehicle's MongoDB ObjectId).

2. Booking Management

* POST /api/bookings
Description: Create a new vehicle booking. Requires a JSON request body with booking details (vehicleId, dates, locations, etc.).

* GET /api/bookings/:id
Description: Get details of a specific booking.
Path Parameter: :id (Booking's MongoDB ObjectId).

* PUT /api/bookings/:id
Description: Update an existing booking (e.g., change dates, locations, special requests). Requires a JSON request body with fields to update.
Path Parameter: :id (Booking's MongoDB ObjectId).

* DELETE /api/bookings/:id
Description: Cancel a booking. Sets the booking status to 'cancelled'.
Path Parameter: :id (Booking's MongoDB ObjectId).


3. Location Management
* GET /api/locations
Description: List all pickup/dropoff locations. Supports filtering and pagination via query parameters.
Query Parameters (Optional): country, city, active, search, page, limit.

* GET /api/locations/:id
Description: Get details for a specific location.
Path Parameter: :id (Location's MongoDB ObjectId).

* GET /api/locations/:id/availability
Description: Check vehicle availability at a specific location for a given date range.
Path Parameter: :id (Location's MongoDB ObjectId).
Query Parameters: startDate (YYYY-MM-DD), endDate (YYYY-MM-DD).

5. Event Notifications (Webhooks)

* POST /api/webhooks/availability-change
Description: Endpoint to receive webhook notifications about vehicle availability changes (e.g., from an external system). Requires a JSON request body.

* POST /api/webhooks/booking-status-change
Description: Endpoint to receive webhook notifications about booking status changes (e.g., from a payment gateway or external system). Requires a JSON request body.


