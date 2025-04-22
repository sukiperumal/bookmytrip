# PowerShell script for deploying the BookMyTrip application

# Stop and remove existing containers
Write-Host "Stopping and removing existing containers..." -ForegroundColor Cyan
docker-compose down

# Build and start containers
Write-Host "Building and starting containers..." -ForegroundColor Cyan
docker-compose up -d

# Wait for MongoDB to be ready
Write-Host "Waiting for MongoDB to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Run the seeder (optional)
$runSeeder = Read-Host "Do you want to run the seeder script? (y/n)"
if ($runSeeder -eq "y" -or $runSeeder -eq "Y") {
    Write-Host "Running seeder script..." -ForegroundColor Cyan
    docker exec bookmytrip_backend npm run seed
}

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Backend is running at: http://localhost:5000" -ForegroundColor Green