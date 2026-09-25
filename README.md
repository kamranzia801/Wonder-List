Used copilot Ai for this documentaion

# Wonder List

Wonder List is a full-stack accommodation listing application built with Node.js, Express, MongoDB, and server-rendered EJS templates. Users can browse and search listings, create accounts, upload listing images, leave reviews, and manage listings they own.

## Features

- Browse all accommodation listings.
- Search listings by title, description, location, or country.
- View listing details, ownership information, reviews, ratings, and map location.
- Create an account and log in with Passport local authentication.
- Create, edit, and delete listings after signing in.
- Upload listing images to Cloudinary.
- Add and delete reviews with ratings from 1 to 5.
- Protect listing and review actions with authentication and ownership middleware.
- Store sessions in MongoDB Atlas with `connect-mongo`.
- Display success and error feedback with flash messages.
- Validate listing and review data with Joi.
- Use Mapbox geocoding and maps on listing detail pages.

## Technology Stack

### Runtime and server

- Node.js `24.18.0`
- Express `5`
- CommonJS modules
- EJS and EJS Mate for server-side rendering
- `method-override` for PUT and DELETE form requests

### Database and persistence

- MongoDB Atlas
- Mongoose
- MongoDB Node.js driver
- MongoStore for persistent Express sessions

### Authentication and security

- Passport
- Passport Local Strategy
- Passport Local Mongoose
- Express Session
- Cookie Parser
- Connect Flash
- Joi request validation

### File uploads and media

- Multer
- Multer Storage Cloudinary
- Cloudinary

### Frontend

- EJS templates
- Bootstrap 5
- Boxicons
- Font Awesome
- Custom CSS
- Mapbox GL JS

## Project Structure

```text
Wonder-List/
├── app.js                  # Express application and middleware setup
├── cloudConfig.js          # Cloudinary and upload storage configuration
├── middlewear.js           # Authentication, authorization, and validation middleware
├── schema.js               # Joi listing and review validation schemas
├── package.json            # Dependencies and npm scripts
├── controllers/            # Request handlers for listings, reviews, and users
├── models/                 # Mongoose User, Listing, and Review models
├── routes/                 # Listing, review, and authentication routes
├── init/
│   ├── data.js             # Sample listing data
│   ├── index.js            # Local sample-data initialization
│   └── migrate.js          # Local MongoDB to Atlas migration utility
├── public/
│   ├── css/                # Application and rating styles
│   └── js/                 # Client-side scripts and Mapbox map logic
├── uploads/                # Local upload destination used by Multer
├── utils/                  # Express error and async helpers
└── views/                  # EJS pages, layouts, and shared partials
```

## Prerequisites

- Node.js `24.18.0` or a compatible recent Node.js release
- npm
- A MongoDB Atlas cluster
- A MongoDB Atlas database user
- An Atlas network access rule for your current IP address
- A Cloudinary account for listing images
- A Mapbox access token for listing maps

## Installation

1. Clone the repository and open the project directory.

	```bash
	git clone <your-repository-url>
	cd Wonder-List
	```

2. Install dependencies.

	```bash
	npm install
	```

3. Create a `.env` file in the project root. Do not commit this file.

	```env
	ATLAS_DB_URL=mongodb+srv://<username>:<password>@<cluster-host>/wounderlist?retryWrites=true&w=majority
	SECRET=replace-with-a-long-random-session-secret
	CLOUD_NAME=your-cloudinary-cloud-name
	CLOUD_API_KEY=your-cloudinary-api-key
	CLOUD_API_SECRET=your-cloudinary-api-secret
	MAP_TOKEN=your-mapbox-public-token
	NODE_ENV=development
	```

	URL-encode special characters in the MongoDB password. For example, `@` becomes `%40`.

4. Start the application.

	```bash
	node app.js
	```

	The application runs at `http://localhost:8080`.

	During development, `nodemon app.js` can be used when Nodemon is installed globally or as a development dependency.

## Database Migration

The project includes a migration utility for copying the local `wounderlist` database to MongoDB Atlas:

```bash
npm run migrate:atlas
```

The command uses:

```env
LOCAL_DB_URL=mongodb://127.0.0.1:27017/wounderlist
ATLAS_DB_URL=mongodb+srv://<username>:<password>@<cluster-host>/wounderlist
```

The migration preserves document IDs and references between users, listings, and reviews. It clears each matching Atlas collection before copying the local documents, so do not run it against an Atlas database containing data that must be preserved.

## Main Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/listings` | Browse and search listings |
| GET | `/listings/new` | Show the new listing form |
| POST | `/listings` | Create a listing |
| GET | `/listings/:id` | View a listing |
| GET | `/listings/:id/edit` | Show the edit form |
| PUT | `/listings/:id` | Update an owned listing |
| DELETE | `/listings/:id` | Delete an owned listing |
| POST | `/listings/:id/reviews` | Add a review |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete an authored review |
| GET | `/signup` | Show the registration form |
| POST | `/signup` | Register a user |
| GET | `/login` | Show the login form |
| POST | `/login` | Authenticate a user |
| GET | `/logout` | Log out the current user |

## Data Models

### User

Stores username, email, and Passport Local Mongoose authentication fields.

### Listing

Stores title, description, price, location, country, Cloudinary image details, owner, and referenced reviews.

### Review

Stores a comment, a rating from 1 to 5, creation date, and the author reference.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm install` | Install project dependencies |
| `node app.js` | Start the Express server |
| `npm run migrate:atlas` | Copy the local database to MongoDB Atlas |
| `npm test` | Placeholder script; automated tests are not configured yet |

## Deployment Notes

- Set all environment variables in the hosting provider's secret or environment settings.
- Set `NODE_ENV=production` in production.
- Add the deployment server's IP address to MongoDB Atlas Network Access.
- Use a strong, unique value for `SECRET`.
- Never commit `.env`, database credentials, or Cloudinary secrets.
- Confirm that the Atlas user has the required permissions for the application database.

## License

This project currently uses the ISC license declared in `package.json`.
