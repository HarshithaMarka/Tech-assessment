# Stage 1: Build the React frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Spring Boot backend
FROM maven:3.9.5-eclipse-temurin-17 AS backend-builder
WORKDIR /app/backend
COPY Tech-assessment/pom.xml .
# Download dependencies first to cache them
RUN mvn dependency:go-offline -B
COPY Tech-assessment/src ./src
# Copy the built React app into Spring Boot's static resources folder
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static
# Package the application
RUN mvn clean package -DskipTests

# Stage 3: Run the Spring Boot application
FROM eclipse-temurin:17-jre
WORKDIR /app
# Railway injects the PORT environment variable. We expose 8080 by default.
EXPOSE 8080
COPY --from=backend-builder /app/backend/target/*.jar app.jar
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
