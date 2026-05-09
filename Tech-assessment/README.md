# Task Manager API

A RESTful Spring Boot application for managing tasks with full CRUD operations.

## 📋 Project Description

Task Manager is a lightweight REST API built with Spring Boot that allows you to create, read, update, and delete tasks. It uses an in-memory H2 database for data persistence and is ready for deployment.

## ✨ Features

- **Create Tasks** - Add new tasks with title, description, and completion status
- **Read Tasks** - Get all tasks or fetch individual tasks by ID
- **Update Tasks** - Modify existing task details
- **Delete Tasks** - Remove tasks from the database
- **RESTful API** - Follows REST conventions with proper HTTP methods
- **H2 Database** - In-memory database for quick setup and testing
- **CORS Enabled** - Ready for frontend integration

## 🛠 Tech Stack

| Technology | Version |
|------------|---------|
| Java | 25 |
| Spring Boot | 3.2.0 |
| Spring Data JPA | 3.2.0 |
| H2 Database | 2.2.224 |
| Maven | 3.9.6 |

### Dependencies
- `spring-boot-starter-web` - REST API support
- `spring-boot-starter-data-jpa` - Database access
- `h2` - In-memory database
- `spring-boot-starter-test` - Testing framework

## 🚀 How to Run

### Prerequisites
- Java 25 or higher
- Maven 3.9+

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Tech-assessment
   ```

2. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

3. **Access the API**
   - Base URL: `http://localhost:8080`
   - H2 Console: `http://localhost:8080/h2-console`

## API Endpoints

### Base URL
```
http://localhost:8080/tasks
```

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/tasks` | Get all tasks | - |
| `GET` | `/tasks/{id}` | Get task by ID | - |
| `POST` | `/tasks` | Create new task | JSON |
| `PUT` | `/tasks/{id}` | Update existing task | JSON |
| `DELETE` | `/tasks/{id}` | Delete a task | - |

### Request Body Examples

#### Create/Update Task (JSON)
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "completed": false
}
```

### Response Examples

#### GET /tasks
```json
[
  {
    "id": 1,
    "title": "Sample Task",
    "description": "This is a sample task",
    "completed": false,
    "user": null
  }
]
```

#### GET /tasks/1
```json
{
  "id": 1,
  "title": "Sample Task",
  "description": "This is a sample task",
  "completed": false,
  "user": null
}
```

#### POST /tasks
```bash
curl -X POST http://localhost:8080/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Description","completed":false}'
```

#### PUT /tasks/1
```bash
curl -X PUT http://localhost:8080/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Task","description":"New Description","completed":true}'
```

#### DELETE /tasks/1
```bash
curl -X DELETE http://localhost:8080/tasks/1
```

## 🗄 Database Configuration

The application uses H2 in-memory database with the following configuration:

```properties
spring.datasource.url=jdbc:h2:mem:taskmanagerdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
```

## 📁 Project Structure

```
Tech-assessment/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           └── demo/
│       │               ├── DemoApplication.java
│       │               ├── controller/
│       │               │   └── TaskController.java
│       │               ├── entity/
│       │               │   ├── Task.java
│       │               │   └── User.java
│       │               ├── repository/
│       │               │   ├── TaskRepository.java
│       │               │   └── UserRepository.java
│       │               └── service/
│       │                   └── TaskService.java
│       └── resources/
│           └── application.properties
├── pom.xml
└── README.md
```

## 🔧 Build the Project

```bash
# Compile
mvn clean compile

# Package
mvn clean package

# Run tests
mvn test
```

## 📝 Notes

- The database is in-memory; data is lost when the application restarts
- For production, configure a persistent database (PostgreSQL, MySQL)
- CORS is enabled by default for frontend integration
- All endpoints return JSON responses

## 📄 License

This project is for educational purposes.