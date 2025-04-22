#!/bin/bash

# Stop and remove existing containers
echo "Stopping and removing existing containers..."
docker-compose down

# Build and start containers
echo "Building and starting containers..."
docker-compose up -d

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
sleep 10

# Run the seeder (optional)
read -p "Do you want to run the seeder script? (y/n): " run_seeder
if [ "$run_seeder" = "y" ] || [ "$run_seeder" = "Y" ]; then
  echo "Running seeder script..."
  docker exec bookmytrip_backend npm run seed
fi

echo "Deployment completed successfully!"
echo "Backend is running at: http://localhost:5000"